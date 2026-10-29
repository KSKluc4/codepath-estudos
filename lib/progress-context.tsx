"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { celebrar } from "./celebracoes";
import { Estatisticas } from "./conquistas";

const KEYS = {
  completed: "codepath.completed",
  studyDates: "codepath.studyDates",
  unlockAll: "codepath.unlockAll",
  quizAnswers: "codepath.quizAnswers",
  exerciseDrafts: "codepath.exerciseDrafts",
  xp: "codepath.xp",
  som: "codepath.som",
  xpPorDia: "codepath.xpPorDia",
  metaDiaria: "codepath.metaDiaria",
  metasBatidas: "codepath.metasBatidas",
  estatisticas: "codepath.estatisticas",
  conquistas: "codepath.conquistas",
};

const ESTATISTICAS_VAZIAS: Estatisticas = { licoesFeitas: 0, licoesPerfeitas: 0, maiorCombo: 0, explicacoes: 0 };

export const METAS_DIARIAS = [10, 20, 30, 50];
const META_PADRAO = 20;

type QuizAnswers = Record<string, Record<number, number>>;
type ExerciseDrafts = Record<string, Record<number, string>>;

interface ProgressData {
  hidratado: boolean;
  completed: string[];
  studyDates: string[];
  unlockAll: boolean;
  quizAnswers: QuizAnswers;
  exerciseDrafts: ExerciseDrafts;
  xp: number;
  som: boolean;
  xpPorDia: Record<string, number>;
  metaDiaria: number;
  metasBatidas: string[];
  hoje: string;
  estatisticas: Estatisticas;
  conquistas: Record<string, string>;
}

const SERVER_SNAPSHOT: ProgressData = {
  hidratado: false,
  completed: [],
  studyDates: [],
  unlockAll: false,
  quizAnswers: {},
  exerciseDrafts: {},
  xp: 0,
  som: true,
  xpPorDia: {},
  metaDiaria: META_PADRAO,
  metasBatidas: [],
  hoje: "",
  estatisticas: ESTATISTICAS_VAZIAS,
  conquistas: {},
};

// YYYY-MM-DD no fuso do aluno (toISOString usaria UTC e viraria o dia às 21h no Brasil)
export function dataLocal(data = new Date()): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

let cachedSnapshot: ProgressData | null = null;

function computeSnapshot(): ProgressData {
  const meta = readJson<number>(KEYS.metaDiaria, META_PADRAO);
  return {
    hidratado: true,
    completed: readJson<string[]>(KEYS.completed, []),
    studyDates: readJson<string[]>(KEYS.studyDates, []),
    unlockAll: readJson<boolean>(KEYS.unlockAll, false),
    quizAnswers: readJson<QuizAnswers>(KEYS.quizAnswers, {}),
    exerciseDrafts: readJson<ExerciseDrafts>(KEYS.exerciseDrafts, {}),
    xp: readJson<number>(KEYS.xp, 0),
    som: readJson<boolean>(KEYS.som, true),
    xpPorDia: readJson<Record<string, number>>(KEYS.xpPorDia, {}),
    metaDiaria: METAS_DIARIAS.includes(meta) ? meta : META_PADRAO,
    metasBatidas: readJson<string[]>(KEYS.metasBatidas, []),
    hoje: dataLocal(),
    estatisticas: { ...ESTATISTICAS_VAZIAS, ...readJson<Partial<Estatisticas>>(KEYS.estatisticas, {}) },
    conquistas: readJson<Record<string, string>>(KEYS.conquistas, {}),
  };
}

function getSnapshot(): ProgressData {
  if (!cachedSnapshot) cachedSnapshot = computeSnapshot();
  return cachedSnapshot;
}

