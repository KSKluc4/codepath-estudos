import { useId } from "react";
import { BitEstado } from "@/lib/mascote";

const BOCAS: Record<BitEstado, string> = {
  idle: "M27 39 Q32 42.5 37 39",
  olhando: "M27 39 Q32 42.5 37 39",
  pensando: "M28 40 Q32 41 36 40",
  falando: "M27 39 Q32 44.5 37 39",
  comemorando: "M26 38.5 Q32 46 38 38.5",
  triste: "M27 42 Q32 38.5 37 42",
};

export default function BitSvg({ estado = "idle" }: { estado?: BitEstado }) {
  const gradienteId = `bit-gradiente-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 64 72" className={`mascote-svg bit-svg-${estado}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradienteId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" className="mascote-grad-a" />
          <stop offset="100%" className="mascote-grad-b" />
        </linearGradient>
      </defs>
      <ellipse className="mascote-sombra" cx="32" cy="68" rx="16" ry="3" />
      <g className="mascote-corpo">
        <line x1="32" y1="14" x2="32" y2="7" className="mascote-antena" />
        <circle cx="32" cy="5" r="3.2" className="mascote-led" />
        <rect x="8" y="14" width="48" height="46" rx="14" fill={`url(#${gradienteId})`} />
        <rect x="15" y="22" width="34" height="23" rx="8" className="mascote-tela" />
        <g className="mascote-olhos">
          <ellipse cx="25" cy="32" rx="3.4" ry="4" className="mascote-olho" />
          <ellipse cx="39" cy="32" rx="3.4" ry="4" className="mascote-olho" />
        </g>
        <path d={BOCAS[estado]} className="mascote-boca" />
        <text x="32" y="55" textAnchor="middle" className="mascote-bits">
          01
        </text>
      </g>
    </svg>
  );
}
