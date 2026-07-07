---
numero: 13
titulo: "Módulos ES"
nivel: "intermediario"
objetivo: "Organizar código em módulos com import/export."
duracao: 10
status: "completo"
---

## Conceito

Módulos ES (ECMAScript Modules, ou "ESM") são a forma padrão do JavaScript moderno de dividir
código em arquivos separados, cada um com seu próprio escopo. Cada módulo declara explicitamente o
que **exporta** (torna disponível para outros arquivos) e cada arquivo que quer usá-lo declara o
que **importa**. Isso evita poluir o escopo global e deixa claras as dependências entre arquivos.

## Sintaxe

```javascript
// arquivo: matematica.js
export function somar(a, b) {
  return a + b;
}
export const PI = 3.14159;

// arquivo: principal.js
import { somar, PI } from "./matematica.js";
console.log(somar(2, 3), PI);
```

## Exemplos comentados

```javascript
// --- named exports (exportação nomeada): pode ter várias por arquivo ---
// arquivo: utilitarios.js
export function formatarMoeda(valor) {
  return `R$${valor.toFixed(2)}`;
}
export function capitalizar(texto) {
  return texto[0].toUpperCase() + texto.slice(1);
}

// importando named exports específicos
import { formatarMoeda, capitalizar } from "./utilitarios.js";

// importando com apelido (alias)
import { formatarMoeda as moeda } from "./utilitarios.js";

// importando TUDO como um único objeto (namespace import)
import * as Utilitarios from "./utilitarios.js";
Utilitarios.formatarMoeda(99.9);

// --- default export: no máximo UM por arquivo ---
// arquivo: Botao.js
export default function Botao() {
  console.log("Renderizando botão");
}

// importando um default export — o nome escolhido na importação é livre
import Botao from "./Botao.js";
import MeuBotao from "./Botao.js"; // funciona igual, o nome não precisa bater

// é possível combinar named e default exports no mesmo arquivo
export default function App() {}
export const versao = "1.0.0";
// import App, { versao } from "./App.js";

// re-exportar de outro módulo (comum em arquivos "index" que agrupam exports)
export { somar } from "./matematica.js";
```

## Exercício 1: Escreva um módulo com named exports

Escreva o conteúdo de um arquivo `validacoes.js` que exporta duas funções: `ehEmailValido(email)`
(retorna `true` se contiver `"@"`) e `ehMaiorDeIdade(idade)` (retorna `true` se `idade >= 18`).
Depois, escreva a linha de `import` que traria as duas para outro arquivo.

### Solução

```javascript
// arquivo: validacoes.js
export function ehEmailValido(email) {
  return email.includes("@");
}

export function ehMaiorDeIdade(idade) {
  return idade >= 18;
}
```

```javascript
// em outro arquivo:
import { ehEmailValido, ehMaiorDeIdade } from "./validacoes.js";

console.log(ehEmailValido("ana@exemplo.com")); // true
console.log(ehMaiorDeIdade(15));                // false
```

Como as duas funções usam `export` (não `export default`), o arquivo que importa precisa usar
chaves `{}` e repetir exatamente os nomes exportados (ou usar `as` para renomear).

## Exercício 2: Escreva um módulo com default export

Escreva o conteúdo de um arquivo `contador.js` que exporta como **default** uma função `criarContador()`
que retorna um objeto com um método `incrementar()` e uma propriedade `valor` iniciando em 0.

### Solução

```javascript
// arquivo: contador.js
export default function criarContador() {
  let valor = 0;
  return {
    incrementar() {
      valor += 1;
      return valor;
    },
    get valor() {
      return valor;
    },
  };
}
```

```javascript
// em outro arquivo:
import criarContador from "./contador.js";

const contador = criarContador();
contador.incrementar();
contador.incrementar();
console.log(contador.valor); // 2
```

Como `criarContador` é um `export default`, quem importa pode escolher qualquer nome para ele (não
precisa ser exatamente `criarContador`), e a importação não usa chaves `{}`.

## Quiz

### 1. Quantos `export default` um módulo pode ter?

- [ ] Quantos quiser
- [x] No máximo um
- [ ] Exatamente dois
- [ ] Zero, `export default` foi descontinuado

> Cada arquivo pode ter apenas um `export default` (representando o "principal" export daquele
> módulo), mas pode combinar isso com quantos `named exports` quiser no mesmo arquivo.

### 2. Ao importar um named export, o nome usado no `import` precisa bater com o do `export`?

- [x] Sim, a menos que seja renomeado explicitamente com `as`
- [ ] Não, o nome é sempre livre
- [ ] Só precisa bater se for um `export default`
- [ ] Depende do navegador

> Named exports são importados por nome exato: `import { somar } from "..."` só funciona se o
> módulo exportou algo chamado `somar`. Para usar outro nome localmente, é preciso `import { somar
> as soma } from "..."`.

### 3. Qual a principal vantagem de dividir código em módulos ES?

- [ ] O código roda mais rápido automaticamente
- [x] Cada arquivo tem seu próprio escopo, evitando poluir o escopo global, e as dependências entre arquivos ficam explícitas
- [ ] Módulos eliminam a necessidade de testes
- [ ] É a única forma de declarar funções em JavaScript

> Sem módulos, todo código carregado em uma página compartilha o mesmo escopo global, o que causa
> conflitos de nome em projetos grandes. Módulos ES isolam cada arquivo e tornam explícito, via
> `import`/`export`, exatamente o que cada arquivo usa de outro.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Módulos ES" na trilha de JavaScript/TypeScript do CodePath. Contexto: o
> capítulo explica named exports, default export e as diferentes formas de import. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
