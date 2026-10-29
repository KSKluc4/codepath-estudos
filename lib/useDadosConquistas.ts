"use client";

import { useMemo } from "react";
import { DadosConquistas } from "./conquistas";
import { useProgress } from "./progress-context";
import { useLessons } from "./lessons-context";
import { useChapters } from "./chapters-context";

export function useDadosConquistas(): DadosConquistas {
  const { completedSlugs, studyDates, xp, metasBatidas, estatisticas } = useProgress();
  const { lessons } = useLessons();
  const { chapters, trilhas } = useChapters();

  return useMemo(
    () => ({
      concluidos: completedSlugs,
      aulas: lessons,
      capitulos: chapters,
      trilhas,
      studyDates,
      xp,
      metasBatidas,
      estatisticas,
    }),
    [completedSlugs, lessons, chapters, trilhas, studyDates, xp, metasBatidas, estatisticas]
  );
}
