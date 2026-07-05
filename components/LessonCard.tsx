"use client";

import Link from "next/link";
import { LessonSummary } from "@/lib/types";
import { useLessons } from "@/lib/lessons-context";
import { useProgress } from "@/lib/progress-context";

export default function LessonCard({ lesson }: { lesson: LessonSummary }) {
  const { isUnlocked } = useLessons();
  const { isCompleted } = useProgress();

  const desbloqueada = isUnlocked(lesson.slug);
  const concluida = isCompleted(lesson.slug);
  const emBreve = lesson.status === "em-breve";

  let badge = <span className="badge text-bg-secondary">Disponível</span>;
  if (concluida) badge = <span className="badge text-bg-success">Concluída</span>;
  else if (!desbloqueada) badge = <span className="badge text-bg-dark border">Bloqueada</span>;
  else if (emBreve) badge = <span className="badge text-bg-info-subtle text-info-emphasis">Em breve</span>;

  const conteudo = (
    <div className={`card h-100 lesson-card ${!desbloqueada ? "opacity-75" : ""}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="text-body-secondary small">Aula {lesson.numero}</span>
          {!desbloqueada ? <i className="bi bi-lock-fill text-body-secondary" /> : badge}
        </div>
        <h3 className="h6 fw-semibold">{lesson.titulo}</h3>
        <p className="text-body-secondary small flex-grow-1">{lesson.objetivo}</p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {desbloqueada && !emBreve ? badge : <span />}
          {lesson.duracao && desbloqueada && (
            <span className="text-body-secondary small">
              <i className="bi bi-clock" /> {lesson.duracao} min
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (!desbloqueada) {
    return <div title="Conclua a aula anterior para desbloquear">{conteudo}</div>;
  }

  return (
    <Link href={`/aula/${lesson.slug}`} className="text-decoration-none text-body">
      {conteudo}
    </Link>
  );
}
