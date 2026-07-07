---
numero: 6
titulo: "Funções e arrow functions"
nivel: "basico"
objetivo: "Declarar funções tradicionais e arrow functions, e entender suas diferenças."
duracao: 12
status: "completo"
---

## Conceito

JavaScript tem várias formas de declarar funções: **declaração de função**, **expressão de
função** e **arrow function** (função de seta, introduzida no ES6). Todas criam funções, mas têm
diferenças importantes de comportamento — a mais relevante é que arrow functions não têm seu
próprio `this` (assunto do capítulo "this" mais adiante nesta trilha).

## Sintaxe

```javascript
// Declaração de função (hoisted: pode ser chamada antes de aparecer no código)
function somar(a, b) {
  return a + b;
}

// Expressão de função (não hoisted)
const multiplicar = function (a, b) {
  return a * b;
};

// Arrow function
const dividir = (a, b) => a / b;              // return implícito, corpo em uma linha
const subtrair = (a, b) => {                    // corpo com chaves precisa de return explícito
  return a - b;
};
const dobrar = (n) => n * 2;                     // um parâmetro, parênteses opcionais: n => n * 2
```

## Exemplos comentados

```javascript
// Parâmetros com valor padrão
function saudacao(nome = "visitante") {
  return `Olá, ${nome}!`;
}
saudacao();          // "Olá, visitante!"
saudacao("Ana");      // "Olá, Ana!"

// Rest parameters: captura argumentos extras em um array (equivalente a *args do Python)
function somarTudo(...numeros) {
  return numeros.reduce((total, n) => total + n, 0);
}
somarTudo(1, 2, 3, 4); // 10

// Funções são "cidadãos de primeira classe": podem ser passadas como valor
function aplicar(funcao, valor) {
  return funcao(valor);
}
aplicar((n) => n * n, 5); // 25

// Diferença de hoisting entre declaração e expressão de função
console.log(dobra(3)); // funciona! 6
function dobra(n) {
  return n * 2;
}

// console.log(triplica(3)); // ReferenceError: Cannot access before initialization
const triplica = (n) => n * 3;

// Arrow functions são ideais para callbacks curtos
[1, 2, 3].map((n) => n * 2); // [2, 4, 6]
```

## Exercício 1: Refatore para arrow function

Reescreva a função abaixo como uma arrow function equivalente, o mais concisa possível:

```javascript
function ehMaiorDeIdade(idade) {
  return idade >= 18;
}
```

### Solução

```javascript
const ehMaiorDeIdade = (idade) => idade >= 18;

console.log(ehMaiorDeIdade(20)); // true
console.log(ehMaiorDeIdade(15)); // false
```

Como o corpo da função é uma única expressão (`idade >= 18`), a arrow function pode omitir as
chaves `{}` e a palavra `return` — o valor da expressão já é retornado automaticamente.

## Exercício 2: Função com número variável de argumentos

Escreva uma função `media(...numeros)` que calcula a média de qualquer quantidade de números
passados como argumento.

### Solução

```javascript
function media(...numeros) {
  if (numeros.length === 0) return 0;
  const soma = numeros.reduce((total, n) => total + n, 0);
  return soma / numeros.length;
}

console.log(media(4, 8, 15));    // 9
console.log(media(10, 20));       // 15
```

O rest parameter `...numeros` agrupa qualquer quantidade de argumentos posicionais em um array de
verdade, permitindo usar diretamente métodos de array como `reduce` sobre eles.

## Quiz

### 1. Qual a diferença entre uma declaração de função e uma expressão de função quanto a hoisting?

- [ ] Não há diferença, ambas se comportam igual
- [x] Declarações de função podem ser chamadas antes de aparecerem no código; expressões, não
- [ ] Expressões de função são sempre mais rápidas
- [ ] Apenas arrow functions têm hoisting

> Declarações de função (`function nome() {}`) são "hoisted" (elevadas) completamente, podendo ser
> chamadas em qualquer ponto do escopo, mesmo antes de sua definição no código. Expressões de
> função atribuídas a `const`/`let` (incluindo arrow functions) só existem a partir do ponto onde
> são declaradas.

### 2. O que `(a, b) => a + b` retorna quando chamada?

- [ ] `undefined`, porque falta a palavra `return`
- [x] O resultado de `a + b`, porque arrow functions com corpo em uma expressão têm return implícito
- [ ] Um erro de sintaxe
- [ ] Sempre retorna `NaN`

> Quando o corpo de uma arrow function é uma única expressão sem chaves `{}`, o resultado dessa
> expressão é retornado automaticamente, sem precisar da palavra-chave `return`.

### 3. Para que serve a sintaxe `...numeros` como parâmetro de uma função?

- [ ] Só é decorativa, não tem efeito
- [x] Captura qualquer quantidade de argumentos extras como um array de verdade (rest parameters)
- [ ] Limita a função a receber no máximo 3 argumentos
- [ ] Funciona só com arrow functions

> `...numeros` (rest parameter) coleta todos os argumentos passados a partir daquela posição em um
> array real, que já suporta métodos como `map`, `filter` e `reduce` diretamente — equivalente ao
> `*args` do Python.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Funções e arrow functions" na trilha de JavaScript/TypeScript do CodePath.
> Contexto: o capítulo explica declaração vs. expressão de função, arrow functions, parâmetros
> padrão e rest parameters. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