function getServerSnapshot(): ProgressData {
  return SERVER_SNAPSHOT;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function invalidateAndNotify() {
  cachedSnapshot = null;
  listeners.forEach((listener) => listener());
}

function persist(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  invalidateAndNotify();
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(studyDates: string[]): number {
  const set = new Set(studyDates);
  const cursor = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  if (!set.has(fmt(cursor))) {
    // hoje ainda não estudou: streak conta a partir de ontem, sem quebrar
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (set.has(fmt(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

interface ProgressContextValue {
  hidratado: boolean;
  completedSlugs: Set<string>;
  isCompleted: (slug: string) => boolean;
  marcarConcluida: (slug: string) => void;
  desmarcarConcluida: (slug: string) => void;
  unlockAll: boolean;
  setUnlockAll: (value: boolean) => void;
  streak: number;
  studyDates: string[];
  quizAnswers: QuizAnswers;
  setQuizAnswer: (slug: string, perguntaIdx: number, opcaoIdx: number) => void;
  exerciseDrafts: ExerciseDrafts;
  setExerciseDraft: (slug: string, exercicioIdx: number, texto: string) => void;
  xp: number;
  adicionarXp: (quantidade: number) => void;
  som: boolean;
  setSom: (value: boolean) => void;
  xpHoje: number;
  xpPorDia: Record<string, number>;
  metaDiaria: number;
  setMetaDiaria: (meta: number) => void;
  metasBatidas: string[];
  estatisticas: Estatisticas;
  registrarLicao: (resultado: { respostas: number; acertos: number; comboMax: number }) => void;
  registrarExplicacao: () => void;
  conquistas: Record<string, string>;
  desbloquearConquistas: (ids: string[]) => void;
  resetarProgresso: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function marcarConcluida(slug: string) {
  const data = getSnapshot();
  if (!data.completed.includes(slug)) {
    persist(KEYS.completed, [...data.completed, slug]);
  }
  const key = todayKey();
  const dataAtualizada = getSnapshot();
  if (!dataAtualizada.studyDates.includes(key)) {
    persist(KEYS.studyDates, [...dataAtualizada.studyDates, key]);
  }
}

function desmarcarConcluida(slug: string) {
  const data = getSnapshot();
  persist(KEYS.completed, data.completed.filter((s) => s !== slug));
}

function setUnlockAll(value: boolean) {
  persist(KEYS.unlockAll, value);
}

function setQuizAnswer(slug: string, perguntaIdx: number, opcaoIdx: number) {
  const data = getSnapshot();
  persist(KEYS.quizAnswers, {
    ...data.quizAnswers,
    [slug]: { ...(data.quizAnswers[slug] ?? {}), [perguntaIdx]: opcaoIdx },
  });
}

function setExerciseDraft(slug: string, exercicioIdx: number, texto: string) {
  const data = getSnapshot();
  persist(KEYS.exerciseDrafts, {
    ...data.exerciseDrafts,
    [slug]: { ...(data.exerciseDrafts[slug] ?? {}), [exercicioIdx]: texto },
  });
}

function adicionarXp(quantidade: number) {
  if (quantidade <= 0) return;
  const data = getSnapshot();
  const hoje = dataLocal();
  const antes = data.xpPorDia[hoje] ?? 0;
  const depois = antes + quantidade;
  persist(KEYS.xp, data.xp + quantidade);
  persist(KEYS.xpPorDia, { ...data.xpPorDia, [hoje]: depois });
  if (antes < data.metaDiaria && depois >= data.metaDiaria) {
    registrarMetaBatida(data.metasBatidas, hoje, depois, data.metaDiaria);
  }
}

function registrarMetaBatida(metasBatidas: string[], hoje: string, xpHoje: number, meta: number) {
  if (metasBatidas.includes(hoje)) return;
  persist(KEYS.metasBatidas, [...metasBatidas, hoje]);
  celebrar({ tipo: "meta", xpHoje, meta });
}

// Baixar a meta para um valor que o XP de hoje já alcança também conta o dia como meta batida
function setMetaDiaria(meta: number) {
  if (!METAS_DIARIAS.includes(meta)) return;
  persist(KEYS.metaDiaria, meta);
  const data = getSnapshot();
  const hoje = dataLocal();
  const xpHoje = data.xpPorDia[hoje] ?? 0;
  if (xpHoje >= meta) registrarMetaBatida(data.metasBatidas, hoje, xpHoje, meta);
}

function setSom(value: boolean) {
  persist(KEYS.som, value);
}

function registrarLicao({ respostas, acertos, comboMax }: { respostas: number; acertos: number; comboMax: number }) {
  const { estatisticas } = getSnapshot();
  persist(KEYS.estatisticas, {
    ...estatisticas,
    licoesFeitas: estatisticas.licoesFeitas + 1,
    licoesPerfeitas: estatisticas.licoesPerfeitas + (respostas > 0 && acertos === respostas ? 1 : 0),
    maiorCombo: Math.max(estatisticas.maiorCombo, comboMax),
  });
}

function registrarExplicacao() {
  const { estatisticas } = getSnapshot();
  persist(KEYS.estatisticas, { ...estatisticas, explicacoes: estatisticas.explicacoes + 1 });
}

function desbloquearConquistas(ids: string[]) {
  const { conquistas } = getSnapshot();
  const novas = ids.filter((id) => !conquistas[id]);
  if (novas.length === 0) return;
  const agora = new Date().toISOString();
  persist(KEYS.conquistas, { ...conquistas, ...Object.fromEntries(novas.map((id) => [id, agora])) });
  novas.forEach((id) => celebrar({ tipo: "conquista", conquistaId: id }));
}

function resetarProgresso() {
  Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
  invalidateAndNotify();
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const completedSlugs = useMemo(() => new Set(data.completed), [data.completed]);
  const streak = useMemo(() => computeStreak(data.studyDates), [data.studyDates]);

  const value: ProgressContextValue = {
    hidratado: data.hidratado,
    completedSlugs,
    isCompleted: (slug) => completedSlugs.has(slug),
    marcarConcluida,
    desmarcarConcluida,
    unlockAll: data.unlockAll,
    setUnlockAll,
    streak,
    studyDates: data.studyDates,
    quizAnswers: data.quizAnswers,
    setQuizAnswer,
    exerciseDrafts: data.exerciseDrafts,
    setExerciseDraft,
    xp: data.xp,
    adicionarXp,
    som: data.som,
    setSom,
    xpHoje: data.xpPorDia[data.hoje] ?? 0,
    xpPorDia: data.xpPorDia,
    metaDiaria: data.metaDiaria,
    setMetaDiaria,
    metasBatidas: data.metasBatidas,
    estatisticas: data.estatisticas,
    registrarLicao,
    registrarExplicacao,
    conquistas: data.conquistas,
    desbloquearConquistas,
    resetarProgresso,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress deve ser usado dentro de ProgressProvider");
  return ctx;
}
