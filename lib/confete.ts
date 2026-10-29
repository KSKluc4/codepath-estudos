const CORES = ["#5ec8f8", "#7ee3c3", "#f8d35e", "#f87171", "#c4b5fd", "#ffffff"];
const DURACAO_MS = 2800;

interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  giro: number;
  velocidadeGiro: number;
  tamanho: number;
  cor: string;
  redonda: boolean;
  fase: number;
}

// x e y são frações da tela (0 a 1); angulo é a direção do disparo em radianos (−π/2 = para cima)
export function dispararConfete({
  x = 0.5,
  y = 0.5,
  quantidade = 120,
  angulo = -Math.PI / 2,
  abertura = Math.PI * 0.8,
  forca = 1,
}: {
  x?: number;
  y?: number;
  quantidade?: number;
  angulo?: number;
  abertura?: number;
  forca?: number;
} = {}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const largura = window.innerWidth;
  const altura = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.className = "confete-canvas";
  canvas.width = largura * dpr;
  canvas.height = altura * dpr;
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  ctx.scale(dpr, dpr);

  const particulas: Particula[] = Array.from({ length: quantidade }, (_, i) => {
    const direcao = angulo + (Math.random() - 0.5) * abertura;
    const velocidade = (6 + Math.random() * 9) * forca;
    return {
      x: x * largura,
      y: y * altura,
      vx: Math.cos(direcao) * velocidade,
      vy: Math.sin(direcao) * velocidade,
      giro: Math.random() * Math.PI * 2,
      velocidadeGiro: (Math.random() - 0.5) * 0.4,
      tamanho: 6 + Math.random() * 6,
      cor: CORES[i % CORES.length],
      redonda: Math.random() < 0.3,
      fase: Math.random() * Math.PI * 2,
    };
  });

  const inicio = performance.now();
  let anterior = inicio;

  const quadro = (agora: number) => {
    const dt = Math.min((agora - anterior) / 16.67, 3);
    anterior = agora;
    const opacidade = Math.min(1, Math.max(0, (DURACAO_MS - (agora - inicio)) / 700));
    ctx.clearRect(0, 0, largura, altura);

    let visiveis = 0;
    for (const p of particulas) {
      p.vy += 0.3 * dt;
      p.vx *= 0.985 ** dt;
      p.vy *= 0.985 ** dt;
      p.x += (p.vx + Math.sin(p.fase + agora / 180) * 0.7) * dt;
      p.y += p.vy * dt;
      p.giro += p.velocidadeGiro * dt;
      if (p.y > altura + 20) continue;
      visiveis++;

      ctx.save();
      ctx.globalAlpha = opacidade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.cor;
      if (p.redonda) {
        ctx.beginPath();
        ctx.arc(0, 0, p.tamanho / 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // scaleY oscilando dá o efeito de papel girando no ar
        ctx.scale(1, Math.cos(p.fase + agora / 120));
        ctx.fillRect(-p.tamanho / 2, -p.tamanho / 4, p.tamanho, p.tamanho / 2);
      }
      ctx.restore();
    }

    if (visiveis > 0 && opacidade > 0) requestAnimationFrame(quadro);
    else canvas.remove();
  };
  requestAnimationFrame(quadro);
}
