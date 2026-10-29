// Gera exercícios de código ("Monte o código" e "Complete a lacuna") a partir dos blocos
// de código que já existem no conteúdo. Tudo é determinístico por lição: a mesma semente
// (o slug) sempre gera os mesmos exercícios, então o servidor consegue reconstruí-los
// pelo índice sem confiar em nada que venha do navegador.

export interface BlocoCodigo {
  secao: number;
  parte: number;
  linguagem: string;
  codigo: string;
}

interface ExercicioBase {
  secao: number;
  parte: number;
  linguagem: string;
  linhas: string[];
}

export interface ExercicioMontar extends ExercicioBase {
  tipo: "montar";
  ordem: number[];
}

export interface ExercicioLacuna extends ExercicioBase {
  tipo: "lacuna";
  linha: number;
  inicio: number;
  fim: number;
  opcoes: string[];
  correta: number;
}

export type ExercicioCodigo = ExercicioMontar | ExercicioLacuna;

const COMENTARIO: Record<string, string> = {
  python: "#",
  py: "#",
  bash: "#",
  sh: "#",
  shell: "#",
  sql: "--",
  javascript: "//",
  js: "//",
  typescript: "//",
  ts: "//",
  c: "//",
  cpp: "//",
  "c++": "//",
  csharp: "//",
  cs: "//",
};

const RESERVADAS = new Set(
  `if elif else for while return def class import from as in not and or is none true false pass break
  continue lambda with try except finally raise yield global function const let var new this typeof
  instanceof null undefined of switch case default do async await export int float double char void
  long short unsigned signed bool boolean string auto struct typedef include using namespace std public
  private static readonly select where insert into values update set delete create table join on group
  by order having primary key varchar text integer limit distinct echo then fi done esac local`.split(/\s+/)
);

// Palavras-chave que valem uma lacuna, e grupos que não podem ser distratores entre si
// porque um trocaria pelo outro e o código continuaria fazendo sentido
const CHAVES_LACUNA = new Set(
  `def return for while if elif else import from in class lambda break continue not with try except
  function const let new of await async typeof struct sizeof select where join on group order insert
  into values update set delete create table having limit distinct then fi do done case esac`.split(/\s+/)
);

const GRUPOS_TROCAVEIS = [
  ["if", "elif", "while"],
  ["for", "while"],
  ["and", "or"],
  ["let", "const", "var"],
  ["in", "of"],
  ["break", "continue"],
  ["where", "having"],
  ["==", "!=", "<=", ">=", "<", ">"],
  ["+=", "-=", "*=", "/="],
  ["&&", "||"],
];

const SAIDA = new Set(["print", "printf", "println", "log", "echo", "puts", "writeline", "write", "cout"]);
const MUTADORES =
  "append|push|pop|sort|insert|remove|extend|add|update|clear|reverse|push_back|emplace_back|splice|shift|unshift|discard|Add|Remove|Insert|Clear|Sort";
const FECHAMENTOS = new Set(["}", "};", "})", "end", "fi", "done", "esac"]);

function gerador(semente: string): () => number {
  // mulberry32: gerador pseudoaleatório pequeno com semente (Math.random não aceita semente)
  let estado = 2166136261;
  for (const letra of semente) estado = Math.imul(estado ^ letra.charCodeAt(0), 16777619);
  return () => {
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), estado | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function embaralhar<T>(lista: T[], aleatorio: () => number): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Troca o conteúdo de strings e comentários por espaços sem mudar o tamanho da linha,
// para que as posições dos tokens continuem valendo na linha original
function mascarar(linha: string, comentario: string): string {
  let mascara = linha.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, (s) =>
    s[0] + " ".repeat(s.length - 2) + s[s.length - 1]
  );
  const posComentario = mascara.indexOf(comentario);
  if (posComentario >= 0) mascara = mascara.slice(0, posComentario) + " ".repeat(mascara.length - posComentario);
  return mascara;
}

