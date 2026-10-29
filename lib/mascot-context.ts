import { getLessonBySlug } from "./lessons";
import { getChapterBySlug } from "./chapters";
import { MESES } from "./months";
import { TRILHAS, getTrackMeta } from "./tracks";
import { NIVEL_LABELS } from "./niveis";
import { htmlParaTexto } from "./html-texto";
import { MASCOTE_NOME } from "./mascote";
import { QuizPergunta } from "./types";
import { ExercicioCodigo } from "./exercicios-codigo";

const LIMITE_CONTEUDO = 6000;
const LIMITE_OPCAO = 400;
const LIMITE_EXPLICACAO = 1200;

const PROMPT_BASE = `Você é o ${MASCOTE_NOME}, o mascote do CodePath: uma pequena raposa-dragão feita de luz, com uma chama na ponta da cauda. O CodePath é uma plataforma de estudos de programação em português, com um curso de 6 meses (da lógica binária ao projeto final) e trilhas de referência de linguagens.

Seu papel é tirar dúvidas de estudantes, como um colega mais experiente que senta do lado e ajuda.
- Responda sempre em português do Brasil, com tom amigável, paciente e direto.
- Seja breve: no máximo 3 parágrafos curtos, a não ser que o aluno peça mais detalhes.
- Explique o porquê, não só o como. Use exemplos pequenos e concretos.
- Em exercícios, dê pistas e faça perguntas que levem o aluno à resposta antes de entregar a solução pronta.
- Se a pergunta for vaga, peça o contexto exato: o que tentou, o que esperava e o que aconteceu.
- Use texto simples. Para código, use blocos com três crases.
- Se não souber algo ou a pergunta fugir de programação e estudos, diga isso com honestidade.`;

function contextoGeral(): string {
  const meses = MESES.map((m) => `- Mês ${m.mes} (${m.nome}): ${m.titulo}`).join("\n");
  const trilhas = TRILHAS.map((t) => `- ${t.nome}`).join("\n");
  return `O aluno não está em nenhuma aula específica agora. Se ele só disser oi, apresente-se e conte rapidamente o que o CodePath oferece.

Curso de 6 meses:
${meses}

Trilhas de Linguagens:
${trilhas}`;
}

function contextoAula(slug: string): string | undefined {
  const aula = getLessonBySlug(slug);
  if (!aula) return undefined;
  const mes = MESES.find((m) => m.mes === aula.mes);
  return `O aluno está agora nesta aula do curso. Use o conteúdo abaixo como base para as respostas.

Aula: ${aula.titulo}
Mês ${aula.mes}${mes ? ` (${mes.titulo})` : ""}, aula ${aula.numero}
Objetivo: ${aula.objetivo}

Conteúdo da aula:
${htmlParaTexto(aula.introHtml, LIMITE_CONTEUDO)}`;
}

function contextoCapitulo(trilha: string, capitulo: string): string | undefined {
  const cap = getChapterBySlug(trilha, capitulo);
  if (!cap) return undefined;
  const nomeTrilha = getTrackMeta(trilha)?.nome ?? trilha;
  return `O aluno está agora neste capítulo da trilha de ${nomeTrilha}. Use o conteúdo abaixo como base para as respostas.

Capítulo ${cap.numero}: ${cap.titulo}
Nível: ${NIVEL_LABELS[cap.nivel]}
Objetivo: ${cap.objetivo}

Conteúdo do capítulo:
${htmlParaTexto(cap.introHtml, LIMITE_CONTEUDO)}`;
}

function decodificar(segmento: string): string {
  try {
    return decodeURIComponent(segmento);
  } catch {
    return segmento;
  }
}

function lerPathname(pathname: string) {
  const aula = pathname.match(/^\/aula\/([^/]+)\/?$/);
  const capitulo = pathname.match(/^\/linguagens\/([^/]+)\/([^/]+)\/?$/);
  return {
    aula: aula ? decodificar(aula[1]) : undefined,
    capitulo: capitulo ? { trilha: decodificar(capitulo[1]), capitulo: decodificar(capitulo[2]) } : undefined,
  };
}

export function montarSystemPrompt(pathname: string): string {
  const { aula, capitulo } = lerPathname(pathname);

  const contexto =
    (aula && contextoAula(aula)) ||
    (capitulo && contextoCapitulo(capitulo.trilha, capitulo.capitulo)) ||
    contextoGeral();

  return `${PROMPT_BASE}\n\n${contexto}`;
}

function conteudoDoPathname(pathname: string) {
  const { aula, capitulo } = lerPathname(pathname);
  if (aula) return getLessonBySlug(aula);
  if (capitulo) return getChapterBySlug(capitulo.trilha, capitulo.capitulo);
  return undefined;
}

function quizDoPathname(pathname: string): QuizPergunta[] | undefined {
  return conteudoDoPathname(pathname)?.quiz;
}

