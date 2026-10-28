// TODO(Lucas): transformar o HTML da aula em texto puro e truncar em `limite` caracteres.
// O que fazer:
//   1. Remover todas as tags HTML (<p>, <strong>, <a href="...">...), mas manter o texto de dentro,
//      inclusive o de <pre>/<code>: os exemplos de código são úteis pro Bit.
//   2. Decodificar as entidades mais comuns: &amp; &lt; &gt; &quot; &#39;
//   3. Juntar espaços/quebras de linha repetidos num só espaço e tirar espaço das pontas.
//   4. Se passar de `limite`, cortar e terminar com "…".
// Dica: String.prototype.replace com regex global, ex.: texto.replace(/<[^>]+>/g, " ").
//   Atenção à ordem: decodificar &lt; antes de remover tags faria "&lt;b&gt;" virar uma tag.
// Como testar (Node 24 roda .ts direto):
//   node --input-type=module -e "import { htmlParaTexto } from './lib/html-texto.ts'; console.log(htmlParaTexto('<p>Oi &amp;  <b>tchau</b></p>\n<pre><code>x &lt; 3</code></pre>', 20))"
//   Esperado: "Oi & tchau x < 3" e, com limite 5, "Oi & …" (ou parecido).
export function htmlParaTexto(html: string, limite: number): string {
  return html.slice(0, limite);
}
