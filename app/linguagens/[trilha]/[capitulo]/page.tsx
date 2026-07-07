import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllChapters, getChapterBySlug, getAdjacentChapters } from "@/lib/chapters";
import { getTrackMeta } from "@/lib/tracks";
import ChapterPageClient from "@/components/ChapterPageClient";

export function generateStaticParams() {
  return getAllChapters().map((c) => ({ trilha: c.trilha, capitulo: c.capitulo }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trilha: string; capitulo: string }>;
}): Promise<Metadata> {
  const { trilha, capitulo } = await params;
  const chapter = getChapterBySlug(trilha, capitulo);
  return { title: chapter ? `${chapter.titulo} · CodePath` : "Capítulo · CodePath" };
}

export default async function CapituloPage({
  params,
}: {
  params: Promise<{ trilha: string; capitulo: string }>;
}) {
  const { trilha: trilhaParam, capitulo } = await params;
  if (!getTrackMeta(trilhaParam)) notFound();

  const chapter = getChapterBySlug(trilhaParam, capitulo);
  if (!chapter) notFound();

  const { anterior, proximo } = getAdjacentChapters(chapter);

  return (
    <ChapterPageClient
      chapter={chapter}
      capituloAnterior={anterior?.capitulo}
      capituloProximo={proximo?.capitulo}
    />
  );
}
