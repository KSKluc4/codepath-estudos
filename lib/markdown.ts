import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import type { Root, RootContent, Heading, List, Blockquote } from "mdast";
import { Exercicio, QuizPergunta } from "./types";

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
  exercicios: Exercicio[];
  quiz: QuizPergunta[];
}

export function parseLessonBody(markdown: string): LessonBody {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
  const secoesH2 = agruparPorH2(tree.children);

  const introNodes: RootContent[] = [];
  const exercicios: Exercicio[] = [];
  let quiz: QuizPergunta[] = [];

  for (const secao of secoesH2) {
    if (secao.titulo === null) {
      introNodes.push(...secao.nodes);
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
    } else {
      introNodes.push({ type: "heading", depth: 2, children: [{ type: "text", value: secao.titulo }] } as RootContent);
      introNodes.push(...secao.nodes);
    }
  }

  return {
    introHtml: nodesToHtml(introNodes),
    exercicios,
    quiz,
  };
}