function ehComentario(linha: string, comentario: string): boolean {
  const t = linha.trim();
  return t.startsWith(comentario) || t.startsWith("/*") || t.startsWith("*");
}

function indentacao(linha: string): number {
  return linha.length - linha.trimStart().length;
}

function ehReservada(nome: string): boolean {
  return RESERVADAS.has(nome.toLowerCase());
}

interface Analise {
  define: Set<string>;
  usa: Set<string>;
}

function analisar(linha: string, comentario: string): Analise {
  const limpa = mascarar(linha, comentario);
  const define = new Set<string>();
  const usa = new Set<string>();

  const atribuicao = limpa.match(/^\s*(?:[A-Za-z_][\w<>[\]]*\s+)*\**\s*([A-Za-z_]\w*)\s*(?:\[[^\]]*\])?\s*([+\-*/%]?=)(?!=)/);
  let ladoEsquerdo = -1;
  if (atribuicao && !ehReservada(atribuicao[1])) {
    define.add(atribuicao[1]);
    if (atribuicao[2] !== "=") usa.add(atribuicao[1]);
    ladoEsquerdo = limpa.indexOf(atribuicao[1]);
  }
  const declaracao = limpa.match(/\b(?:def|function|class|struct)\s+([A-Za-z_]\w*)/);
  if (declaracao) define.add(declaracao[1]);
  const laco = limpa.match(/\bfor\s*\(?\s*(?:[A-Za-z_]\w*\s+)?([A-Za-z_]\w*)\s+(?:in|of)\b/) ?? limpa.match(/\bfor\s*\(\s*\w+\s+([A-Za-z_]\w*)\s*=/);
  if (laco) define.add(laco[1]);
  for (const m of limpa.matchAll(new RegExp(`([A-Za-z_]\\w*)\\s*\\.\\s*(?:${MUTADORES})\\s*\\(`, "g"))) define.add(m[1]);
  for (const m of limpa.matchAll(/([A-Za-z_]\w*)\s*(?:\+\+|--)|(?:\+\+|--)\s*([A-Za-z_]\w*)/g)) define.add(m[1] ?? m[2]);
  const tabela = limpa.match(/\b(?:create\s+table|insert\s+into|update|delete\s+from)\s+([A-Za-z_]\w*)/i);
  if (tabela) define.add(tabela[1]);

  for (const m of limpa.matchAll(/[A-Za-z_]\w*/g)) {
    if (m.index === ladoEsquerdo || ehReservada(m[0])) continue;
    usa.add(m[0]);
  }
  return { define, usa };
}

function cruzam(a: Set<string>, b: Set<string>): boolean {
  for (const item of a) if (b.has(item)) return true;
  return false;
}

// A ordem só é única se cada linha depende da anterior: dado criado antes, variável
// reatribuída ou estrutura de bloco (indentação). Linhas independentes podem trocar de
// lugar, então o bloco é ambíguo e fica de fora
function ordemUnica(linhas: string[], comentario: string): boolean {
  const analises = linhas.map((l) => analisar(l, comentario));
  return linhas.slice(1).every((linha, i) => {
    const a = analises[i];
    const b = analises[i + 1];
    return (
      indentacao(linha) !== indentacao(linhas[i]) ||
      cruzam(a.define, b.usa) ||
      cruzam(a.usa, b.define) ||
      cruzam(a.define, b.define)
    );
  });
}

function linhasUteis(bloco: BlocoCodigo): string[] {
  const comentario = COMENTARIO[bloco.linguagem];
  return bloco.codigo
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l) => l.trim() !== "" && !ehComentario(l, comentario));
}

