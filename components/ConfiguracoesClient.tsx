"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";

export default function ConfiguracoesClient() {
  const { hidratado, unlockAll, setUnlockAll, resetarProgresso, completedSlugs, studyDates, streak } =
    useProgress();
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div className="container-fluid" style={{ maxWidth: 700 }}>
      <h1 className="h3 fw-bold mb-4">
        <i className="bi bi-gear me-2 text-primary" />
        Configurações
      </h1>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h6 fw-semibold mb-3">Navegação</h2>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="unlockAllSwitch"
              checked={hidratado && unlockAll}
              onChange={(e) => setUnlockAll(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="unlockAllSwitch">
              Destravar todas as aulas
            </label>
          </div>
          <p className="text-body-secondary small mb-0 mt-2">
            Por padrão, cada aula só é liberada quando você conclui a anterior. Ative esta opção se
            quiser navegar livremente pelo currículo, fora de ordem.
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h6 fw-semibold mb-3">Seu progresso</h2>
          <ul className="list-unstyled small text-body-secondary mb-0">
            <li className="mb-1">
              <i className="bi bi-check-circle me-2 text-success" />
              {hidratado ? completedSlugs.size : 0} aulas concluídas
            </li>
            <li className="mb-1">
              <i className="bi bi-fire me-2 text-warning" />
              Streak atual: {hidratado ? streak : 0} {streak === 1 ? "dia" : "dias"}
            </li>
            <li>
              <i className="bi bi-calendar-check me-2 text-info" />
              {hidratado ? studyDates.length : 0} dias distintos de estudo registrados
            </li>
          </ul>
        </div>
      </div>

      <div className="card border-danger-subtle">
        <div className="card-body">
          <h2 className="h6 fw-semibold mb-3 text-danger">Zona de risco</h2>
          <p className="text-body-secondary small">
            Isso apaga todo o progresso salvo neste navegador: aulas concluídas, respostas de quiz,
            rascunhos de exercícios e streak. Não pode ser desfeito.
          </p>
          {!confirmando ? (
            <button className="btn btn-outline-danger" onClick={() => setConfirmando(true)}>
              Resetar progresso
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                className="btn btn-danger"
                onClick={() => {
                  resetarProgresso();
                  setConfirmando(false);
                }}
              >
                Confirmar reset
              </button>
              <button className="btn btn-outline-secondary" onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
