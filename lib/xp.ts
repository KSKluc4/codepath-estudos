export interface NivelXp {
  nivel: number;
  xpNoNivel: number;
  xpParaProximo: number;
}

// TODO(Lucas): calcular o nível a partir do XP total.
// Regra: todo mundo começa no nível 1 com 0 XP, e cada nível custa 50 XP a mais que o
// anterior para subir: 1→2 custa 100, 2→3 custa 150, 3→4 custa 200, e assim por diante.
// Devolva:
//   - nivel: o nível atual;
//   - xpNoNivel: quanto XP a pessoa já juntou dentro do nível atual;
//   - xpParaProximo: quanto o nível atual custa no total para subir.
// Dica: um while que vai "pagando" o custo de cada nível enquanto o XP der para pagar.
// Como testar (Node 24 roda .ts direto):
//   node --input-type=module -e "import { calcularNivel } from './lib/xp.ts'; for (const xp of [0, 99, 100, 260]) console.log(xp, calcularNivel(xp))"
//   Esperado: 0 → nível 1 com 0/100; 99 → nível 1 com 99/100; 100 → nível 2 com 0/150;
//   260 → nível 3 com 10/200. Depois confira o Navbar e a tela de fim da lição.
export function calcularNivel(xp: number): NivelXp {
  return { nivel: 1, xpNoNivel: xp, xpParaProximo: 100 };
}
