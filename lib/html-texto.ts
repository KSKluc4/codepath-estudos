const ENTIDADES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

// O rehype gera referências numéricas (&#x3C;) e o parser do quiz gera nomeadas (&lt;)
function decodificarEntidade(entidade: string, corpo: string): string {
  if (corpo[0] !== "#") return ENTIDADES[corpo.toLowerCase()] ?? entidade;
  const hexadecimal = corpo[1] === "x" || corpo[1] === "X";
  const codigo = hexadecimal ? parseInt(corpo.slice(2), 16) : Number(corpo.slice(1));
  return codigo > 0 && codigo <= 0x10ffff ? String.fromCodePoint(codigo) : entidade;
}

// Remove as tags antes de decodificar: assim "&lt;b&gt;" continua texto e não vira tag
export function htmlParaTexto(html: string, limite: number): string {
  const texto = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, decodificarEntidade)
    .replace(/\s+/g, " ")
    .trim();
  return texto.length > limite ? `${texto.slice(0, Math.max(0, limite - 1)).trimEnd()}…` : texto;
}
