import { Exercicio, QuizPergunta, SecaoConteudo } from "./types";
import { ExercicioCodigo, ExercicioLacuna, ExercicioMontar } from "./exercicios-codigo";

export const VIDAS_POR_LICAO = 3;
export const XP_POR_ACERTO = 10;

export type CardLicao =
  | { tipo: "conceito"; titulo: string | null; html: string; secao: number; parte: number; totalPartes: number }
  | { tipo: "pergunta"; indice: number; pergunta: QuizPergunta }
  | { tipo: "montar"; indice: number; exercicio: ExercicioMontar }
  | { tipo: "lacuna"; indice: number; exercicio: ExercicioLacuna }
  | { tipo: "desafio"; indice: number; exercicio: Exercicio };

// Cards que valem XP, mexem no combo e gastam vida quando errados
export type CardPontuado = Extract<CardLicao, { tipo: "pergunta" | "montar" | "lacuna" }>;

export function ehPontuado(card: CardLicao | undefined): card is CardPontuado {
  return card?.tipo === "pergunta" || card?.tipo === "montar" || card?.tipo === "lacuna";
}

export interface ItemFila {
  card: CardLicao;
  ordemOpcoes: number[];
  repeticao: boolean;
}

export type FaseLicao = "card" | "feedback" | "fim" | "sem-vidas";

export interface EstadoLicao {
  fila: ItemFila[];
  posicao: number;
  fase: FaseLicao;
  selecionada: number | null;
  resposta: number[];
  acertou: boolean | null;
  solucaoVisivel: boolean;
  vidas: number;
  xp: number;
  combo: number;
  comboMax: number;
  acertos: number;
  respostas: number;
  concluidos: number;
  total: number;
}

// As perguntas são espalhadas de forma uniforme entre os cards de conceito
// (ex.: 10 conceitos e 5 perguntas → uma pergunta a cada 2 conceitos). Os exercícios
// de código entram logo depois do conceito de onde o bloco de código saiu.
export function montarCards(
  secoes: SecaoConteudo[],
  quiz: QuizPergunta[],
  exercicios: Exercicio[],
  exerciciosCodigo: ExercicioCodigo[] = []
): CardLicao[] {
  const conceitos = secoes.flatMap((secao, s) =>
    secao.partes.map((html, i) => ({
      tipo: "conceito" as const,
      titulo: secao.titulo,
      html,
      secao: s,
      parte: i + 1,
      totalPartes: secao.partes.length,
    }))
  );
  const codigo = exerciciosCodigo.map(
    (exercicio, indice): Extract<CardLicao, { tipo: "montar" | "lacuna" }> =>
      exercicio.tipo === "montar" ? { tipo: "montar", indice, exercicio } : { tipo: "lacuna", indice, exercicio }
  );
  const perguntas: CardLicao[] = quiz
    .map((pergunta, indice) => ({ tipo: "pergunta" as const, indice, pergunta }))
    .filter((card) => card.pergunta.opcoes.length > 0);
  const desafios: CardLicao[] = exercicios.map((exercicio, indice) => ({ tipo: "desafio", indice, exercicio }));

  const cards: CardLicao[] = [];
  let proxima = 0;
  conceitos.forEach((conceito, i) => {
    cards.push(conceito);
    cards.push(...codigo.filter((c) => c.exercicio.secao === conceito.secao && c.exercicio.parte === conceito.parte - 1));
    const vistos = i + 1;
    while (
      proxima < perguntas.length &&
      Math.max(1, Math.floor(((proxima + 1) * conceitos.length) / perguntas.length)) <= vistos
    ) {
      cards.push(perguntas[proxima++]);
    }
  });
  cards.push(...perguntas.slice(proxima), ...desafios);
  return cards;
}

function embaralhar(quantidade: number, aleatorio: () => number): number[] {
  const ordem = Array.from({ length: quantidade }, (_, i) => i);
  for (let i = ordem.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }
  return ordem;
}

function textoMontado(exercicio: ExercicioMontar, ordem: number[]): string {
  return ordem.map((i) => exercicio.linhas[i]).join("\n");
}

// No "Monte o código", ordemOpcoes é a ordem em que as linhas aparecem embaralhadas.
// Na primeira vez usa a ordem fixa do exercício; na repetição, embaralha de novo.
function criarItem(card: CardLicao, aleatorio: () => number, repeticao = false): ItemFila {
  let ordemOpcoes: number[] = [];
  if (card.tipo === "pergunta") ordemOpcoes = embaralhar(card.pergunta.opcoes.length, aleatorio);
  if (card.tipo === "lacuna") ordemOpcoes = embaralhar(card.exercicio.opcoes.length, aleatorio);
  if (card.tipo === "montar") {
    const correto = card.exercicio.linhas.join("\n");
    ordemOpcoes = card.exercicio.ordem;
    while (repeticao && textoMontado(card.exercicio, ordemOpcoes) === correto) {
      ordemOpcoes = embaralhar(card.exercicio.linhas.length, aleatorio);
    }
  }
  return { card, ordemOpcoes, repeticao };
}

export function iniciarLicao(cards: CardLicao[], aleatorio: () => number): EstadoLicao {
  return {
    fila: cards.map((card) => criarItem(card, aleatorio)),
    posicao: 0,
    fase: cards.length > 0 ? "card" : "fim",
    selecionada: null,
    resposta: [],
    acertou: null,
    solucaoVisivel: false,
    vidas: VIDAS_POR_LICAO,
    xp: 0,
    combo: 0,
    comboMax: 0,
    acertos: 0,
    respostas: 0,
    concluidos: 0,
    total: cards.length,
  };
}

