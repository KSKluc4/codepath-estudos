export type Som = "acerto" | "erro" | "combo" | "fim" | "meta" | "conquista";

let contexto: AudioContext | null = null;

function obterContexto(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  contexto ??= new AudioContext();
  if (contexto.state === "suspended") void contexto.resume();
  return contexto;
}

function nota(
  ctx: AudioContext,
  frequencia: number,
  inicio: number,
  duracao: number,
  { tipo = "triangle", volume = 0.16, deslizarPara }: { tipo?: OscillatorType; volume?: number; deslizarPara?: number } = {}
) {
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();
  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(frequencia, inicio);
  if (deslizarPara) oscilador.frequency.exponentialRampToValueAtTime(deslizarPara, inicio + duracao);
  // Envelope rápido para não estalar no começo nem no fim da nota
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.015);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
  oscilador.connect(ganho).connect(ctx.destination);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracao + 0.05);
}

export function tocarSom(som: Som) {
  const ctx = obterContexto();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;

  switch (som) {
    case "acerto":
      nota(ctx, 659.25, t, 0.12);
      nota(ctx, 987.77, t + 0.09, 0.24);
      break;
    case "erro":
      nota(ctx, 311.13, t, 0.16, { volume: 0.14 });
      nota(ctx, 233.08, t + 0.13, 0.32, { volume: 0.14, deslizarPara: 196 });
      break;
    case "combo":
      [1046.5, 1318.51, 1567.98, 2093].forEach((freq, i) => nota(ctx, freq, t + i * 0.06, 0.18, { volume: 0.11 }));
      nota(ctx, 3135.96, t + 0.26, 0.3, { tipo: "sine", volume: 0.05 });
      break;
    case "fim":
      [523.25, 659.25, 783.99].forEach((freq, i) => nota(ctx, freq, t + i * 0.12, 0.2));
      [1046.5, 1318.51, 1567.98].forEach((freq) => nota(ctx, freq, t + 0.38, 0.7, { volume: 0.09 }));
      break;
    case "meta":
      [783.99, 1046.5, 1318.51, 1567.98].forEach((freq, i) => nota(ctx, freq, t + i * 0.08, 0.22, { volume: 0.12 }));
      nota(ctx, 2093, t + 0.34, 0.45, { tipo: "sine", volume: 0.06 });
      break;
    case "conquista":
      nota(ctx, 523.25, t, 0.16);
      nota(ctx, 783.99, t + 0.14, 0.16);
      [1046.5, 1318.51, 1567.98, 2093].forEach((freq) => nota(ctx, freq, t + 0.3, 0.8, { volume: 0.07 }));
      break;
  }
}
