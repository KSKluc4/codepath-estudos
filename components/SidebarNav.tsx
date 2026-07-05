"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLessons } from "@/lib/lessons-context";
import { useProgress } from "@/lib/progress-context";

export default function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { lessons, meses, isUnlocked } = useLessons();
  const { isCompleted } = useProgress();

  const currentSlug = pathname?.startsWith("/aula/") ? pathname.split("/")[2] : null;
  const currentLesson = lessons.find((l) => l.slug === currentSlug);

  const proximaSugerida = lessons.find(
    (l) => l.status === "completo" && !isCompleted(l.slug) && isUnlocked(l.slug)
  );
  const mesParaAbrir = currentLesson?.mes ?? proximaSugerida?.mes ?? 1;

  return (
    <nav aria-label="Navegação por mês" className="h-100 overflow-auto">
      <div className="accordion accordion-flush" id="sidebar-accordion">
        {meses.map((mes) => {
          const aulasDoMes = lessons.filter((l) => l.mes === mes.mes);
          const totalCompleto = aulasDoMes.filter((l) => l.status === "completo").length;
          const concluidas = aulasDoMes.filter((l) => l.status === "completo" && isCompleted(l.slug)).length;
          const aberto = mes.mes === mesParaAbrir;

          return (
            <div className="accordion-item bg-transparent border-secondary-subtle" key={mes.mes}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button bg-transparent text-body py-2 ${aberto ? "" : "collapsed"}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#mes-collapse-${mes.mes}`}
                >
                  <span className="d-flex flex-column">
                    <span className="fw-semibold small">
                      Mês {mes.mes} · {mes.nome}
                    </span>
                    <span className="text-body-secondary" style={{ fontSize: "0.75rem" }}>
                      {mes.titulo} — {concluidas}/{totalCompleto} concluídas
                    </span>
                  </span>
                </button>
              </h2>
              <div
                id={`mes-collapse-${mes.mes}`}
                className={`accordion-collapse collapse ${aberto ? "show" : ""}`}
                data-bs-parent="#sidebar-accordion"
              >
                <div className="accordion-body p-0">
                  <div className="list-group list-group-flush">
                    {aulasDoMes.map((aula) => {
                      const desbloqueada = isUnlocked(aula.slug);
                      const concluida = isCompleted(aula.slug);
                      const ativo = aula.slug === currentSlug;

                      const conteudoInterno = (
                        <>
                          {concluida ? (
                            <i className="bi bi-check-circle-fill text-success" aria-hidden="true" />
                          ) : !desbloqueada ? (
                            <i className="bi bi-lock-fill text-body-secondary" aria-hidden="true" />
                          ) : (
                            <i className="bi bi-circle text-body-secondary" aria-hidden="true" />
                          )}
                          <span className="small flex-grow-1">
                            {aula.numero}. {aula.titulo}
                          </span>
                          {aula.status === "em-breve" && (
                            <span className="badge text-bg-secondary">em breve</span>
                          )}
                        </>
                      );

                      if (!desbloqueada) {
                        return (
                          <span
                            key={aula.slug}
                            className="list-group-item bg-transparent d-flex align-items-center gap-2 text-body-secondary"
                            style={{ cursor: "not-allowed" }}
                            title="Conclua a aula anterior para desbloquear"
                          >
                            {conteudoInterno}
                          </span>
                        );
                      }

                      return (
                        <Link
                          key={aula.slug}
                          href={`/aula/${aula.slug}`}
                          onClick={onNavigate}
                          className={`list-group-item list-group-item-action bg-transparent d-flex align-items-center gap-2 ${
                            ativo ? "active" : ""
                          }`}
                        >
                          {conteudoInterno}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
