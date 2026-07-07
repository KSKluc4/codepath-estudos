---
numero: 2
titulo: "Tipos"
nivel: "basico"
objetivo: "Conhecer os tipos primitivos de JavaScript e conversões entre eles."
duracao: 10
status: "completo"
---

## Conceito

JavaScript tem tipagem **dinâmica** (o tipo é descoberto em tempo de execução) e **fraca** (a
linguagem converte tipos automaticamente em muitas operações, o que pode surpreender). Os tipos
primitivos são: `number`, `string`, `boolean`, `undefined`, `null`, `bigint` e `symbol`. Tudo que
não é primitivo (objetos, arrays, funções) é do tipo `object` (com exceção de funções, que retornam
`"function"` em `typeof`).

## Sintaxe

```javascript
typeof 42;          // "number"
typeof "texto";       // "string"
typeof true;          // "boolean"
typeof undefined;      // "undefined"
typeof null;           // "object" — pegadinha histórica da linguagem!
typeof [1, 2, 3];        // "object" — arrays são objetos
typeof {};               // "object"
typeof function () {};   // "function"
```

## Exemplos comentados

```javascript
// undefined: variável declarada mas sem valor atribuído
let x;
console.log(x); // undefined

// null: ausência de valor atribuída INTENCIONALMENTE
let y = null;

// Conversões explícitas
Number("42");     // 42
String(42);        // "42"
Boolean(0);         // false
Boolean("");         // false
Boolean("qualquer");  // true

// Coerção implícita (automática) — fonte clássica de bugs em JS
"5" + 3;      // "53" — + com string concatena
"5" - 3;      // 2 — outros operadores aritméticos convertem para número
"5" * "2";    // 10
true + 1;     // 2 — true vira 1
false + 1;    // 1 — false vira 0

// == faz coerção de tipo antes de comparar; === compara tipo E valor
0 == "0";      // true  (coerção: "0" vira 0)
0 === "0";     // false (tipos diferentes: number !== string)
null == undefined;   // true
null === undefined;  // false

// Recomendação da comunidade: prefira sempre === e !== para evitar surpresas
```

## Exercício 1: Preveja o resultado

Sem rodar o código, diga o que cada linha imprime:

```javascript
console.log("10" + 5);
console.log("10" - 5);
console.log(10 === "10");
console.log(10 == "10");
```

### Solução

```javascript
console.log("10" + 5);      // "105" — + com string concatena
console.log("10" - 5);      // 5 — "-" força conversão para número
console.log(10 === "10");   // false — tipos diferentes (number vs string)
console.log(10 == "10");    // true — == converte "10" para número antes de comparar
```

O operador `+` é especial: quando um dos lados é `string`, ele concatena em vez de somar. Os
demais operadores aritméticos (`-`, `*`, `/`) sempre tentam converter para número.

## Exercício 2: Corrija a comparação

O código abaixo tem um bug sutil causado por coerção de tipo. Identifique e conserte usando `===`.

```javascript
function ehZero(valor) {
  return valor == 0;
}

console.log(ehZero(""));  // deveria ser false, mas retorna true
```

### Solução

```javascript
function ehZero(valor) {
  return valor === 0;
}

console.log(ehZero(""));  // false — string vazia não é o número 0
console.log(ehZero(0));   // true
```

Com `==`, `"" == 0` é `true` porque o JavaScript converte a string vazia para o número `0` antes de
comparar. Usando `===`, a comparação exige que ambos os lados tenham o mesmo tipo, evitando essa
coerção inesperada — por isso `===` é a prática recomendada na maioria dos casos.

## Quiz

### 1. O que `typeof null` retorna em JavaScript?

- [ ] `"null"`
- [x] `"object"`
- [ ] `"undefined"`
- [ ] `"boolean"`

> É uma peculiaridade histórica da linguagem (um bug antigo que nunca foi corrigido, por questões
> de compatibilidade): `typeof null` retorna `"object"`, mesmo `null` não sendo um objeto de fato.

### 2. Qual a diferença entre `==` e `===`?

- [ ] Não há diferença, são sinônimos
- [x] `==` faz coerção de tipo antes de comparar; `===` compara tipo e valor sem converter
- [ ] `===` é mais lento e por isso evitado
- [ ] `==` só funciona com números

> `===` (igualdade estrita) exige que ambos os operandos tenham o mesmo tipo além do mesmo valor.
> `==` (igualdade solta) converte um dos lados para tentar igualar os tipos antes de comparar, o
> que causa resultados contraintuitivos como `0 == "0"` ser `true`.

### 3. O que `Boolean("")` retorna?

- [ ] `true`
- [x] `false`
- [ ] `"false"`
- [ ] `undefined`

> Strings vazias são "falsy" em JavaScript — `Boolean("")` retorna `false`. Qualquer outra string
> não vazia (mesmo `"false"` ou `"0"` como texto) é "truthy" e retorna `true`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Tipos" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica os tipos primitivos, coerção implícita e a diferença entre == e ===. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
