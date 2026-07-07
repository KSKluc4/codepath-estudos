---
numero: 1
titulo: "Variáveis (let/const)"
nivel: "basico"
objetivo: "Declarar variáveis com let e const e entender escopo de bloco."
duracao: 10
status: "completo"
---

## Conceito

JavaScript moderno declara variáveis com `let` (valor que pode mudar) e `const` (valor que não
pode ser reatribuído). Ambos têm **escopo de bloco**: só existem dentro do `{ }` onde foram
declarados. Isso é diferente do antigo `var`, que tem escopo de função e causa bugs sutis — hoje em
dia, `var` é considerado legado e deve ser evitado em código novo.

## Sintaxe

```javascript
let idade = 28;
idade = 29; // ok, let pode ser reatribuído

const nome = "Ana";
// nome = "Bia"; // TypeError: Assignment to constant variable.

{
  let x = 10;
  console.log(x); // 10
}
// console.log(x); // ReferenceError: x is not defined (fora do bloco)
```

## Exemplos comentados

```javascript
// const não torna o VALOR imutável, só impede reatribuir a variável
const usuario = { nome: "Ana" };
usuario.nome = "Bia"; // permitido! está mudando uma propriedade, não reatribuindo "usuario"
// usuario = {}; // isso sim seria erro

// Escopo de bloco: cada iteração do for tem seu próprio "i" com let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // imprime 0, 1, 2 (cada closure "vê" seu próprio i)
}

// Com var, todas as funções compartilhariam o MESMO "i" (imprimiria 3, 3, 3)
// var já é considerado uma prática ultrapassada por causa desse tipo de bug

// Convenção recomendada: use const por padrão, e só troque para let
// quando você sabe que a variável vai ser reatribuída
const PI = 3.14159;
let contador = 0;
contador += 1;
```

## Exercício 1: Identifique o erro

O código abaixo lança um erro. Explique por quê e conserte.

```javascript
const total = 100;
total = total + 50;
console.log(total);
```

### Solução

```javascript
let total = 100; // trocar const por let, já que o valor será reatribuído
total = total + 50;
console.log(total); // 150
```

`const` cria uma ligação (binding) que não pode ser reatribuída — tentar `total = ...` de novo
lança `TypeError: Assignment to constant variable.`. Como o código precisa mudar o valor de
`total`, a declaração correta é `let`.

## Exercício 2: Escopo de bloco

Sem rodar o código, diga o que cada `console.log` abaixo imprime.

```javascript
let mensagem = "fora";

if (true) {
  let mensagem = "dentro";
  console.log(mensagem);
}

console.log(mensagem);
```

### Solução

```javascript
let mensagem = "fora";

if (true) {
  let mensagem = "dentro";
  console.log(mensagem); // "dentro"
}

console.log(mensagem); // "fora"
```

O `let mensagem` dentro do bloco `if` cria uma variável **nova**, que só existe dentro daquele
bloco — ela "esconde" (shadowing) a variável externa de mesmo nome sem alterá-la. Fora do bloco, a
variável original continua com o valor `"fora"`.

## Quiz

### 1. Qual a principal diferença entre `let` e `const`?

- [ ] `let` só funciona com números, `const` com qualquer tipo
- [x] `const` não pode ser reatribuído; `let` pode
- [ ] `const` é mais rápido para o navegador processar
- [ ] Não há diferença nenhuma

> `let` permite reatribuir a variável a um novo valor. `const` cria uma ligação fixa: tentar
> reatribuir lança `TypeError`. Ambos têm o mesmo escopo de bloco.

### 2. Isso é permitido em JavaScript?

```javascript
const lista = [1, 2, 3];
lista.push(4);
```

- [ ] Não, `push` reatribui a variável e por isso lança erro
- [x] Sim, porque `push` modifica o array existente, sem reatribuir `lista`
- [ ] Só é permitido com `let`
- [ ] Só é permitido dentro de uma função

> `const` impede reatribuir a variável `lista` a um array totalmente novo, mas não impede
> modificar o conteúdo do array (ou objeto) que ela referencia. `push()` altera o array original in
> place.

### 3. Por que `var` é considerado uma prática ultrapassada em JavaScript moderno?

- [ ] Porque foi removido das versões recentes da linguagem
- [x] Porque tem escopo de função (não de bloco), o que causa bugs sutis em loops e condicionais
- [ ] Porque só funciona com números
- [ ] Porque é mais lento que `let`

> `var` "vaza" para fora de blocos `{}` como `if` e `for`, tendo escopo apenas de função (ou
> global). Isso causa comportamentos inesperados, como todas as iterações de um loop
> compartilharem a mesma variável. `let`/`const` corrigem isso com escopo de bloco real.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Variáveis (let/const)" na trilha de JavaScript/TypeScript do CodePath. Contexto:
> o capítulo explica let, const, escopo de bloco e por que var é evitado. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