const INSTRUCAO_BALAO =
  "Sua resposta aparece num balão pequeno ao lado do mascote. Fale direto com o aluno, com tom encorajador. Não use listas, títulos, markdown nem blocos de código.";

// A pergunta e a opção vêm só como índices: o texto é resolvido aqui no servidor,
// então o cliente não consegue injetar prompt.
export function montarExplicacaoErro(
  pathname: string,
  perguntaIndex: unknown,
  opcaoEscolhida: unknown
): { system: string; pedido: string } | undefined {
  const quiz = quizDoPathname(pathname);
  if (!quiz || !Number.isInteger(perguntaIndex) || !Number.isInteger(opcaoEscolhida)) return undefined;

  const pergunta = quiz[perguntaIndex as number];
  const escolhida = pergunta?.opcoes[opcaoEscolhida as number];
  const correta = pergunta?.opcoes.find((o) => o.correta);
  if (!escolhida || !correta || escolhida.correta) return undefined;

  const opcoes = pergunta.opcoes.map((o, i) => `${i + 1}. ${htmlParaTexto(o.html, LIMITE_OPCAO)}`).join("\n");

  const system = `${montarSystemPrompt(pathname)}

O aluno está no modo lição e acabou de errar esta pergunta:
Pergunta: ${htmlParaTexto(pergunta.perguntaHtml, LIMITE_OPCAO)}
Opções:
${opcoes}
Resposta do aluno: ${htmlParaTexto(escolhida.html, LIMITE_OPCAO)}
Resposta correta: ${htmlParaTexto(correta.html, LIMITE_OPCAO)}
Explicação do material: ${htmlParaTexto(pergunta.explicacaoHtml, LIMITE_EXPLICACAO)}

Em no máximo 3 frases curtas, explique por que a opção que o aluno escolheu está errada (qual confusão provavelmente levou a ela) e o que torna a correta certa. ${INSTRUCAO_BALAO}`;

  return { system, pedido: "Por que a minha resposta está errada?" };
}

function respostaDeMontar(exercicio: ExercicioCodigo, resposta: unknown): number[] | undefined {
  const total = exercicio.linhas.length;
  if (!Array.isArray(resposta) || resposta.length !== total) return undefined;
  const indices = resposta.filter((i): i is number => Number.isInteger(i) && i >= 0 && i < total);
  return indices.length === total && new Set(indices).size === total ? indices : undefined;
}

// Igual à explicação do quiz: o exercício é gerado de novo aqui a partir do conteúdo da
// aula; do navegador só chegam índices (opção da lacuna ou ordem das linhas)
export function montarExplicacaoExercicio(
  pathname: string,
  exercicioIndex: unknown,
  resposta: unknown
): { system: string; pedido: string } | undefined {
  const exercicios = conteudoDoPathname(pathname)?.exerciciosCodigo;
  if (!exercicios || !Number.isInteger(exercicioIndex)) return undefined;
  const exercicio = exercicios[exercicioIndex as number];
  if (!exercicio) return undefined;

  const codigo = exercicio.linhas.join("\n");
  let situacao: string;
  if (exercicio.tipo === "lacuna") {
    if (!Number.isInteger(resposta) || resposta === exercicio.correta) return undefined;
    const escolhida = exercicio.opcoes[resposta as number];
    if (escolhida === undefined) return undefined;
    const linha = exercicio.linhas[exercicio.linha];
    situacao = `Exercício "complete a lacuna" (${exercicio.linguagem}). Código:
${codigo}

Na linha "${linha.slice(0, exercicio.inicio)}____${linha.slice(exercicio.fim)}" o aluno escolheu "${escolhida}", mas o certo é "${exercicio.opcoes[exercicio.correta]}". Opções: ${exercicio.opcoes.join(", ")}.

Em no máximo 3 frases curtas, explique por que "${escolhida}" não serve ali e o que "${exercicio.opcoes[exercicio.correta]}" faz nessa linha.`;
  } else {
    const ordem = respostaDeMontar(exercicio, resposta);
    if (!ordem) return undefined;
    const montado = ordem.map((i) => exercicio.linhas[i]).join("\n");
    if (montado === codigo) return undefined;
    situacao = `Exercício "monte o código" (${exercicio.linguagem}): o aluno precisava ordenar as linhas.
Ordem do aluno:
${montado}

Ordem certa:
${codigo}

Em no máximo 3 frases curtas, aponte a primeira linha fora do lugar e explique por que ela precisa vir antes ou depois (o que ela usa ou cria).`;
  }

  return {
    system: `${montarSystemPrompt(pathname)}\n\nO aluno está no modo lição e acabou de errar um exercício de código.\n${situacao} ${INSTRUCAO_BALAO}`,
    pedido: "Por que a minha resposta está errada?",
  };
}
