---
numero: 16
titulo: "this"
nivel: "avancado"
objetivo: "Entender como o valor de this é determinado em diferentes contextos."
duracao: 15
status: "completo"
---

## Conceito

`this` é uma palavra-chave especial cujo valor depende de **como** uma função é chamada, não de
onde ela foi definida (com exceção das arrow functions). Esse comportamento é uma das fontes mais
comuns de confusão em JavaScript, especialmente para quem vem de linguagens onde `this`/`self`
funciona de forma mais previsível.

## Sintaxe

```javascript
const objeto = {
  nome: "Ana",
  saudacao() {
    return `Olá, ${this.nome}`; // this se refere a "objeto", porque foi chamado como objeto.saudacao()
  },
};

objeto.saudacao(); // "Olá, Ana"

const funcaoSolta = objeto.saudacao;
// funcaoSolta(); // "Olá, undefined" — this perdeu a referência a "objeto"!
```

## Exemplos comentados

```javascript
// Regra geral: this é definido por COMO a função é chamada, não onde foi escrita
const usuario = {
  nome: "Bia",
  metodoNormal: function () {
    console.log(this.nome); // "Bia" — chamado como usuario.metodoNormal()
  },
  metodoArrow: () => {
    console.log(this.nome); // undefined — arrow functions NÃO têm this próprio,
                              // usam o this do escopo onde foram DEFINIDAS (aqui, o módulo/global)
  },
};

usuario.metodoNormal();
usuario.metodoArrow();

// Em um event listener, "this" normalmente é o elemento que recebeu o evento
// botao.addEventListener("click", function () {
//   console.log(this); // o próprio botão
// });

// Mas com arrow function, "this" seria herdado do escopo externo, não o botão:
// botao.addEventListener("click", () => {
//   console.log(this); // NÃO é o botão
// });

// call, apply e bind controlam explicitamente o valor de this
function apresentar() {
  return `Sou ${this.nome}`;
}
const pessoa1 = { nome: "Carlos" };
apresentar.call(pessoa1);   // "Sou Carlos" — chama a função com this = pessoa1
apresentar.apply(pessoa1);  // igual ao call, mas argumentos vêm como array

const apresentarCarlos = apresentar.bind(pessoa1); // cria uma NOVA função com this fixado
apresentarCarlos(); // "Sou Carlos", sempre — mesmo se chamada solta depois

// Dentro de uma classe, métodos normais também dependem de como são chamados
class Botao {
  constructor(texto) {
    this.texto = texto;
  }
  // arrow function como campo de classe "fixa" o this na instância — muito usado em callbacks
  aoClicar = () => {
    console.log(`Cliquei em ${this.texto}`);
  };
}
```

## Exercício 1: Corrija a perda de contexto

O código abaixo imprime `undefined` em vez do nome esperado. Explique por quê e conserte usando
`bind`.

```javascript
const contador = {
  valor: 0,
  incrementar: function () {
    this.valor += 1;
    console.log(this.valor);
  },
};

const funcaoSolta = contador.incrementar;
setTimeout(funcaoSolta, 100); // esperado: 1, mas dá erro
```

### Solução

```javascript
const contador = {
  valor: 0,
  incrementar: function () {
    this.valor += 1;
    console.log(this.valor);
  },
};

const funcaoFixada = contador.incrementar.bind(contador);
setTimeout(funcaoFixada, 100); // 1
```

Quando `contador.incrementar` é atribuída a `funcaoSolta` e passada para `setTimeout`, ela é
chamada depois como uma função "solta" — sem o objeto `contador` antes do ponto — então `this`
dentro dela deixa de ser `contador`. `.bind(contador)` cria uma nova função onde `this` está
permanentemente fixado em `contador`, não importa como ela seja chamada depois.

## Exercício 2: Explique a diferença de comportamento

Sem rodar o código, diga o que cada `console.log` imprime e explique a diferença:

```javascript
const objeto = {
  nome: "Duda",
  metodo1: function () {
    return this.nome;
  },
  metodo2: () => {
    return this.nome;
  },
};

console.log(objeto.metodo1());
console.log(objeto.metodo2());
```

### Solução

```javascript
console.log(objeto.metodo1()); // "Duda"
console.log(objeto.metodo2()); // undefined
```

`metodo1` é uma função tradicional: ao ser chamada como `objeto.metodo1()`, `this` dentro dela é
`objeto`, então `this.nome` é `"Duda"`. `metodo2` é uma arrow function: ela nunca tem seu próprio
`this` — usa o `this` do escopo onde foi definida (nesse caso, fora de qualquer objeto), que não
tem uma propriedade `nome`, resultando em `undefined`.

## Quiz

### 1. O que determina o valor de `this` dentro de uma função tradicional?

- [ ] O local onde a função foi definida no código
- [x] Como a função é chamada (por exemplo, `objeto.metodo()` faz `this` ser `objeto`)
- [ ] `this` é sempre o objeto `window` ou `global`
- [ ] `this` nunca muda depois que a função é criada

> Em funções tradicionais, `this` é determinado dinamicamente pela forma de chamada: chamar como
> `objeto.metodo()` faz `this` valer `objeto`; chamar a mesma função "solta" (sem o objeto antes do
> ponto) faz `this` ser `undefined` (em modo estrito) ou o objeto global.

### 2. Por que arrow functions são diferentes quanto a `this`?

- [ ] Arrow functions não podem usar `this` de forma alguma
- [x] Arrow functions não têm `this` próprio: usam o `this` do escopo léxico onde foram definidas
- [ ] Arrow functions sempre têm `this` igual a `undefined`
- [ ] Não há diferença nenhuma entre arrow functions e funções tradicionais quanto a `this`

> Diferente de funções tradicionais, arrow functions não criam seu próprio `this` — elas "herdam"
> o `this` do escopo onde foram escritas no código (escopo léxico), o que as torna muito úteis
> dentro de callbacks quando você quer manter o `this` do contexto externo.

### 3. Para que serve `funcao.bind(objeto)`?

- [ ] Chama a função imediatamente com `this = objeto`
- [x] Retorna uma nova função onde `this` está permanentemente fixado em `objeto`, para chamar depois
- [ ] Remove a função da memória
- [ ] Só funciona dentro de classes

> `bind()` não chama a função — ela retorna uma nova função "travada" com o valor de `this`
> especificado, não importa como essa nova função venha a ser chamada depois. É diferente de
> `call()`/`apply()`, que já executam a função imediatamente com o `this` fornecido.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "this" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica como this depende da forma de chamada, a diferença para arrow functions, e call/apply/
> bind. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
