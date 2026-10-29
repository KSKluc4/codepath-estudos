"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress-context";
import { calcularNivel } from "@/lib/xp";
import BuscaAulas from "./BuscaAulas";

export default function Navbar() {
  const { streak, xp } = useProgress();
  const nivel = calcularNivel(xp);
  const progressoNivel = Math.min(100, (nivel.xpNoNivel / nivel.xpParaProximo) * 100);

  return (
    <nav className="navbar navbar-expand-lg sticky-top border-bottom border-secondary-subtle app-navbar">
      <div className="container-fluid px-3">
        <button
          className="navbar-toggler d-lg-none me-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
          aria-label="Abrir navegação"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <Link href="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-code-slash text-primary" />
          <span>
            CodePath <span className="text-primary">— Do Zero ao Excelente</span>
          </span>
        </Link>

        <div className="d-none d-md-block flex-grow-1 mx-4" style={{ maxWidth: 420 }}>
          <BuscaAulas />
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link href="/linguagens" className="btn btn-outline-secondary btn-sm d-none d-sm-inline-flex align-items-center gap-1">
            <i className="bi bi-translate" />
            Linguagens
          </Link>
          <span className="badge text-bg-warning-subtle text-warning-emphasis d-flex align-items-center gap-1 px-2 py-2">
            <i className="bi bi-fire" />
            {streak} {streak === 1 ? "dia" : "dias"}
          </span>
          <span
            className="badge navbar-xp d-flex align-items-center gap-1 px-2 py-2"
            title={`Nível ${nivel.nivel}: ${nivel.xpNoNivel}/${nivel.xpParaProximo} XP para o próximo`}
          >
            <i className="bi bi-lightning-charge-fill" />
            <span className="d-none d-sm-inline">Nv {nivel.nivel} ·{" "}</span>
            {xp} XP
            <span className="navbar-xp-barra" aria-hidden="true">
              <span style={{ width: `${progressoNivel}%` }} />
            </span>
          </span>
          <Link href="/configuracoes" className="btn btn-outline-secondary btn-sm" title="Configurações">
            <i className="bi bi-gear" />
          </Link>
        </div>
      </div>
      <div className="d-md-none px-3 pb-2 w-100">
        <BuscaAulas />
      </div>
    </nav>
  );
}
