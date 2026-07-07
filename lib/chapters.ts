import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Chapter, ChapterFrontmatter, ChapterSummary } from "./types";
import { parseLessonBody } from "./markdown";

const CONTENT_DIR = path.join(process.cwd(), "content", "linguagens");

interface ArquivoCapitulo {
  filePath: string;
  trilha: string;
  capitulo: string;
}

function listMarkdownFiles(): ArquivoCapitulo[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const trilhas = fs
    .readdirSync(CONTENT_DIR)
    .filter((d) => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory());

  const arquivos: ArquivoCapitulo[] = [];
  for (const trilha of trilhas) {
    const dir = path.join(CONTENT_DIR, trilha);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
      const capitulo = file.replace(/\.mdx?$/, "").replace(/^\d+-/, "");
      arquivos.push({ filePath: path.join(dir, file), trilha, capitulo });
    }
  }
  return arquivos;
}

let cache: Chapter[] | null = null;

export function getAllChapters(): Chapter[] {
  if (cache) return cache;
  const arquivos = listMarkdownFiles();
  const chapters: Chapter[] = arquivos.map(({ filePath, trilha, capitulo }) => {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const fm = data as ChapterFrontmatter;
    const body = parseLessonBody(content);
    return {
      ...fm,
      trilha,
      capitulo,
      slug: `${trilha}-${capitulo}`,
      introHtml: body.introHtml,
      exercicios: body.exercicios,
      quiz: body.quiz,
      duvidaHtml: body.duvidaHtml,
    };
  });

  chapters.sort((a, b) => a.trilha.localeCompare(b.trilha) || a.numero - b.numero);
  cache = chapters;
  return chapters;
}

export function getChapterSummaries(): ChapterSummary[] {
  return getAllChapters().map((c) => ({
    trilha: c.trilha,
    capitulo: c.capitulo,
    slug: c.slug,
    numero: c.numero,
    titulo: c.titulo,
    nivel: c.nivel,
    objetivo: c.objetivo,
    duracao: c.duracao,
    status: c.status,
    temExercicios: c.exercicios.length > 0,
    temQuiz: c.quiz.length > 0,
  }));
}

export function getChapterBySlug(trilha: string, capitulo: string): Chapter | undefined {
  return getAllChapters().find((c) => c.trilha === trilha && c.capitulo === capitulo);
}

export function getChaptersByTrack(trilha: string): Chapter[] {
  return getAllChapters().filter((c) => c.trilha === trilha);
}

export function getAdjacentChapters(chapter: Chapter): {
  anterior?: Chapter;
  proximo?: Chapter;
} {
  const doTrack = getChaptersByTrack(chapter.trilha);
  const idx = doTrack.findIndex((c) => c.capitulo === chapter.capitulo);
  return {
    anterior: idx > 0 ? doTrack[idx - 1] : undefined,
    proximo: idx >= 0 && idx < doTrack.length - 1 ? doTrack[idx + 1] : undefined,
  };
}
