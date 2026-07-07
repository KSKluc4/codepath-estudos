---
numero: 4
titulo: "Arrays e métodos (map/filter/reduce)"
nivel: "basico"
objetivo: "Transformar coleções de forma funcional com map, filter e reduce."
duracao: 15
status: "completo"
---

## Conceito

Arrays em JavaScript têm métodos embutidos poderosos para transformar dados **sem loops
explícitos**. Os três mais importantes são `map` (transforma cada item, retorna um array do mesmo
tamanho), `filter` (seleciona itens que satisfazem uma condição, retorna um array menor ou igual) e
`reduce` (combina todos os itens em um único valor). Nenhum deles modifica o array original — todos
retornam um array (ou valor) novo.

## Sintaxe

```javascript
const numeros = [1, 2, 3, 4, 5];

numeros.map((n) => n * 2);              // [2, 4, 6, 8, 10]
numeros.filter((n) => n % 2 === 0);      // [2, 4]
numeros.reduce((acumulador, n) => acumulador + n, 0);  // 15
```

## Exemplos comentados

```javascript
const produtos = [
  { nome: "Mouse", preco: 80 },
  { nome: "Teclado", preco: 150 },
  { nome: "Monitor", preco: 900 },
];

// map: transforma cada item em outra coisa (mesma quantidade de itens)
const nomes = produtos.map((p) => p.nome);
// ["Mouse", "Teclado", "Monitor"]

// filter: mantém só os itens que passam no teste
const caros = produtos.filter((p) => p.preco > 100);
// [{ nome: "Teclado", ... }, { nome: "Monitor", ... }]

// reduce: combina tudo em um único valor (soma, aqui)
const total = produtos.reduce((soma, p) => soma + p.preco, 0);
// 1130

// Encadeando os três — muito comum na prática
const nomesDosCaros = produtos
  .filter((p) => p.preco > 100)
  .map((p) => p.nome);
// ["Teclado", "Monitor"]

// Outros métodos úteis de array
numeros.find((n) => n > 3);          // 4 — primeiro item que satisfaz a condição
numeros.some((n) => n > 4);           // true — pelo menos um satisfaz
numeros.every((n) => n > 0);          // true — todos satisfazem
[...numeros].sort((a, b) => b - a);    // ordena decrescente (spread evita mutar o original)
numeros.forEach((n) => console.log(n)); // roda algo para cada item, sem retornar array novo
```

## Exercício 1: Calcule o total do carrinho

Dado `carrinho = [{ nome: "Livro", preco: 40, quantidade: 2 }, { nome: "Caneta", preco: 5,
quantidade: 3 }]`, use `reduce` para calcular o valor total (preço × quantidade de cada item,
somado).

### Solução

```javascript
const carrinho = [
  { nome: "Livro", preco: 40, quantidade: 2 },
  { nome: "Caneta", preco: 5, quantidade: 3 },
];

const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
console.log(total); // 95
```

O segundo argumento de `reduce` (`0`) é o valor inicial do acumulador. A cada item, a função soma
`item.preco * item.quantidade` ao acumulador acumulado até então, resultando no total geral ao
final do array.

## Exercício 2: Filtre e transforme nomes

Dada `pessoas = [{ nome: "ana", idade: 17 }, { nome: "bia", idade: 22 }, { nome: "caio", idade: 15 }]`,
retorne uma lista apenas com os nomes (capitalizados) das pessoas maiores de idade (18+).

### Solução

```javascript
const pessoas = [
  { nome: "ana", idade: 17 },
  { nome: "bia", idade: 22 },
  { nome: "caio", idade: 15 },
];

function capitalizar(texto) {
  return texto[0].toUpperCase() + texto.slice(1);
}

const maioresDeIdade = pessoas
  .filter((p) => p.idade >= 18)
  .map((p) => capitalizar(p.nome));

console.log(maioresDeIdade); // ["Bia"]
```

Encadear `filter` antes de `map` é um padrão muito comum: primeiro reduz a lista aos itens
relevantes, depois transforma só o que sobrou — evita transformar dados que nem vão ser usados no
resultado final.

## Quiz

### 1. Qual a diferença entre `map` e `filter`?

- [ ] São a mesma coisa, apenas nomes diferentes
- [x] `map` transforma cada item (mesmo tamanho); `filter` seleciona alguns itens (tamanho igual ou menor)
- [ ] `filter` sempre retorna um número
- [ ] `map` só funciona com arrays de números

> `map` aplica uma função a cada elemento e retorna um novo array com o MESMO número de itens
> (transformados). `filter` testa cada elemento com uma condição booleana e retorna um novo array
> só com os itens que passaram no teste — pode ter menos itens que o original.

### 2. O que o segundo argumento de `reduce` representa?

```javascript
numeros.reduce((acc, n) => acc + n, 0);
```

- [ ] O índice do array onde a redução termina
- [x] O valor inicial do acumulador
- [ ] O tamanho máximo do array resultante
- [ ] É opcional e nunca influencia o resultado

> O segundo argumento de `reduce` é o valor inicial do acumulador (`acc`), usado na primeira
> iteração. Sem ele, `reduce` usaria o primeiro elemento do array como valor inicial — o que pode
> causar erros em arrays vazios.

### 3. Os métodos `map`, `filter` e `reduce` modificam o array original?

- [ ] Sim, sempre modificam o array original
- [x] Não, todos retornam um array (ou valor) novo, sem alterar o original
- [ ] Apenas `map` modifica o original
- [ ] Depende do navegador usado

> `map`, `filter` e `reduce` são métodos "puros": eles sempre retornam um resultado novo, sem
> efeitos colaterais sobre o array original. Isso é diferente de métodos como `push`, `sort` ou
> `splice`, que modificam o array in place.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Arrays e métodos (map/filter/reduce)" na trilha de JavaScript/TypeScript do
> CodePath. Contexto: o capítulo explica map, filter, reduce e como encadeá-los. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
