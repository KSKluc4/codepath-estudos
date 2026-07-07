"use client";

import { createContext, useContext, ReactNode } from "react";
import { ChapterSummary, TrackMeta } from "./types";

interface ChaptersContextValue {
  chapters: ChapterSummary[];
  trilhas: TrackMeta[];
  getChapterSummary: (trilha: string, capitulo: string) => ChapterSummary | undefined;
  getTrackMeta: (id: string) => TrackMeta | undefined;
}

const ChaptersContext = createContext<ChaptersContextValue | null>(null);

export function ChaptersProvider({
  chapters,
  trilhas,
  children,
}: {
  chapters: ChapterSummary[];
  trilhas: TrackMeta[];
  children: ReactNode;
}) {
  const getChapterSummary = (trilha: string, capitulo: string) =>
    chapters.find((c) => c.trilha === trilha && c.capitulo === capitulo);

  const getTrackMeta = (id: string) => trilhas.find((t) => t.id === id);

  return (
    <ChaptersContext.Provider value={{ chapters, trilhas, getChapterSummary, getTrackMeta }}>
      {children}
    </ChaptersContext.Provider>
  );
}

export function useChapters(): ChaptersContextValue {
  const ctx = useContext(ChaptersContext);
  if (!ctx) throw new Error("useChapters deve ser usado dentro de ChaptersProvider");
  return ctx;
}
