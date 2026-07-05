"use client";

import { useProgress } from "@/lib/progress-context";

export default function MarcarConcluidaButton({ slug }: { slug: string }) {
  const { isCompleted, marcarConcluida, desmarcarConcluida } = useProgress();
  const concluida = isCompleted(slug);

  return (
    <button
      type="button"
      className={`btn ${concluida ? "btn-success" : "btn-primary"} d-flex align-items-center gap-2`}
      onClick={() => (concluida ? desmarcarConcluida(slug) : marcarConcluida(slug))}
    >
      <i className={`bi ${concluida ? "bi-check-circle-fill" : "bi-circle"}`} />
      {concluida ? "Aula concluída" : "Marcar como concluída"}
    </button>
  );
}
