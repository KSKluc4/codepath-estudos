"use client";

import { useChapters } from "@/lib/chapters-context";
import TrackCard from "./TrackCard";

export default function LinguagensClient() {
  const { trilhas } = useChapters();

  return (
    <div className="container-fluid" style={{ maxWidth: 1100 }}>
      <div className="mb-4">
        <p className="text-primary text-uppercase small fw-semibold mb-1">Referência rápida</p>
        <h1 className="h3 fw-bold mb-2">Linguagens</h1>
        <p className="text-body-secondary mb-0" style={{ maxWidth: 700 }}>
          Trilhas de consulta livre, sem ordem obrigatória: escolha uma linguagem, vá direto ao
          capítulo que precisa e marque como concluído quando terminar.
        </p>
      </div>

      <div className="row g-3">
        {trilhas.map((trilha) => (
          <div className="col-12 col-sm-6 col-lg-4" key={trilha.id}>
            <TrackCard trilha={trilha} />
          </div>
        ))}
      </div>
    </div>
  );
}
