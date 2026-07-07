"use client";

import { ReactNode } from "react";
import { ProgressProvider } from "@/lib/progress-context";
import { LessonsProvider } from "@/lib/lessons-context";
import { ChaptersProvider } from "@/lib/chapters-context";
import { LessonSummary, MesMeta, ChapterSummary, TrackMeta } from "@/lib/types";

export default function AppProviders({
  lessons,
  meses,
  chapters,
  trilhas,
  children,
}: {
  lessons: LessonSummary[];
  meses: MesMeta[];
  chapters: ChapterSummary[];
  trilhas: TrackMeta[];
  children: ReactNode;
}) {
  return (
    <ProgressProvider>
      <LessonsProvider lessons={lessons} meses={meses}>
        <ChaptersProvider chapters={chapters} trilhas={trilhas}>
          {children}
        </ChaptersProvider>
      </LessonsProvider>
    </ProgressProvider>
  );
}
