---
numero: 20
titulo: "Narrowing"
nivel: "avancado"
objetivo: "Refinar tipos em tempo de compilação com narrowing."
duracao: 12
status: "completo"
---

## Conceito

Narrowing (estreitamento) é o processo pelo qual o TypeScript reduz um tipo mais amplo (como
`string | number`) a um tipo mais específico, dentro de um bloco de código, com base em checagens
que você já escreveria naturalmente em JavaScript (`typeof`, `if`, etc.). O compilador "segue" essa
lógica automaticamente, sem precisar de anotações extras.

## Sintaxe

```typescript
function formatar(valor: string | number): string {
  if (typeof valor === "string") {
    return valor.toUpperCase(); // aqui, TypeScript já sabe que valor é string
  }
  return valor.toFixed(2);       // aqui, já sabe que é number
}
```

## Exemplos comentados

```typescript
// typeof narrowing: o mais comum, para tipos primitivos
function processar(valor: string | number | boolean) {
  if (typeof valor === "string") {
    console.log(valor.trim());        // métodos de string disponíveis
  } else if (typeof valor === "number") {
    console.log(valor.toFixed(1));     // métodos de number disponíveis
  } else {
    console.log(valor ? "sim" : "não"); // aqui só resta boolean
  }
}

// truthiness narrowing: checar se um valor existe antes de usá-lo
function saudar(nome: string | null) {
  if (nome) {
    console.log(nome.toUpperCase()); // TypeScript sabe que nome não é null aqui
  } else {
    console.log("Nome não informado");
  }
}

// Optional chaining (?.) + nullish coalescing (??) trabalham bem com narrowing
function tamanhoDoNome(usuario: { nome?: string }): number {
  return usuario.nome?.length ?? 0; // se nome for undefined, usa 0
}

// instanceof narrowing: útil com classes
class Cachorro { latir() { return "Au au!"; } }
class Gato { miar() { return "Miau!"; } }

function fazerSom(animal: Cachorro | Gato): string {
  if (animal instanceof Cachorro) {
    return animal.latir(); // TypeScript sabe que é Cachorro aqui
  }
  return animal.miar();     // só resta Gato
}

// "in" narrowing: checa se uma propriedade existe no objeto
interface Circulo { raio: number; }
interface Quadrado { lado: number; }

function calcularArea(forma: Circulo | Quadrado): number {
  if ("raio" in forma) {
    return Math.PI * forma.raio ** 2; // TypeScript sabe que é Circulo
  }
  return forma.lado ** 2;              // só resta Quadrado
}

// Type guards customizados: funções que "ensinam" o TypeScript a estreitar um tipo
function ehString(valor: unknown): valor is string {
  return typeof valor === "string";
}
function usar(valor: unknown) {
  if (ehString(valor)) {
    console.log(valor.toUpperCase()); // narrowed para string
  }
}
```

## Exercício 1: Narrowing com typeof

Escreva uma função `dobrarOuRepetir(valor: number | string)` que retorna o dobro se `valor` for
`number`, ou a string repetida duas vezes se for `string`.

### Solução

```typescript
function dobrarOuRepetir(valor: number | string): number | string {
  if (typeof valor === "number") {
    return valor * 2;
  }
  return valor + valor;
}

console.log(dobrarOuRepetir(5));       // 10
console.log(dobrarOuRepetir("ab"));    // "abab"
```

Dentro do bloco `if (typeof valor === "number")`, o TypeScript já sabe que `valor` é `number`,
permitindo `valor * 2` sem erro. Fora desse bloco (no `return` seguinte), ele sabe que só resta a
possibilidade `string`.

## Exercício 2: Narrowing com "in"

Dadas as interfaces `Circulo { raio: number }` e `Quadrado { lado: number }` do exemplo, escreva
uma função `descrever(forma: Circulo | Quadrado)` que retorna `"Círculo de raio X"` ou `"Quadrado
de lado X"`, usando `"raio" in forma` para diferenciar.

### Solução

```typescript
interface Circulo {
  raio: number;
}
interface Quadrado {
  lado: number;
}

function descrever(forma: Circulo | Quadrado): string {
  if ("raio" in forma) {
    return `Círculo de raio ${forma.raio}`;
  }
  return `Quadrado de lado ${forma.lado}`;
}

console.log(descrever({ raio: 5 }));   // "Círculo de raio 5"
console.log(descrever({ lado: 4 }));   // "Quadrado de lado 4"
```

O operador `in` checa, em tempo de execução, se uma propriedade existe no objeto — e o TypeScript
usa exatamente essa checagem para estreitar o tipo em tempo de compilação: dentro do `if`, `forma`
é tratado como `Circulo`; fora dele, como `Quadrado`.

## Quiz

### 1. O que "narrowing" significa em TypeScript?

- [ ] Reduzir o tamanho do arquivo compilado
- [x] Refinar um tipo mais amplo (como uma união) para um tipo mais específico, dentro de um bloco de código
- [ ] Um erro comum ao declarar tipos
- [ ] Uma forma de remover tipos do código

> Narrowing é o processo pelo qual o compilador do TypeScript reduz o conjunto de tipos possíveis
> de uma variável (por exemplo, de `string | number` para apenas `string`) dentro de um bloco de
> código, com base em checagens que você já faz naturalmente (`typeof`, `in`, `instanceof`, etc.).

### 2. Qual checagem é usada para diferenciar tipos primitivos como `string` e `number`?

- [ ] `instanceof`
- [x] `typeof`
- [ ] `in`
- [ ] `Array.isArray`

> `typeof valor === "string"` (ou `"number"`, `"boolean"`, etc.) é a forma padrão de estreitar
> tipos primitivos. `instanceof` é usado para diferenciar instâncias de classes, e `in` para
> checar a presença de uma propriedade específica em um objeto.

### 3. O que uma função como `function ehString(valor: unknown): valor is string` representa?

- [ ] Uma função comum que sempre retorna `boolean`, sem efeito no tipo
- [x] Um "type guard" customizado: ensina o TypeScript a estreitar o tipo do argumento onde a função é usada em um `if`
- [ ] Um erro de sintaxe, pois `is` não é uma palavra-chave válida
- [ ] Uma função que só funciona com strings vazias

> A sintaxe `valor is string` no tipo de retorno marca a função como um type guard. Quando usada
> dentro de um `if`, o TypeScript aplica narrowing ao tipo do argumento no bloco correspondente —
> exatamente como faria com `typeof` embutido, mas com lógica customizada.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Narrowing" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica narrowing com typeof, in, instanceof e type guards customizados. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
