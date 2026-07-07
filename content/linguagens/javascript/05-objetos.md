---
numero: 5
titulo: "Objetos"
nivel: "basico"
objetivo: "Criar e manipular objetos, a estrutura central de dados em JS."
duracao: 12
status: "completo"
---

## Conceito

Um objeto guarda dados como pares **chave → valor** (parecido com um dicionário de Python). É a
estrutura de dados mais fundamental de JavaScript — até arrays e funções são, internamente, tipos
especiais de objeto. Chaves de objeto são strings (ou `Symbol`), mas normalmente escritas sem
aspas quando são identificadores válidos.

## Sintaxe

```javascript
const pessoa = {
  nome: "Ana",
  idade: 28,
};

pessoa.nome;         // "Ana" — acesso com ponto
pessoa["idade"];      // 28 — acesso com colchetes (útil quando a chave é dinâmica)
pessoa.cidade = "Recife";  // adiciona uma propriedade nova
delete pessoa.idade;   // remove uma propriedade
```

## Exemplos comentados

```javascript
const usuario = { nome: "Bia", idade: 25 };

// Object.keys / values / entries
Object.keys(usuario);     // ["nome", "idade"]
Object.values(usuario);   // ["Bia", 25]
Object.entries(usuario);  // [["nome", "Bia"], ["idade", 25]]

// Percorrendo um objeto
for (const chave in usuario) {
  console.log(chave, usuario[chave]);
}

for (const [chave, valor] of Object.entries(usuario)) {
  console.log(chave, valor);
}

// Spread (...) cria uma cópia rasa, útil para "atualizar" sem mutar o original
const usuarioAtualizado = { ...usuario, idade: 26 };
// { nome: "Bia", idade: 26 } — usuario original continua com idade: 25

// Object shorthand: quando o nome da chave é igual ao da variável
const nome = "Carlos";
const idade = 30;
const pessoa2 = { nome, idade }; // equivalente a { nome: nome, idade: idade }

// Métodos dentro de objetos
const calculadora = {
  valor: 0,
  somar(n) {
    this.valor += n;
    return this;
  },
};
calculadora.somar(5).somar(3);
console.log(calculadora.valor); // 8

// Verificar se uma chave existe
"nome" in usuario;             // true
usuario.hasOwnProperty("nome"); // true
usuario.telefone;                // undefined (chave que não existe, sem erro)
```

## Exercício 1: Atualize sem mutar

Dado `produto = { nome: "Mouse", preco: 80, estoque: 10 }`, crie um NOVO objeto
`produtoAtualizado` com o mesmo conteúdo, mas com `preco: 72` (sem alterar o objeto original).

### Solução

```javascript
const produto = { nome: "Mouse", preco: 80, estoque: 10 };

const produtoAtualizado = { ...produto, preco: 72 };

console.log(produto);            // { nome: "Mouse", preco: 80, estoque: 10 } (inalterado)
console.log(produtoAtualizado);  // { nome: "Mouse", preco: 72, estoque: 10 }
```

O operador spread `...produto` copia todas as propriedades do objeto original para um novo objeto
literal; qualquer propriedade declarada depois (`preco: 72`) sobrescreve a copiada. Esse padrão é a
forma idiomática de "atualizar imutavelmente" um objeto em JavaScript.

## Exercício 2: Conte propriedades de um tipo

Escreva uma função `contarPorTipo(objeto)` que recebe um objeto e retorna quantas de suas
propriedades têm valor do tipo `"number"`.

### Solução

```javascript
function contarPorTipo(objeto) {
  return Object.values(objeto).filter((valor) => typeof valor === "number").length;
}

const dados = { nome: "Ana", idade: 28, ativo: true, nota: 9.5 };
console.log(contarPorTipo(dados)); // 2 (idade e nota)
```

`Object.values()` extrai apenas os valores do objeto (ignorando as chaves), o que permite reusar
diretamente os métodos de array (`filter`, aqui) sobre eles, em vez de escrever um loop manual com
`for...in`.

## Quiz

### 1. Qual a diferença entre acessar `objeto.chave` e `objeto["chave"]`?

- [ ] `objeto["chave"]` não existe em JavaScript
- [x] Ambos acessam a mesma propriedade; colchetes permitem usar uma chave dinâmica (variável)
- [ ] `objeto.chave` só funciona com números
- [ ] `objeto["chave"]` é mais rápido sempre

> As duas formas acessam a mesma propriedade. A notação com colchetes é necessária quando o nome
> da chave vem de uma variável (`objeto[variavel]`) ou contém caracteres que não formam um
> identificador válido (como espaços).

### 2. O que o operador spread (`...`) faz em `{ ...objeto, chave: novoValor }`?

- [ ] Modifica o objeto original diretamente
- [x] Copia todas as propriedades de `objeto` para um novo objeto, permitindo sobrescrever algumas
- [ ] Remove todas as propriedades do objeto
- [ ] Só funciona com arrays, não com objetos

> `...objeto` "espalha" todas as propriedades do objeto original dentro do novo objeto literal.
> Propriedades declaradas depois no literal (como `chave: novoValor`) sobrescrevem as copiadas,
> criando uma cópia atualizada sem mutar o original.

### 3. O que `Object.entries(objeto)` retorna?

- [ ] Apenas as chaves do objeto
- [ ] Apenas os valores do objeto
- [x] Um array de pares `[chave, valor]`
- [ ] O número de propriedades do objeto

> `Object.entries()` transforma o objeto em um array de arrays de dois elementos cada — `[chave,
> valor]` — muito usado para percorrer objetos com `for...of` de forma similar a `.items()` em
> dicionários Python.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Objetos" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica criação e acesso a objetos, Object.keys/values/entries e o operador spread. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
