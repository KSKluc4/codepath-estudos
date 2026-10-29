import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import type { Root, RootContent, Heading, List, ListItem, Blockquote, Code } from "mdast";
import { Exercicio, QuizPergunta, SecaoConteudo } from "./types";
import { BlocoCodigo } from "./exercicios-codigo";

const renderProcessor = unified()
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeStringify);

function nodesToHtml(nodes: RootContent[]): string {
  const root: Root = { type: "root", children: nodes };
  const hastTree = renderProcessor.runSync(root);
  return renderProcessor.stringify(hastTree as never) as string;
}

function inlineHtml(nodes: RootContent[]): string {
  const html = nodesToHtml(nodes).trim();
  return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "");
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function extractText(node: RootContent): string {
  if ("value" in node && typeof node.value === "string") return node.value;
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map((c) => extractText(c as RootContent)).join("");
  }
  return "";
}

function headingText(node: Heading): string {
  return extractText(node as unknown as RootContent);
}

interface Secao {
  titulo: string | null;
  nodes: RootContent[];
}

function agruparPorH2(children: RootContent[]): Secao[] {
  const secoes: Secao[] = [{ titulo: null, nodes: [] }];
  for (const node of children) {
    if (node.type === "heading" && (node as Heading).depth === 2) {
      secoes.push({ titulo: headingText(node as Heading), nodes: [] });
    } else {
      secoes[secoes.length - 1].nodes.push(node);
    }
  }
  return secoes;
}

function agruparPorH3(nodes: RootContent[]): Secao[] {
  const secoes: Secao[] = [{ titulo: null, nodes: [] }];
  for (const node of nodes) {
    if (node.type === "heading" && (node as Heading).depth === 3) {
      secoes.push({ titulo: headingText(node as Heading), nodes: [] });
    } else {
      secoes[secoes.length - 1].nodes.push(node);
    }
  }
  return secoes;
}

// Cards do modo lição: o tamanho é estimado em "linhas na tela" para que um
// bloco de código de 10 linhas pese mais que um parágrafo curto.
const LIMITE_LINHAS_CARD = 14;

function linhasDoTexto(node: RootContent, colunas: number): number {
  return Math.ceil(extractText(node).length / colunas);
}

function linhasVisuais(node: RootContent): number {
  switch (node.type) {
    case "code":
      return node.value.split("\n").length + 1;
    case "heading":
      return 2;
    case "list":
      return node.children.reduce((total, item) => total + linhasDoTexto(item, 70), 1);
    case "table":
      return node.children.length * 1.5 + 1;
    default:
      return linhasDoTexto(node, 75) + 1;
  }
}

function pesoDosBlocos(nodes: RootContent[]): number {
  return nodes.reduce((total, n) => total + linhasVisuais(n), 0);
}

function dividirLista(lista: List): List[] {
  if (linhasVisuais(lista) <= LIMITE_LINHAS_CARD || lista.children.length < 2) return [lista];
  const partes: List[] = [];
  let itens: ListItem[] = [];
  let peso = 0;
  let inicio = lista.start ?? 1;
  for (const item of lista.children) {
    const linhas = linhasDoTexto(item, 70);
    if (itens.length > 0 && peso + linhas > LIMITE_LINHAS_CARD) {
      partes.push({ ...lista, start: inicio, children: itens });
      inicio += itens.length;
      itens = [];
      peso = 0;
    }
    itens.push(item);
    peso += linhas;
  }
  partes.push({ ...lista, start: inicio, children: itens });
  return partes;
}

// Quebra só em linha em branco seguida de código na coluna 0 (novo exemplo),
// nunca no meio de uma função ou antes de um "}".
function dividirCodigo(code: Code): Code[] {
  if (linhasVisuais(code) <= LIMITE_LINHAS_CARD) return [code];
  const linhas = code.value.split("\n");
  const trechos: string[][] = [[]];
  linhas.forEach((linha, i) => {
    if (i > 0 && linhas[i - 1].trim() === "" && /^[^\s})\]]/.test(linha)) trechos.push([]);
    trechos[trechos.length - 1].push(linha);
  });

  const partes: Code[] = [];
  let atual: string[] = [];
  for (const trecho of trechos) {
    if (atual.length > 0 && atual.length + trecho.length >= LIMITE_LINHAS_CARD) {
      partes.push({ ...code, value: atual.join("\n").trimEnd() });
      atual = [];
    }
    atual.push(...trecho);
  }
  partes.push({ ...code, value: atual.join("\n").trimEnd() });
  return partes;
}

function introduzProximoBloco(node: RootContent): boolean {
  if (node.type === "heading") return true;
  return node.type === "paragraph" && extractText(node).trim().endsWith(":");
}

