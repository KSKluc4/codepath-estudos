"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";

const KEYS = {
  completed: "codepath.completed",
  studyDates: "codepath.studyDates",
  unlockAll: "codepath.unlockAll",
  quizAnswers: "codepath.quizAnswers",
  exerciseDrafts: "codepath.exerciseDrafts",
};

type QuizAnswers = Record<string, Record<number, number>>;
type ExerciseDrafts = Record<string, Record<number, string>>;

interface ProgressData {
  hidratado: boolean;
  completed: string[];
  studyDates: string[];
  unlockAll: boolean;
  quizAnswers: QuizAnswers;
  exerciseDrafts: ExerciseDrafts;
}

const SERVER_SNAPSHOT: ProgressData = {
  hidratado: false,
  completed: [],
  studyDates: [],
  unlockAll: false,
  quizAnswers: {},
  exerciseDrafts: {},
};

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
  return {
    hidratado: true,
    completed: readJson<string[]>(KEYS.completed, []),
    studyDates: readJson<string[]>(KEYS.studyDates, []),
    unlockAll: readJson<boolean>(KEYS.unlockAll, false),
    quizAnswers: readJson<QuizAnswers>(KEYS.quizAnswers, {}),
    exerciseDrafts: readJson<ExerciseDrafts>(KEYS.exerciseDrafts, {}),
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
    resetarProgresso,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress deve ser usado dentro de ProgressProvider");
  return ctx;
}
