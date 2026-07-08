"use client";

import { RefObject, useState } from "react";
import { RATE_OPTIONS, useLessonAudio } from "@/lib/useLessonAudio";

export default function LessonAudioPlayer({
  contentRef,
  lessonKey,
}: {
  contentRef: RefObject<HTMLDivElement | null>;
  lessonKey: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    supported,
    state,
    rate,
    voices,
    voiceURI,
    hasPortugueseVoice,
    play,
    pause,
    stop,
    changeRate,
    changeVoice,
  } = useLessonAudio(contentRef, lessonKey);

  if (!supported) return null;

  return (
    <div className="card lesson-audio-player mb-4">
      <div className="card-body py-2 px-3">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-soundwave text-primary" aria-hidden="true" />
            <span className="fw-semibold small">Ouvir esta aula</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary border-0"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expandir player de áudio" : "Recolher player de áudio"}
          >
            <i className={`bi ${collapsed ? "bi-chevron-down" : "bi-chevron-up"}`} />
          </button>
        </div>

        {!collapsed && (
          <>
            <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => (state === "playing" ? pause() : play())}
              >
                <i className={`bi ${state === "playing" ? "bi-pause-fill" : "bi-play-fill"} me-1`} />
                {state === "playing" ? "Pausar" : state === "paused" ? "Continuar" : "Ouvir"}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={stop}
                disabled={state === "idle"}
              >
                <i className="bi bi-stop-fill me-1" />
                Parar
              </button>

              <select
                className="form-select form-select-sm w-auto"
                value={rate}
                onChange={(e) => changeRate(Number(e.target.value))}
                aria-label="Velocidade da leitura"
              >
                {RATE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}x
                  </option>
                ))}
              </select>

              <select
                className="form-select form-select-sm w-auto flex-grow-1"
                style={{ minWidth: 140 }}
                value={voiceURI}
                onChange={(e) => changeVoice(e.target.value)}
                aria-label="Voz da leitura"
                disabled={voices.length === 0}
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {!hasPortugueseVoice && (
              <div className="small text-secondary mt-2">
                <i className="bi bi-info-circle me-1" />
                Nenhuma voz em português foi encontrada neste dispositivo. Usando a voz padrão do
                sistema.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
