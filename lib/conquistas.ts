import { ChapterSummary, LessonSummary, TrackMeta } from "./types";
import { MASCOTE_NOME } from "./mascote";

export interface Estatisticas {
  licoesFeitas: number;
  licoesPerfeitas: number;
  maiorCombo: number;
  explicacoes: number;
}

export interface DadosConquistas {
  concluidos: Set<string>;
  aulas: LessonSummary[];
  capitulos: ChapterSummary[];
  trilhas: TrackMeta[];
  studyDates: string[];
  xp: number;
  metasBatidas: string[];
  estatisticas: Estatisticas;
}

export interface ProgressoConquista {
  atual: number;
  total: number;
}

export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  progresso: (dados: DadosConquistas) => ProgressoConquista;
}

function ate(atual: number, total: number): ProgressoConquista {
  return { atual: Math.min(atual, total), total };
}

function maiorSequencia(datas: string[]): number {
  const dias = [...new Set(datas)].map((d) => Date.parse(`${d}T00:00:00Z`) / 86_400_000).sort((a, b) => a - b);
  let maior = 0;
  let atual = 0;
  dias.forEach((dia, i) => {
    atual = i > 0 && dia - dias[i - 1] === 1 ? atual + 1 : 1;
    maior = Math.max(maior, atual);
  });
  return maior;
}

function capitulosPorTrilha(dados: DadosConquistas) {
  return dados.trilhas.map((trilha) => {
    const doTrilha = dados.capitulos.filter((c) => c.trilha === trilha.id && c.status === "completo");
    return { total: doTrilha.length, feitos: doTrilha.filter((c) => dados.concluidos.has(c.slug)).length };
  });
}

function licoesConcluidas(dados: DadosConquistas): number {
  return dados.concluidos.size;
}

export const CONQUISTAS: Conquista[] = [
  {
    id: "primeira-licao",
    titulo: "Primeiro passo",
    descricao: "Conclua sua primeira aula ou capítulo.",
    icone: "bi-flag-fill",
    progresso: (d) => ate(licoesConcluidas(d), 1),
  },
  {
    id: "cinco-licoes",
    titulo: "Pegando o ritmo",
    descricao: "Conclua 5 aulas ou capítulos.",
    icone: "bi-bookmark-star-fill",
    progresso: (d) => ate(licoesConcluidas(d), 5),
  },
  {
    id: "vinte-cinco-licoes",
    titulo: "Estudante dedicado",
    descricao: "Conclua 25 aulas ou capítulos.",
    icone: "bi-journal-check",
    progresso: (d) => ate(licoesConcluidas(d), 25),
  },
  {
    id: "cem-licoes",
    titulo: "Centenário",
    descricao: "Conclua 100 aulas ou capítulos.",
    icone: "bi-trophy-fill",
    progresso: (d) => ate(licoesConcluidas(d), 100),
  },
  {
    id: "licao-perfeita",
    titulo: "Gabaritou",
    descricao: "Termine uma lição no modo lição sem errar nada.",
    icone: "bi-bullseye",
    progresso: (d) => ate(d.estatisticas.licoesPerfeitas, 1),
  },
  {
    id: "combo-10",
    titulo: "Imparável",
    descricao: "Faça um combo de 10 acertos seguidos numa lição.",
    icone: "bi-lightning-charge-fill",
    progresso: (d) => ate(d.estatisticas.maiorCombo, 10),
  },
  {
    id: "sequencia-3",
    titulo: "Aquecendo",
    descricao: "Estude 3 dias seguidos.",
    icone: "bi-fire",
    progresso: (d) => ate(maiorSequencia(d.studyDates), 3),
  },
  {
    id: "sequencia-7",
    titulo: "Semana de fogo",
    descricao: "Estude 7 dias seguidos.",
    icone: "bi-fire",
    progresso: (d) => ate(maiorSequencia(d.studyDates), 7),
  },
  {
    id: "sequencia-30",
    titulo: "Hábito de verdade",
    descricao: "Estude 30 dias seguidos.",
    icone: "bi-calendar2-check-fill",
    progresso: (d) => ate(maiorSequencia(d.studyDates), 30),
  },
  {
    id: "meta-7",
    titulo: "Meta em dia",
    descricao: "Bata a meta diária de XP em 7 dias diferentes.",
    icone: "bi-graph-up-arrow",
    progresso: (d) => ate(d.metasBatidas.length, 7),
  },
  {
    id: "poliglota",
    titulo: "Poliglota",
    descricao: "Conclua pelo menos um capítulo de cada trilha de Linguagens.",
    icone: "bi-translate",
    progresso: (d) => {
      const trilhas = capitulosPorTrilha(d).filter((t) => t.total > 0);
      return ate(trilhas.filter((t) => t.feitos > 0).length, trilhas.length);
    },
  },
  {
    id: "mes-1",
    titulo: "A Máquina desvendada",
    descricao: "Conclua todas as aulas do Mês 1.",
    icone: "bi-cpu-fill",
    progresso: (d) => {
      const aulas = d.aulas.filter((a) => a.mes === 1 && a.status === "completo");
      return ate(aulas.filter((a) => d.concluidos.has(a.slug)).length, aulas.length);
    },
  },
  {
    id: "trilha-completa",
    titulo: "Especialista",
    descricao: "Conclua todos os capítulos de uma trilha de Linguagens.",
    icone: "bi-award-fill",
    progresso: (d) => {
      const melhor = capitulosPorTrilha(d)
        .filter((t) => t.total > 0)
        .sort((a, b) => b.feitos / b.total - a.feitos / a.total)[0];
      return melhor ? ate(melhor.feitos, melhor.total) : ate(0, 1);
    },
  },
  {
    id: "me-explica",
    titulo: "Curioso",
    descricao: `Peça para o ${MASCOTE_NOME} explicar um erro.`,
    icone: "bi-chat-heart-fill",
    progresso: (d) => ate(d.estatisticas.explicacoes, 1),
  },
  {
    id: "mil-xp",
    titulo: "Mil XP",
    descricao: "Junte 1.000 XP no modo lição.",
    icone: "bi-gem",
    progresso: (d) => ate(d.xp, 1000),
  },
];

export function conquistaCumprida(conquista: Conquista, dados: DadosConquistas): boolean {
  const { atual, total } = conquista.progresso(dados);
  return total > 0 && atual >= total;
}

export function getConquista(id: string): Conquista | undefined {
  return CONQUISTAS.find((c) => c.id === id);
}
