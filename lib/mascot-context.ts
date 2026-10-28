import { getLessonBySlug } from "./lessons";
import { getChapterBySlug } from "./chapters";
import { MESES } from "./months";
import { TRILHAS, getTrackMeta } from "./tracks";
import { NIVEL_LABELS } from "./niveis";
import { htmlParaTexto } from "./html-texto";
import { MASCOTE_NOME } from "./mascote";

const LIMITE_CONTEUDO = 6000;

const PROMPT_BASE = `Você é o ${MASCOTE_NOME}, o mascote do CodePath: uma plataforma de estudos de programação em português, com um curso de 6 meses (da lógica binária ao projeto final) e trilhas de referência de linguagens.

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

export function montarSystemPrompt(pathname: string): string {
  const aula = pathname.match(/^\/aula\/([^/]+)\/?$/);
  const capitulo = pathname.match(/^\/linguagens\/([^/]+)\/([^/]+)\/?$/);

  const contexto =
    (aula && contextoAula(decodificar(aula[1]))) ||
    (capitulo && contextoCapitulo(decodificar(capitulo[1]), decodificar(capitulo[2]))) ||
    contextoGeral();

  return `${PROMPT_BASE}\n\n${contexto}`;
}
