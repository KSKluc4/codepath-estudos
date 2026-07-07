"use client";

import { Exercicio } from "@/lib/types";
import { useProgress } from "@/lib/progress-context";
import CopyableHtml from "./CopyableHtml";

export default function ChapterExerciseBlock({
  slug,
  index,
  exercicio,
}: {
  slug: string;
  index: number;
  exercicio: Exercicio;
}) {
  const { exerciseDrafts, setExerciseDraft } = useProgress();
  const draft = exerciseDrafts[slug]?.[index] ?? "";
  const accordionId = `exercicio-${slug}-${index}`;

  return (
    <div className="card mb-4 exercise-card">
      <div className="card-body">
        <h3 className="h6 fw-semibold mb-2">
          <i className="bi bi-pencil-square me-2 text-primary" />
          {exercicio.titulo}
        </h3>
        <CopyableHtml html={exercicio.enunciadoHtml} className="lesson-content mb-3" />
        <textarea
          className="form-control bg-body-tertiary mb-3"
          rows={6}
          placeholder="Escreva sua resposta ou código aqui..."
          value={draft}
          onChange={(e) => setExerciseDraft(slug, index, e.target.value)}
          spellCheck={false}
        />
        <div className="accordion" id={accordionId}>
          <div className="accordion-item">
            <h4 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${accordionId}-collapse`}
              >
                <i className="bi bi-eye me-2" /> Ver solução comentada
              </button>
            </h4>
            <div className={`accordion-collapse collapse`} id={`${accordionId}-collapse`} data-bs-parent={`#${accordionId}`}>
              <CopyableHtml html={exercicio.solucaoHtml} className="accordion-body lesson-content" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