function dividirEmPartes(nodes: RootContent[]): RootContent[][] {
  const blocos = nodes.flatMap((n): RootContent[] => {
    if (n.type === "list") return dividirLista(n);
    if (n.type === "code") return dividirCodigo(n);
    return [n];
  });
  const partes: RootContent[][] = [];
  let atual: RootContent[] = [];
  let peso = 0;

  for (const bloco of blocos) {
    const linhas = linhasVisuais(bloco);
    const subtituloComCardCheio =
      bloco.type === "heading" && bloco.depth === 3 && peso >= LIMITE_LINHAS_CARD / 2;
    const soTemGancho = atual.length === 1 && introduzProximoBloco(atual[0]);
    if (atual.length > 0 && !soTemGancho && (peso + linhas > LIMITE_LINHAS_CARD || subtituloComCardCheio)) {
      // "Veja o exemplo:" ou um ### não podem ficar sozinhos no fim do card
      const gancho = atual.length > 1 && introduzProximoBloco(atual[atual.length - 1]) ? atual.pop() : undefined;
      partes.push(atual);
      atual = gancho ? [gancho] : [];
      peso = gancho ? linhasVisuais(gancho) : 0;
    }
    atual.push(bloco);
    peso += linhas;
  }

  if (atual.length > 0) {
    const anterior = partes[partes.length - 1];
    const sobraPequena = peso < LIMITE_LINHAS_CARD * 0.35;
    if (anterior && sobraPequena && pesoDosBlocos(anterior) + peso <= LIMITE_LINHAS_CARD * 1.3) {
      anterior.push(...atual);
    } else {
      partes.push(atual);
    }
  }
  return partes;
}

function parseSecaoConteudo(
  titulo: string | null,
  nodes: RootContent[],
  secao: number,
  blocosCodigo: BlocoCodigo[]
): SecaoConteudo {
  const partes = dividirEmPartes(nodes);
  partes.forEach((blocos, parte) => {
    for (const bloco of blocos) {
      if (bloco.type !== "code") continue;
      blocosCodigo.push({ secao, parte, linguagem: (bloco.lang ?? "").toLowerCase(), codigo: bloco.value });
    }
  });
  return { titulo, partes: partes.map(nodesToHtml) };
}

function parseExercicio(secao: Secao): Exercicio {
  const idxSolucao = secao.nodes.findIndex(
    (n) => n.type === "heading" && (n as Heading).depth === 3 && normalize(headingText(n as Heading)).startsWith("solucao")
  );
  const enunciadoNodes = idxSolucao === -1 ? secao.nodes : secao.nodes.slice(0, idxSolucao);
  const solucaoNodes = idxSolucao === -1 ? [] : secao.nodes.slice(idxSolucao + 1);
  return {
    titulo: secao.titulo ?? "Exercício",
    enunciadoHtml: nodesToHtml(enunciadoNodes),
    solucaoHtml: nodesToHtml(solucaoNodes),
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseQuizPergunta(secao: Secao): QuizPergunta | null {
  if (!secao.titulo) return null;
  const perguntaTexto = secao.titulo.replace(/^\d+[.)]\s*/, "");
  const listaNode = secao.nodes.find((n) => n.type === "list") as List | undefined;
  const blockquoteNode = secao.nodes.find((n) => n.type === "blockquote") as Blockquote | undefined;

  const opcoes = (listaNode?.children ?? []).map((item) => ({
    html: inlineHtml(item.children as RootContent[]),
    correta: item.checked === true,
  }));

  return {
    perguntaHtml: escapeHtml(perguntaTexto),
    opcoes,
    explicacaoHtml: blockquoteNode ? nodesToHtml(blockquoteNode.children as RootContent[]) : "",
  };
}

export interface LessonBody {
  introHtml: string;
  secoes: SecaoConteudo[];
  blocosCodigo: BlocoCodigo[];
  exercicios: Exercicio[];
  quiz: QuizPergunta[];
  duvidaHtml: string;
}

export function parseLessonBody(markdown: string): LessonBody {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
  const secoesH2 = agruparPorH2(tree.children);

  const introNodes: RootContent[] = [];
  const secoes: SecaoConteudo[] = [];
  const blocosCodigo: BlocoCodigo[] = [];
  const exercicios: Exercicio[] = [];
  let quiz: QuizPergunta[] = [];
  let duvidaNodes: RootContent[] = [];

  for (const secao of secoesH2) {
    if (secao.titulo === null) {
      introNodes.push(...secao.nodes);
      if (secao.nodes.length > 0) secoes.push(parseSecaoConteudo(null, secao.nodes, secoes.length, blocosCodigo));
      continue;
    }
    const tituloNorm = normalize(secao.titulo);
    if (tituloNorm.startsWith("quiz")) {
      const perguntasSecoes = agruparPorH3(secao.nodes).filter((s) => s.titulo !== null);
      quiz = perguntasSecoes
        .map(parseQuizPergunta)
        .filter((q): q is QuizPergunta => q !== null);
    } else if (tituloNorm.startsWith("exercicio")) {
      exercicios.push(parseExercicio(secao));
    } else if (tituloNorm.startsWith("tirou duvida") || tituloNorm.startsWith("tirou a duvida")) {
      duvidaNodes = secao.nodes;
    } else {
      introNodes.push({ type: "heading", depth: 2, children: [{ type: "text", value: secao.titulo }] } as RootContent);
      introNodes.push(...secao.nodes);
      secoes.push(parseSecaoConteudo(secao.titulo, secao.nodes, secoes.length, blocosCodigo));
    }
  }

  return {
    introHtml: nodesToHtml(introNodes),
    secoes,
    blocosCodigo,
    exercicios,
    quiz,
    duvidaHtml: duvidaNodes.length ? nodesToHtml(duvidaNodes) : "",
  };
}
