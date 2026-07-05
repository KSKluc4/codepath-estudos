import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Lesson, LessonFrontmatter, LessonSummary } from "./types";
import { parseLessonBody } from "./markdown";

const CONTENT_DIR = path.join(process.cwd(), "content", "aulas");

function listMarkdownFiles(): string[] {
  const meses = fs.readdirSync(CONTENT_DIR).filter((d) => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory());
  const arquivos: string[] = [];
  for (const mes of meses) {
    const dir = path.join(CONTENT_DIR, mes);
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        arquivos.push(path.join(dir, file));
      }
    }
  }
  return arquivos;
}

function slugFromFrontmatter(fm: LessonFrontmatter): string {
  return fm.id;
}

let cache: Lesson[] | null = null;

export function getAllLessons(): Lesson[] {
  if (cache) return cache;
  const arquivos = listMarkdownFiles();
  const lessons: Lesson[] = arquivos.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const fm = data as LessonFrontmatter;
    const body = parseLessonBody(content);
    return {
      ...fm,
      slug: slugFromFrontmatter(fm),
      introHtml: body.introHtml,
      exercicios: body.exercicios,
      quiz: body.quiz,
    };
  });

  lessons.sort((a, b) => (a.mes - b.mes) || (a.numero - b.numero));
  cache = lessons;
  return lessons;
}

export function getLessonSummaries(): LessonSummary[] {
  return getAllLessons().map((l) => ({
    id: l.id,
    slug: l.slug,
    mes: l.mes,
    numero: l.numero,
    titulo: l.titulo,
    objetivo: l.objetivo,
    duracao: l.duracao,
    status: l.status,
    temExercicios: l.exercicios.length > 0,
    temQuiz: l.quiz.length > 0,
  }));
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return getAllLessons().find((l) => l.slug === slug);
}

export function getLessonsByMonth(mes: number): Lesson[] {
  return getAllLessons().filter((l) => l.mes === mes);
}

export function getPreviousLesson(lesson: Lesson): Lesson | undefined {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.slug === lesson.slug);
  return idx > 0 ? all[idx - 1] : undefined;
}

export function getNextLesson(lesson: Lesson): Lesson | undefined {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.slug === lesson.slug);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
}
