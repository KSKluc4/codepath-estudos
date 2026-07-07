---
numero: 7
titulo: "Destructuring"
nivel: "basico"
objetivo: "Extrair valores de arrays e objetos com desestruturação."
duracao: 10
status: "completo"
---

## Conceito

Destructuring (desestruturação) permite extrair valores de arrays ou propriedades de objetos e
atribuí-los diretamente a variáveis, em uma única expressão — em vez de acessar item por item
manualmente. É um dos recursos mais usados no JavaScript moderno, especialmente com parâmetros de
função e imports.

## Sintaxe

```javascript
// Destructuring de array (posição importa)
const coordenadas = [10, 20];
const [x, y] = coordenadas;  // x = 10, y = 20

// Destructuring de objeto (nome da chave importa, não a ordem)
const pessoa = { nome: "Ana", idade: 28 };
const { nome, idade } = pessoa;  // nome = "Ana", idade = 28
```

## Exemplos comentados

```javascript
// Renomear variáveis ao desestruturar objeto
const { nome: nomeCompleto } = { nome: "Bia" };
console.log(nomeCompleto); // "Bia"

// Valor padrão quando a propriedade não existe
const { telefone = "não informado" } = { nome: "Carlos" };
console.log(telefone); // "não informado"

// Ignorar itens de um array com vírgulas
const [primeiro, , terceiro] = [1, 2, 3];
console.log(primeiro, terceiro); // 1 3

// Rest no destructuring: captura "o resto" em um array/objeto novo
const [a, ...resto] = [1, 2, 3, 4];
console.log(a, resto); // 1 [2, 3, 4]

const { id, ...outrosCampos } = { id: 1, nome: "Ana", idade: 28 };
console.log(outrosCampos); // { nome: "Ana", idade: 28 }

// Destructuring aninhado
const usuario = { nome: "Duda", endereco: { cidade: "Recife" } };
const { endereco: { cidade } } = usuario;
console.log(cidade); // "Recife"

// Uso muito comum: desestruturar diretamente nos parâmetros de uma função
function apresentar({ nome, idade }) {
  return `${nome} tem ${idade} anos`;
}
apresentar({ nome: "Eva", idade: 25 }); // "Eva tem 25 anos"

// Troca de valores sem variável temporária (igual ao a, b = b, a do Python)
let m = 1, n = 2;
[m, n] = [n, m];  // m = 2, n = 1
```

## Exercício 1: Extraia coordenadas

Dado o array `ponto = [10, 25, 3]` (representando x, y, z), use destructuring para extrair os três
valores em variáveis `x`, `y` e `z`.

### Solução

```javascript
const ponto = [10, 25, 3];
const [x, y, z] = ponto;

console.log(x, y, z); // 10 25 3
```

Diferente do destructuring de objeto, no de array a **posição** de cada variável determina qual
elemento ela recebe — a primeira variável sempre pega o índice 0, a segunda o índice 1, e assim por
diante.

## Exercício 2: Função com parâmetro desestruturado e valor padrão

Escreva uma função `criarUsuario` que recebe um objeto com `nome`, `idade` e um campo opcional
`ativo` (padrão `true`), e retorna uma string no formato `"nome (idade anos) - ativo: true/false"`.

### Solução

```javascript
function criarUsuario({ nome, idade, ativo = true }) {
  return `${nome} (${idade} anos) - ativo: ${ativo}`;
}

console.log(criarUsuario({ nome: "Felipe", idade: 30 }));
// "Felipe (30 anos) - ativo: true"

console.log(criarUsuario({ nome: "Gabi", idade: 22, ativo: false }));
// "Gabi (22 anos) - ativo: false"
```

Combinar destructuring com valor padrão diretamente na assinatura da função é um padrão muito comum
em JavaScript: a função "declara" quais propriedades espera do objeto recebido, já com um valor de
fallback (`ativo = true`) caso a propriedade não seja passada.

## Quiz

### 1. No destructuring de array, o que determina qual valor cada variável recebe?

- [ ] O nome da variável
- [x] A posição da variável na desestruturação
- [ ] A ordem alfabética
- [ ] O tipo do valor

> Em `const [a, b] = array`, `a` sempre recebe o item no índice 0 e `b` o item no índice 1 — a
> posição na desestruturação corresponde à posição no array original.

### 2. O que `const { telefone = "N/A" } = objeto` faz se `objeto` não tiver a propriedade `telefone`?

- [ ] Lança um erro
- [x] `telefone` recebe o valor padrão `"N/A"`
- [ ] `telefone` fica `undefined`, ignorando o valor padrão
- [ ] Remove a propriedade `telefone` do objeto original

> Assim como parâmetros de função, o destructuring de objeto suporta valores padrão: se a
> propriedade não existir (ou for `undefined`) no objeto de origem, a variável recebe o valor
> padrão especificado após o `=`.

### 3. O que `const [a, ...resto] = [1, 2, 3, 4]` produz?

- [ ] `a = [1, 2, 3, 4]` e `resto` não existe
- [x] `a = 1` e `resto = [2, 3, 4]`
- [ ] `a = 4` e `resto = [1, 2, 3]`
- [ ] Um erro de sintaxe

> O rest element (`...resto`) em destructuring captura todos os elementos restantes (depois dos já
> nomeados individualmente) em um novo array. `a` recebe o primeiro item (`1`), e `resto` recebe
> tudo o que sobrou.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Destructuring" na trilha de JavaScript/TypeScript do CodePath. Contexto: o
> capítulo explica desestruturação de arrays e objetos, valores padrão e rest elements. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
