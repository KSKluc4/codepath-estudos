import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllLessons,
  getLessonBySlug,
  getPreviousLesson,
  getNextLesson,
} from "@/lib/lessons";
import LessonPageClient from "@/components/LessonPageClient";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  return { title: lesson ? `${lesson.titulo} · CodePath` : "Aula · CodePath" };
}

export default async function AulaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const anterior = getPreviousLesson(lesson);
  const proxima = getNextLesson(lesson);

  return (
    <LessonPageClient
      lesson={lesson}
      slugAnterior={anterior?.slug}
      slugProximo={proxima?.slug}
    />
  );
}
