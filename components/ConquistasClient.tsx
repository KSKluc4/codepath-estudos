"use client";

import { useProgress } from "@/lib/progress-context";
import { CONQUISTAS } from "@/lib/conquistas";
import { useDadosConquistas } from "@/lib/useDadosConquistas";
import ZyreSvg from "./ZyreSvg";

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ConquistasClient() {
  const { hidratado, conquistas } = useProgress();
  const dados = useDadosConquistas();

  if (!hidratado) {
    return (
      <div className="container-fluid d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  const feitas = CONQUISTAS.filter((c) => conquistas[c.id]).length;

  return (
    <div className="container-fluid" style={{ maxWidth: 1000 }}>
      <h1 className="h3 fw-bold mb-4">
        <i className="bi bi-trophy-fill me-2 sidebar-trofeu" />
        Conquistas
      </h1>

      <div className="conquistas-resumo mb-4">
        <span className="conquistas-resumo-zyre">
          <ZyreSvg estado={feitas > 0 ? "comemorando" : "olhando"} />
        </span>
        <div className="flex-grow-1">
          <div className="fw-bold mb-1">
            {feitas} de {CONQUISTAS.length} conquistas
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Conquistas desbloqueadas"
            aria-valuemin={0}
            aria-valuemax={CONQUISTAS.length}
            aria-valuenow={feitas}
            style={{ height: 8 }}
          >
            <div className="progress-bar conquistas-barra" style={{ width: `${(feitas / CONQUISTAS.length) * 100}%` }} />
          </div>
          <p className="small text-body-secondary mb-0 mt-2">
            Elas são liberadas sozinhas enquanto você estuda: no fim das lições, ao bater a meta do
            dia e ao concluir aulas.
          </p>
        </div>
      </div>

      <ul className="conquistas-grade">
        {CONQUISTAS.map((conquista) => {
          const data = conquistas[conquista.id];
          const { atual, total } = conquista.progresso(dados);
          return (
            <li key={conquista.id} className={`conquista ${data ? "conquista-feita" : "conquista-bloqueada"}`}>
              <span className="conquista-medalha" aria-hidden="true">
                <i className={`bi ${conquista.icone}`} />
              </span>
              <h2 className="conquista-titulo">
                {conquista.titulo}
                <span className="visually-hidden">{data ? " (desbloqueada)" : " (bloqueada)"}</span>
              </h2>
              <p className="conquista-descricao">{conquista.descricao}</p>
              {data ? (
                <div className="conquista-data">
                  <i className="bi bi-check-circle-fill me-1" aria-hidden="true" />
                  {formatarData(data)}
                </div>
              ) : (
                total > 1 && (
                  <div className="conquista-progresso">
                    <div
                      className="progress flex-grow-1"
                      role="progressbar"
                      aria-label={`Progresso de ${conquista.titulo}`}
                      aria-valuemin={0}
                      aria-valuemax={total}
                      aria-valuenow={atual}
                    >
                      <div className="progress-bar" style={{ width: `${(atual / total) * 100}%` }} />
                    </div>
                    <span>
                      {atual}/{total}
                    </span>
                  </div>
                )
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
