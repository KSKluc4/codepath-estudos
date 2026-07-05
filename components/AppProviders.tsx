"use client";

import { ReactNode } from "react";
import { ProgressProvider } from "@/lib/progress-context";
import { LessonsProvider } from "@/lib/lessons-context";
import { LessonSummary, MesMeta } from "@/lib/types";

export default function AppProviders({
  lessons,
  meses,
  children,
}: {
  lessons: LessonSummary[];
  meses: MesMeta[];
  children: ReactNode;
}) {
  return (
    <ProgressProvider>
      <LessonsProvider lessons={lessons} meses={meses}>
        {children}
      </LessonsProvider>
    </ProgressProvider>
  );
}
