export interface NivelXp {
  nivel: number;
  xpNoNivel: number;
  xpParaProximo: number;
}

const CUSTO_PRIMEIRO_NIVEL = 100;
const AUMENTO_POR_NIVEL = 50;

// Nível 1 começa com 0 XP; subir custa 100, depois 150, 200... (cada nível pede 50 a mais)
export function calcularNivel(xp: number): NivelXp {
  let nivel = 1;
  let restante = Math.max(0, Math.floor(xp));
  let custo = CUSTO_PRIMEIRO_NIVEL;
  while (restante >= custo) {
    restante -= custo;
    nivel++;
    custo += AUMENTO_POR_NIVEL;
  }
  return { nivel, xpNoNivel: restante, xpParaProximo: custo };
}