export function itemAtual(estado: EstadoLicao): ItemFila | undefined {
  return estado.fila[estado.posicao];
}

export function multiplicadorCombo(combo: number): number {
  if (combo >= 5) return 3;
  if (combo >= 3) return 2;
  return 1;
}

export function selecionarOpcao(estado: EstadoLicao, posicaoOpcao: number): EstadoLicao {
  const item = itemAtual(estado);
  if (estado.fase !== "card" || (item?.card.tipo !== "pergunta" && item?.card.tipo !== "lacuna")) return estado;
  if (posicaoOpcao < 0 || posicaoOpcao >= item.ordemOpcoes.length) return estado;
  return { ...estado, selecionada: posicaoOpcao };
}

function montando(estado: EstadoLicao): ExercicioMontar | undefined {
  const card = itemAtual(estado)?.card;
  return estado.fase === "card" && card?.tipo === "montar" ? card.exercicio : undefined;
}

export function colocarLinha(estado: EstadoLicao, linha: number): EstadoLicao {
  const exercicio = montando(estado);
  if (!exercicio || estado.resposta.includes(linha) || linha < 0 || linha >= exercicio.linhas.length) return estado;
  return { ...estado, resposta: [...estado.resposta, linha] };
}

export function retirarLinha(estado: EstadoLicao, posicao: number): EstadoLicao {
  if (!montando(estado) || posicao < 0 || posicao >= estado.resposta.length) return estado;
  return { ...estado, resposta: estado.resposta.filter((_, i) => i !== posicao) };
}

export function moverLinha(estado: EstadoLicao, de: number, para: number): EstadoLicao {
  const { resposta } = estado;
  if (!montando(estado) || de === para || para < 0 || para >= resposta.length || de < 0 || de >= resposta.length) {
    return estado;
  }
  const nova = resposta.filter((_, i) => i !== de);
  nova.splice(para, 0, resposta[de]);
  return { ...estado, resposta: nova };
}

export function podeVerificar(estado: EstadoLicao): boolean {
  const card = itemAtual(estado)?.card;
  if (estado.fase !== "card" || !ehPontuado(card)) return false;
  if (card.tipo === "montar") return estado.resposta.length === card.exercicio.linhas.length;
  return estado.selecionada !== null;
}

function respostaCorreta(estado: EstadoLicao, item: ItemFila): boolean {
  const { card } = item;
  const escolhida = item.ordemOpcoes[estado.selecionada ?? -1];
  if (card.tipo === "pergunta") return card.pergunta.opcoes[escolhida]?.correta === true;
  if (card.tipo === "lacuna") return escolhida === card.exercicio.correta;
  // Qualquer ordem que gere o mesmo texto vale (ex.: duas linhas "}" trocadas)
  if (card.tipo === "montar") return textoMontado(card.exercicio, estado.resposta) === card.exercicio.linhas.join("\n");
  return false;
}

export function verificarResposta(estado: EstadoLicao): EstadoLicao {
  const item = itemAtual(estado);
  if (!item || !podeVerificar(estado)) return estado;

  const base = { ...estado, fase: "feedback" as const, respostas: estado.respostas + 1 };
  if (respostaCorreta(estado, item)) {
    const combo = estado.combo + 1;
    return {
      ...base,
      acertou: true,
      combo,
      comboMax: Math.max(estado.comboMax, combo),
      xp: estado.xp + XP_POR_ACERTO * multiplicadorCombo(combo),
      acertos: estado.acertos + 1,
      concluidos: estado.concluidos + 1,
    };
  }
  return { ...base, acertou: false, combo: 0, vidas: estado.vidas - 1 };
}

export function revelarSolucao(estado: EstadoLicao): EstadoLicao {
  return itemAtual(estado)?.card.tipo === "desafio" ? { ...estado, solucaoVisivel: true } : estado;
}

export function continuar(estado: EstadoLicao, aleatorio: () => number): EstadoLicao {
  const item = itemAtual(estado);
  if (!item) return estado;

  let { fila, concluidos } = estado;
  if (ehPontuado(item.card)) {
    if (estado.fase !== "feedback") return estado;
    if (!estado.acertou) {
      if (estado.vidas <= 0) return { ...estado, fase: "sem-vidas" };
      // Igual ao Duolingo: a pergunta errada volta no fim da fila (antes dos desafios
      // opcionais), com as opções em outra ordem
      const inicioDesafios = fila.findIndex((it, i) => i > estado.posicao && it.card.tipo === "desafio");
      const destino = inicioDesafios === -1 ? fila.length : inicioDesafios;
      fila = [...fila.slice(0, destino), criarItem(item.card, aleatorio, true), ...fila.slice(destino)];
    }
  } else {
    if (estado.fase !== "card") return estado;
    concluidos += 1;
  }

  const posicao = estado.posicao + 1;
  return {
    ...estado,
    fila,
    concluidos,
    posicao,
    fase: posicao >= fila.length ? "fim" : "card",
    selecionada: null,
    resposta: [],
    acertou: null,
    solucaoVisivel: false,
  };
}

export function precisao(estado: EstadoLicao): number | null {
  return estado.respostas > 0 ? Math.round((estado.acertos / estado.respostas) * 100) : null;
}
