"use client";

import { createContext, useContext, ReactNode } from "react";
import { LessonSummary, MesMeta } from "./types";
import { useProgress } from "./progress-context";

interface LessonsContextValue {
  lessons: LessonSummary[];
  meses: MesMeta[];
  isUnlocked: (slug: string) => boolean;
  getLessonSummary: (slug: string) => LessonSummary | undefined;
}

const LessonsContext = createContext<LessonsContextValue | null>(null);

export function LessonsProvider({
  lessons,
  meses,
  children,
}: {
  lessons: LessonSummary[];
  meses: MesMeta[];
  children: ReactNode;
}) {
  const { completedSlugs, unlockAll } = useProgress();

  const isUnlocked = (slug: string): boolean => {
    if (unlockAll) return true;
    const idx = lessons.findIndex((l) => l.slug === slug);
    if (idx <= 0) return true;
    const anterior = lessons[idx - 1];
    if (anterior.status === "em-breve") return true;
    return completedSlugs.has(anterior.slug);
  };

  const getLessonSummary = (slug: string) => lessons.find((l) => l.slug === slug);

  return (
    <LessonsContext.Provider value={{ lessons, meses, isUnlocked, getLessonSummary }}>
      {children}
    </LessonsContext.Provider>
  );
}

export function useLessons(): LessonsContextValue {
  const ctx = useContext(LessonsContext);
  if (!ctx) throw new Error("useLessons deve ser usado dentro de LessonsProvider");
  return ctx;
}
