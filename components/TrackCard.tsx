"use client";

import Link from "next/link";
import { TrackMeta } from "@/lib/types";
import { useChapters } from "@/lib/chapters-context";
import { useProgress } from "@/lib/progress-context";

export default function TrackCard({ trilha }: { trilha: TrackMeta }) {
  const { chapters } = useChapters();
  const { isCompleted, hidratado } = useProgress();

  const capitulosDaTrilha = chapters.filter((c) => c.trilha === trilha.id && c.status === "completo");
  const concluidos = capitulosDaTrilha.filter((c) => isCompleted(c.slug));
  const pct = capitulosDaTrilha.length
    ? Math.round((concluidos.length / capitulosDaTrilha.length) * 100)
    : 0;

  return (
    <Link href={`/linguagens/${trilha.id}`} className="text-decoration-none text-body">
      <div className="card h-100 track-card">
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center gap-3 mb-3">
            <span
              className="track-icon"
              style={{ backgroundColor: `${trilha.cor}22`, color: trilha.cor }}
            >
              <i className={`bi ${trilha.icone}`} />
            </span>
            <h3 className="h6 fw-semibold mb-0">{trilha.nome}</h3>
          </div>
          <p className="text-body-secondary small flex-grow-1">{trilha.descricao}</p>
          <div>
            <div className="d-flex justify-content-between small mb-1">
              <span className="fw-semibold">Progresso</span>
              <span className="text-body-secondary">
                {hidratado ? `${concluidos.length}/${capitulosDaTrilha.length}` : "..."}
              </span>
            </div>
            <div className="progress" style={{ height: 8 }}>
              <div
                className="progress-bar"
                style={{ width: `${hidratado ? pct : 0}%`, backgroundColor: trilha.cor }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