function candidatoMontar(bloco: BlocoCodigo, aleatorio: () => number): ExercicioMontar | undefined {
  const comentario = COMENTARIO[bloco.linguagem];
  const linhas = linhasUteis(bloco);
  if (linhas.length < 3 || linhas.length > 8 || linhas.some((l) => l.length > 80)) return undefined;
  const repetidas = linhas.map((l) => l.trim()).filter((l, i, todas) => todas.indexOf(l) !== i);
  if (repetidas.some((l) => !FECHAMENTOS.has(l))) return undefined;
  if (Math.min(...linhas.map(indentacao)) !== indentacao(linhas[0])) return undefined;
  if (!ordemUnica(linhas, comentario)) return undefined;

  const original = linhas.join("\n");
  const indices = linhas.map((_, i) => i);
  let ordem = embaralhar(indices, aleatorio);
  for (let tentativa = 0; ordem.map((i) => linhas[i]).join("\n") === original && tentativa < 10; tentativa++) {
    ordem = embaralhar(indices, aleatorio);
  }
  if (ordem.map((i) => linhas[i]).join("\n") === original) return undefined;
  return { tipo: "montar", secao: bloco.secao, parte: bloco.parte, linguagem: bloco.linguagem, linhas, ordem };
}

interface Token {
  texto: string;
  categoria: "funcao" | "chave" | "operador";
  linha: number;
  inicio: number;
}

