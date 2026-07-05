"use client";

import Link from "next/link";
import { useLessons } from "@/lib/lessons-context";
import { useProgress } from "@/lib/progress-context";

export default function DashboardClient() {
  const { lessons, meses, isUnlocked } = useLessons();
  const { isCompleted, streak, hidratado } = useProgress();

  const completaveis = lessons.filter((l) => l.status === "completo");
  const concluidas = completaveis.filter((l) => isCompleted(l.slug));
  const overallPct = completaveis.length ? Math.round((concluidas.length / completaveis.length) * 100) : 0;

  const proximaSugerida = lessons.find(
    (l) => l.status === "completo" && !isCompleted(l.slug) && isUnlocked(l.slug)
  );

  return (
    <div className="container-fluid" style={{ maxWidth: 1100 }}>
      <div className="hero-panel p-4 p-lg-5 mb-4">
        <p className="text-primary text-uppercase small fw-semibold mb-1">Julho — Dezembro 2026</p>
        <h1 className="h2 fw-bold mb-2">
          Bem-vindo(a) ao <span className="text-gradient">CodePath</span>
        </h1>
        <p className="text-body-secondary mb-4" style={{ maxWidth: 640 }}>
          Do binário ao projeto final: seis meses de estudo estruturado para você entender
          programação de verdade, da eletricidade ao software profissional.
        </p>

        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-8">
            <div className="d-flex justify-content-between small mb-1">
              <span className="fw-semibold">Progresso geral</span>
              <span className="text-body-secondary">
                {hidratado ? `${concluidas.length}/${completaveis.length} aulas` : "..."}
              </span>
            </div>
            <div className="progress" role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100} style={{ height: 10 }}>
              <div className="progress-bar bg-primary" style={{ width: `${hidratado ? overallPct : 0}%` }} />
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-md-end">
            <span className="badge text-bg-warning-subtle text-warning-emphasis fs-6 px-3 py-2 d-inline-flex align-items-center gap-2">
              <i className="bi bi-fire" />
              {hidratado ? streak : 0} {streak === 1 ? "dia de streak" : "dias de streak"}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card h-100 border-primary-subtle">
            <div className="card-body">
              <h2 className="h6 text-uppercase text-primary fw-semibold mb-3">
                <i className="bi bi-play-circle me-2" />
                Próxima aula sugerida
              </h2>
              {!hidratado ? (
                <p className="text-body-secondary small mb-0">Carregando...</p>
              ) : proximaSugerida ? (
                <>
                  <p className="text-body-secondary small mb-1">
                    Mês {proximaSugerida.mes} · Aula {proximaSugerida.numero}
                  </p>
                  <h3 className="h5 fw-bold mb-2">{proximaSugerida.titulo}</h3>
                  <p className="text-body-secondary small mb-3">{proximaSugerida.objetivo}</p>
                  <Link href={`/aula/${proximaSugerida.slug}`} className="btn btn-primary">
                    Continuar estudando <i className="bi bi-arrow-right ms-1" />
                  </Link>
                </>
              ) : (
                <p className="mb-0">
                  <i className="bi bi-trophy text-warning me-2" />
                  Você concluiu todas as aulas disponíveis até agora. Novas aulas em breve!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h6 text-uppercase text-primary fw-semibold mb-3">
                <i className="bi bi-calendar3 me-2" />
                Progresso por mês
              </h2>
              <div className="d-flex flex-column gap-3">
                {meses.map((mes) => {
                  const aulasDoMes = lessons.filter((l) => l.mes === mes.mes && l.status === "completo");
                  const concluidasDoMes = aulasDoMes.filter((l) => isCompleted(l.slug));
                  const pct = aulasDoMes.length
                    ? Math.round((concluidasDoMes.length / aulasDoMes.length) * 100)
                    : 0;
                  return (
                    <Link
                      key={mes.mes}
                      href={`/mes/${mes.mes}`}
                      className="text-decoration-none text-body"
                    >
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="fw-semibold">
                          Mês {mes.mes} · {mes.nome} — {mes.titulo}
                        </span>
                        <span className="text-body-secondary">
                          {hidratado ? `${concluidasDoMes.length}/${aulasDoMes.length}` : "..."}
                        </span>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className="progress-bar bg-info"
                          style={{ width: `${hidratado ? pct : 0}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
