export function htmlParaTexto(html: string, limite: number): string {
  const semTags = html.replace(/<[^>]+>/g, " ");
  const semEntidades = decodificarEntidades(semTags);
  const normalizado = semEntidades.replace(/\s+/g, " ").trim();

  if (normalizado.length <= limite) return normalizado;
  return `${normalizado.slice(0, limite).trimEnd()}…`;
}

const ENTIDADES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

function decodificarEntidades(texto: string): string {
  return texto.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (entidade) => ENTIDADES[entidade]);
}
