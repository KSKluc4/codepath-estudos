"use client";

import Link from "next/link";
import { Chapter } from "@/lib/types";
import { NIVEL_LABELS } from "@/lib/niveis";
import { useChapters } from "@/lib/chapters-context";
import { useProgress } from "@/lib/progress-context";
import CopyableHtml from "./CopyableHtml";
import ChapterExerciseBlock from "./ChapterExerciseBlock";
import QuizBlock from "./QuizBlock";
import MarcarConcluidaButton from "./MarcarConcluidaButton";

export default function ChapterPageClient({
  chapter,
  capituloAnterior,
  capituloProximo,
}: {
  chapter: Chapter;
  capituloAnterior?: string;
  capituloProximo?: string;
}) {
  const { getTrackMeta } = useChapters();
  const { hidratado, isCompleted } = useProgress();

  const trilha = getTrackMeta(chapter.trilha);

  if (!hidratado) {
    return (
      <div className="container-fluid d-flex justify-content-center py-5" style={{ maxWidth: 900 }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  const concluido = isCompleted(chapter.slug);
  const emBreve = chapter.status === "em-breve";

  return (
    <div className="container-fluid" style={{ maxWidth: 900 }}>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link href="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/linguagens">Linguagens</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/linguagens/${chapter.trilha}`}>{trilha?.nome ?? chapter.trilha}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Capítulo {chapter.numero}
          </li>
        </ol>
      </nav>

      <div className="mb-4">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
          <span className="badge text-bg-secondary">{NIVEL_LABELS[chapter.nivel]}</span>
          {concluido && <span className="badge text-bg-success"><i className="bi bi-check-circle-fill me-1" />Concluído</span>}
          {emBreve && <span className="badge text-bg-info-subtle text-info-emphasis">Em breve</span>}
          {chapter.duracao && !emBreve && (
            <span className="badge text-bg-dark border">
              <i className="bi bi-clock me-1" />
              {chapter.duracao} min
            </span>
          )}
        </div>
        <h1 className="h3 fw-bold mb-2">{chapter.titulo}</h1>
        <p className="text-body-secondary lead fs-6">{chapter.objetivo}</p>
      </div>

      {emBreve && (
        <div className="alert alert-info-subtle border-info-subtle">
          <i className="bi bi-hourglass-split me-2" />
          Este capítulo ainda está em produção. O objetivo acima resume o que ele vai cobrir — volte
          em breve!
        </div>
      )}

      <CopyableHtml html={chapter.introHtml} className="lesson-content mb-4" />

      {chapter.exercicios.length > 0 && (
        <section className="mb-4">
          <h2 className="h4 mb-3">
            <i className="bi bi-braces-asterisk me-2 text-primary" />
            Exercícios práticos
          </h2>
          {chapter.exercicios.map((ex, i) => (
            <ChapterExerciseBlock key={i} slug={chapter.slug} index={i} exercicio={ex} />
          ))}
        </section>
      )}

      <QuizBlock slug={chapter.slug} perguntas={chapter.quiz} />

      {!emBreve && chapter.duvidaHtml && (
        <div className="card border-primary-subtle mt-4">
          <div className="card-body">
            <h2 className="h6 fw-semibold mb-2">
              <i className="bi bi-chat-dots me-2 text-primary" />
              Tirou dúvida?
            </h2>
            <CopyableHtml html={chapter.duvidaHtml} className="lesson-content mb-0" />
          </div>
        </div>
      )}

      {!emBreve && (
        <div className="d-flex justify-content-center my-5">
          <MarcarConcluidaButton slug={chapter.slug} />
        </div>
      )}

      <div className="d-flex justify-content-between border-top border-secondary-subtle pt-4">
        {capituloAnterior ? (
          <Link href={`/linguagens/${chapter.trilha}/${capituloAnterior}`} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1" /> Capítulo anterior
          </Link>
        ) : (
          <span />
        )}
        {capituloProximo ? (
          <Link href={`/linguagens/${chapter.trilha}/${capituloProximo}`} className="btn btn-outline-secondary btn-sm">
            Próximo capítulo <i className="bi bi-arrow-right ms-1" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
