import { useId } from "react";
import { ZyreEstado } from "@/lib/mascote";

const BOCAS: Record<ZyreEstado, string> = {
  idle: "M27.4 39.6 Q28.7 41.3 30 39.8 Q31.3 41.3 32.6 39.6",
  olhando: "M27.4 39.6 Q28.7 41.3 30 39.8 Q31.3 41.3 32.6 39.6",
  pensando: "M28.4 40.6 Q30 40.1 31.6 40.6",
  falando: "M27.6 39.4 Q30 44.2 32.4 39.4 Z",
  comemorando: "M26.8 39 Q30 45.6 33.2 39 Z",
  triste: "M27.8 41.4 Q30 39.4 32.2 41.4",
};

const BOCA_ABERTA: Record<ZyreEstado, boolean> = {
  idle: false,
  olhando: false,
  pensando: false,
  falando: true,
  comemorando: true,
  triste: false,
};

export default function ZyreSvg({ estado = "idle" }: { estado?: ZyreEstado }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pelo = `url(#zyre-pelo-${id})`;

  return (
    <svg viewBox="0 0 64 72" className={`mascote-svg zyre-svg zyre-svg-${estado}`} aria-hidden="true">
      <defs>
        <linearGradient id={`zyre-pelo-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="zyre-pelo-a" />
          <stop offset="100%" className="zyre-pelo-b" />
        </linearGradient>
        <radialGradient id={`zyre-brilho-${id}`}>
          <stop offset="0%" className="zyre-brilho-a" />
          <stop offset="100%" className="zyre-brilho-b" />
        </radialGradient>
      </defs>

      <ellipse className="mascote-sombra" cx="30" cy="68.6" rx="14" ry="2.4" />

      <g className="zyre-inteiro">
        <g className="zyre-cauda">
          <path className="zyre-cauda-contorno" d="M37 58 C48 59 55.5 51 53 37.5" />
          <path className="zyre-cauda-pelo" stroke={pelo} d="M37 58 C48 59 55.5 51 53 37.5" />
          <path className="zyre-cauda-ponta" d="M54.3 43.5 C54.2 41.3 53.7 39.4 53 37.5" />
          <g className="zyre-chama">
            <circle cx="53" cy="30.5" r="9.5" fill={`url(#zyre-brilho-${id})`} />
            <path
              className="zyre-chama-fogo"
              d="M53 21.6 C55.8 25 57.6 28 57.4 31 C57.2 34.4 55.2 36.4 53 36.4 C50.8 36.4 48.8 34.4 48.6 31 C48.4 28 50.2 25 53 21.6 Z"
            />
            <ellipse className="zyre-chama-nucleo" cx="53" cy="32" rx="1.9" ry="2.4" />
          </g>
        </g>

        <ellipse className="zyre-contorno" fill={pelo} cx="30" cy="54.5" rx="12.5" ry="10.2" />
        <ellipse className="zyre-claro" cx="30" cy="56.5" rx="7.4" ry="6.4" />
        <ellipse className="zyre-contorno" fill={pelo} cx="23.4" cy="64.3" rx="4.1" ry="2.7" />
        <ellipse className="zyre-contorno" fill={pelo} cx="36.6" cy="64.3" rx="4.1" ry="2.7" />

        <g className="zyre-cabeca">
          <g className="zyre-orelha zyre-orelha-esq">
            <path className="zyre-contorno" fill={pelo} d="M14.6 26 L11.6 3.8 L27.4 15.4 Z" />
            <path className="zyre-orelha-dentro" d="M16.6 21.2 L15 9.4 L23.4 15.8 Z" />
          </g>
          <g className="zyre-orelha zyre-orelha-dir">
            <path className="zyre-contorno" fill={pelo} d="M45.4 26 L48.4 3.8 L32.6 15.4 Z" />
            <path className="zyre-orelha-dentro" d="M43.4 21.2 L45 9.4 L36.6 15.8 Z" />
          </g>
          <path className="zyre-chifre" d="M24.8 17 L22.4 7.4 L29 15.2 Z" />
          <path className="zyre-chifre" d="M35.2 17 L37.6 7.4 L31 15.2 Z" />

          <ellipse className="zyre-contorno" fill={pelo} cx="30" cy="31" rx="17" ry="15.4" />
          <ellipse className="zyre-claro" cx="23.4" cy="38.4" rx="7" ry="5.2" />
          <ellipse className="zyre-claro" cx="36.6" cy="38.4" rx="7" ry="5.2" />
          <ellipse className="zyre-claro" cx="30" cy="39.4" rx="5.4" ry="4.6" />
          <ellipse className="zyre-bochecha" cx="16.4" cy="34.6" rx="2.5" ry="1.6" />
          <ellipse className="zyre-bochecha" cx="43.6" cy="34.6" rx="2.5" ry="1.6" />

          <g className="zyre-olhos">
            {[22.4, 37.6].map((cx) => (
              <g className="zyre-olho" key={cx}>
                <ellipse className="zyre-olho-fundo" cx={cx} cy="30" rx="4.1" ry="5.1" />
                <ellipse className="zyre-iris" cx={cx} cy="31.7" rx="2.7" ry="2.9" />
                <circle className="zyre-reflexo" cx={cx - 1.4} cy="28.2" r="1.55" />
                <circle className="zyre-reflexo" cx={cx + 1.3} cy="32.6" r="0.7" />
              </g>
            ))}
          </g>

          <ellipse className="zyre-nariz" cx="30" cy="36.2" rx="1.6" ry="1.1" />
          <path className={`zyre-boca ${BOCA_ABERTA[estado] ? "zyre-boca-aberta" : ""}`} d={BOCAS[estado]} />
        </g>
      </g>
    </svg>
  );
}