// Nomes que a própria aula cria (funções, classes, variáveis). Numa lacuna eles seriam
// ambíguos: qualquer nome serviria no lugar de "somar" em "int somar(int a, int b)"
function nomesDefinidos(blocos: BlocoCodigo[]): Set<string> {
  const nomes = new Set<string>();
  for (const bloco of blocos) {
    const comentario = COMENTARIO[bloco.linguagem];
    for (const linha of linhasUteis(bloco)) {
      const limpa = mascarar(linha, comentario);
      analisar(linha, comentario).define.forEach((nome) => nomes.add(nome));
      const cabecalho = limpa.match(/^\s*[\w:<>,*&]+(?:\s+[\w:<>,*&]+)*\s+[*&]?\s*([A-Za-z_]\w*)\s*\([^;]*$/);
      if (cabecalho && !ehReservada(cabecalho[1])) nomes.add(cabecalho[1]);
      for (const m of limpa.matchAll(/\b[A-Z]\w*\s+([a-z_]\w*)\s*[({]/g)) nomes.add(m[1]);
      const metodo = limpa.match(/^\s*(?:async\s+)?([A-Za-z_]\w*)\s*\([^)]*\)\s*\{\s*$/);
      if (metodo && !ehReservada(metodo[1])) nomes.add(metodo[1]);
    }
  }
  return nomes;
}

function tokensDoBloco(bloco: BlocoCodigo, linhas: string[], definidos: Set<string>): Token[] {
  const comentario = COMENTARIO[bloco.linguagem];
  const tokens: Token[] = [];
  linhas.forEach((linha, n) => {
    const limpa = mascarar(linha, comentario);
    for (const m of limpa.matchAll(/([A-Za-z_]\w{2,})\s*\(/g)) {
      const nome = m[1];
      if (!ehReservada(nome) && !SAIDA.has(nome.toLowerCase()) && !definidos.has(nome)) {
        tokens.push({ texto: nome, categoria: "funcao", linha: n, inicio: m.index });
      }
    }
    for (const m of limpa.matchAll(/[A-Za-z_]\w*/g)) {
      if (CHAVES_LACUNA.has(m[0].toLowerCase())) tokens.push({ texto: m[0], categoria: "chave", linha: n, inicio: m.index });
    }
    for (const m of limpa.matchAll(/==|!=|<=|>=|\+=|-=|\*=|\/=|&&|\|\||=>|->|\*\*|\/\/|%/g)) {
      tokens.push({ texto: m[0], categoria: "operador", linha: n, inicio: m.index });
    }
  });
  return tokens;
}

function trocaveis(a: string, b: string): boolean {
  return GRUPOS_TROCAVEIS.some((grupo) => grupo.includes(a.toLowerCase()) && grupo.includes(b.toLowerCase()));
}

function candidatoLacuna(
  bloco: BlocoCodigo,
  todosOsBlocos: BlocoCodigo[],
  aleatorio: () => number
): ExercicioLacuna | undefined {
  const linhas = linhasUteis(bloco);
  if (linhas.length < 2 || linhas.length > 12) return undefined;
  const mesmaLinguagem = todosOsBlocos.filter((b) => b.linguagem === bloco.linguagem);
  const definidos = nomesDefinidos(mesmaLinguagem);
  const tokens = tokensDoBloco(bloco, linhas, definidos);
  const daAula = mesmaLinguagem.flatMap((b) => tokensDoBloco(b, linhasUteis(b), definidos));
  const peso = { funcao: 3, chave: 2, operador: 1 };

  const opcoesValidas = tokens
    .filter((t) => {
      const linha = linhas[t.linha];
      if (linha.length > 80) return false;
      // O token tem que aparecer uma vez só no bloco (senão a resposta está na linha de
      // cima) e precisa sobrar código suficiente em volta da lacuna
      const padrao = /\w/.test(t.texto) ? new RegExp(`\\b${t.texto}\\b`, "g") : null;
      const vezes = linhas.reduce(
        (total, l) => total + (padrao ? (l.match(padrao) ?? []).length : l.split(t.texto).length - 1),
        0
      );
      return vezes === 1 && linha.replace(t.texto, "").replace(/\W/g, "").length >= 4;
    })
    .map((t) => {
      const distratores = [...tokens, ...daAula]
        .filter((d) => d.categoria === t.categoria && d.texto !== t.texto && !trocaveis(d.texto, t.texto))
        .map((d) => d.texto)
        .filter((texto, i, todos) => todos.indexOf(texto) === i);
      return { token: t, distratores };
    })
    .filter(({ distratores }) => distratores.length >= 3);
  if (opcoesValidas.length === 0) return undefined;

  const melhorPeso = Math.max(...opcoesValidas.map(({ token }) => peso[token.categoria]));
  const melhores = opcoesValidas.filter(({ token }) => peso[token.categoria] === melhorPeso);
  const { token, distratores } = melhores[Math.floor(aleatorio() * melhores.length)];
  const opcoes = embaralhar([token.texto, ...embaralhar(distratores, aleatorio).slice(0, 3)], aleatorio);
  return {
    tipo: "lacuna",
    secao: bloco.secao,
    parte: bloco.parte,
    linguagem: bloco.linguagem,
    linhas,
    linha: token.linha,
    inicio: token.inicio,
    fim: token.inicio + token.texto.length,
    opcoes,
    correta: opcoes.indexOf(token.texto),
  };
}

export function gerarExerciciosCodigo(blocos: BlocoCodigo[], semente: string): ExercicioCodigo[] {
  const aleatorio = gerador(semente);
  const validos = blocos.filter((b) => b.linguagem in COMENTARIO);
  const montar = validos.map((b) => candidatoMontar(b, aleatorio)).filter((e) => e !== undefined);
  const lacunas = validos.map((b) => candidatoLacuna(b, validos, aleatorio)).filter((e) => e !== undefined);

  const escolhidos: ExercicioCodigo[] = [];
  const mesmoBloco = (a: ExercicioCodigo, b: ExercicioCodigo) => a.secao === b.secao && a.parte === b.parte;
  const sortear = (lista: ExercicioCodigo[]) => {
    const livres = lista.filter((e) => !escolhidos.some((x) => mesmoBloco(x, e)));
    return livres[Math.floor(aleatorio() * livres.length)];
  };

  // Um de cada tipo quando dá; senão até dois do mesmo tipo, de blocos diferentes
  for (const lista of [montar, lacunas, montar, lacunas] as ExercicioCodigo[][]) {
    if (escolhidos.length === 2) break;
    const escolhido = sortear(lista);
    if (escolhido) escolhidos.push(escolhido);
  }
  return escolhidos.sort((a, b) => a.secao - b.secao || a.parte - b.parte);
}
