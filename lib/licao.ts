import { Exercicio, QuizPergunta, SecaoConteudo } from "./types";

export const VIDAS_POR_LICAO = 3;
export const XP_POR_ACERTO = 10;

export type CardLicao =
  | { tipo: "conceito"; titulo: string | null; html: string; parte: number; totalPartes: number }
  | { tipo: "pergunta"; indice: number; pergunta: QuizPergunta }
  | { tipo: "desafio"; indice: number; exercicio: Exercicio };

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
// (ex.: 10 conceitos e 5 perguntas → uma pergunta a cada 2 conceitos).
export function montarCards(
  secoes: SecaoConteudo[],
  quiz: QuizPergunta[],
  exercicios: Exercicio[]
): CardLicao[] {
  const conceitos: CardLicao[] = secoes.flatMap((secao) =>
    secao.partes.map((html, i) => ({
      tipo: "conceito" as const,
      titulo: secao.titulo,
      html,
      parte: i + 1,
      totalPartes: secao.partes.length,
    }))
  );
  const perguntas: CardLicao[] = quiz
    .map((pergunta, indice) => ({ tipo: "pergunta" as const, indice, pergunta }))
    .filter((card) => card.pergunta.opcoes.length > 0);
  const desafios: CardLicao[] = exercicios.map((exercicio, indice) => ({ tipo: "desafio", indice, exercicio }));

  const cards: CardLicao[] = [];
  let proxima = 0;
  conceitos.forEach((conceito, i) => {
    cards.push(conceito);
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

function criarItem(card: CardLicao, aleatorio: () => number, repeticao = false): ItemFila {
  const ordemOpcoes = card.tipo === "pergunta" ? embaralhar(card.pergunta.opcoes.length, aleatorio) : [];
  return { card, ordemOpcoes, repeticao };
}

export function iniciarLicao(cards: CardLicao[], aleatorio: () => number): EstadoLicao {
  return {
    fila: cards.map((card) => criarItem(card, aleatorio)),
    posicao: 0,
    fase: cards.length > 0 ? "card" : "fim",
    selecionada: null,
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
  if (estado.fase !== "card" || item?.card.tipo !== "pergunta") return estado;
  if (posicaoOpcao < 0 || posicaoOpcao >= item.ordemOpcoes.length) return estado;
  return { ...estado, selecionada: posicaoOpcao };
}

export function verificarResposta(estado: EstadoLicao): EstadoLicao {
  const item = itemAtual(estado);
  if (estado.fase !== "card" || item?.card.tipo !== "pergunta" || estado.selecionada === null) return estado;

  const opcao = item.card.pergunta.opcoes[item.ordemOpcoes[estado.selecionada]];
  const base = { ...estado, fase: "feedback" as const, respostas: estado.respostas + 1 };
  if (opcao.correta) {
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
  if (item.card.tipo === "pergunta") {
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
    acertou: null,
    solucaoVisivel: false,
  };
}

export function precisao(estado: EstadoLicao): number | null {
  return estado.respostas > 0 ? Math.round((estado.acertos / estado.respostas) * 100) : null;
}
