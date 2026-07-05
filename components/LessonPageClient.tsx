"use client";

import Link from "next/link";
import { Lesson } from "@/lib/types";
import { useLessons } from "@/lib/lessons-context";
import { useProgress } from "@/lib/progress-context";
import ExerciseBlock from "./ExerciseBlock";
import QuizBlock from "./QuizBlock";
import MarcarConcluidaButton from "./MarcarConcluidaButton";

export default function LessonPageClient({
  lesson,
  slugAnterior,
  slugProximo,
}: {
  lesson: Lesson;
  slugAnterior?: string;
  slugProximo?: string;
}) {
  const { isUnlocked } = useLessons();
  const { hidratado, isCompleted } = useProgress();

  if (!hidratado) {
    return (
      <div className="container-fluid d-flex justify-content-center py-5" style={{ maxWidth: 900 }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isUnlocked(lesson.slug)) {
    return (
      <div className="container-fluid" style={{ maxWidth: 700 }}>
        <div className="card border-warning-subtle">
          <div className="card-body text-center py-5">
            <i className="bi bi-lock-fill text-warning" style={{ fontSize: "2.5rem" }} />
            <h1 className="h4 fw-bold mt-3">Esta aula está bloqueada</h1>
            <p className="text-body-secondary">
              Conclua a aula anterior para desbloquear &ldquo;{lesson.titulo}&rdquo;. Se preferir
              estudar fora de ordem, você pode destravar tudo em Configurações.
            </p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              {slugAnterior && (
                <Link href={`/aula/${slugAnterior}`} className="btn btn-primary">
                  Ir para a aula anterior
                </Link>
              )}
              <Link href="/configuracoes" className="btn btn-outline-secondary">
                Configurações
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const concluida = isCompleted(lesson.slug);
  const emBreve = lesson.status === "em-breve";

  return (
    <div className="container-fluid" style={{ maxWidth: 900 }}>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link href="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/mes/${lesson.mes}`}>Mês {lesson.mes}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Aula {lesson.numero}
          </li>
        </ol>
      </nav>

      <div className="mb-4">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
          <span className="badge text-bg-secondary">Mês {lesson.mes} · Aula {lesson.numero}</span>
          {concluida && <span className="badge text-bg-success"><i className="bi bi-check-circle-fill me-1" />Concluída</span>}
          {emBreve && <span className="badge text-bg-info-subtle text-info-emphasis">Em breve</span>}
          {lesson.duracao && !emBreve && (
            <span className="badge text-bg-dark border">
              <i className="bi bi-clock me-1" />
              {lesson.duracao} min
            </span>
          )}
        </div>
        <h1 className="h3 fw-bold mb-2">{lesson.titulo}</h1>
        <p className="text-body-secondary lead fs-6">{lesson.objetivo}</p>
      </div>

      {emBreve && (
        <div className="alert alert-info-subtle border-info-subtle">
          <i className="bi bi-hourglass-split me-2" />
          Esta aula ainda está em produção. Os objetivos abaixo resumem o que ela vai cobrir — volte
          em breve!
        </div>
      )}

      <div className="lesson-content mb-4" dangerouslySetInnerHTML={{ __html: lesson.introHtml }} />

      {lesson.exercicios.length > 0 && (
        <section className="mb-4">
          <h2 className="h4 mb-3">
            <i className="bi bi-braces-asterisk me-2 text-primary" />
            Exercícios práticos
          </h2>
          {lesson.exercicios.map((ex, i) => (
            <ExerciseBlock key={i} slug={lesson.slug} index={i} exercicio={ex} />
          ))}
        </section>
      )}

      <QuizBlock slug={lesson.slug} perguntas={lesson.quiz} />

      {!emBreve && (
        <div className="d-flex justify-content-center my-5">
          <MarcarConcluidaButton slug={lesson.slug} />
        </div>
      )}

      <div className="d-flex justify-content-between border-top border-secondary-subtle pt-4">
        {slugAnterior ? (
          <Link href={`/aula/${slugAnterior}`} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1" /> Aula anterior
          </Link>
        ) : (
          <span />
        )}
        {slugProximo ? (
          <Link href={`/aula/${slugProximo}`} className="btn btn-outline-secondary btn-sm">
            Próxima aula <i className="bi bi-arrow-right ms-1" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
