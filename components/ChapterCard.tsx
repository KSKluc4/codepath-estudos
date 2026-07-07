"use client";

import Link from "next/link";
import { ChapterSummary } from "@/lib/types";
import { useProgress } from "@/lib/progress-context";

export default function ChapterCard({ chapter }: { chapter: ChapterSummary }) {
  const { isCompleted } = useProgress();

  const concluida = isCompleted(chapter.slug);
  const emBreve = chapter.status === "em-breve";

  let badge = <span className="badge text-bg-secondary">Disponível</span>;
  if (concluida) badge = <span className="badge text-bg-success">Concluído</span>;
  else if (emBreve) badge = <span className="badge text-bg-info-subtle text-info-emphasis">Em breve</span>;

  return (
    <Link href={`/linguagens/${chapter.trilha}/${chapter.capitulo}`} className="text-decoration-none text-body">
      <div className="card h-100 lesson-card">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="text-body-secondary small">Capítulo {chapter.numero}</span>
            {badge}
          </div>
          <h3 className="h6 fw-semibold">{chapter.titulo}</h3>
          <p className="text-body-secondary small flex-grow-1">{chapter.objetivo}</p>
          {chapter.duracao && (
            <div className="d-flex justify-content-end align-items-center mt-2">
              <span className="text-body-secondary small">
                <i className="bi bi-clock" /> {chapter.duracao} min
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
