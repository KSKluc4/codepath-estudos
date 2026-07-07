---
numero: 3
titulo: "Strings e template literals"
nivel: "basico"
objetivo: "Manipular texto e interpolar valores com template literals."
duracao: 10
status: "completo"
---

## Conceito

Strings em JavaScript podem usar aspas simples `'`, duplas `"` ou **template literals** com crase
`` ` ``. Template literals são a forma moderna e recomendada: permitem interpolar variáveis
diretamente no texto com `${}` e escrever strings em múltiplas linhas sem caracteres de escape.

## Sintaxe

```javascript
const nome = "Ana";
const idade = 28;

// Concatenação tradicional (evitar em código novo)
"Olá, " + nome + "! Você tem " + idade + " anos.";

// Template literal — forma recomendada
`Olá, ${nome}! Você tem ${idade} anos.`;

// Múltiplas linhas sem precisar de \n
const texto = `Linha 1
Linha 2`;
```

## Exemplos comentados

```javascript
const preco = 49.9;

// Interpolação aceita qualquer expressão dentro de ${}, não só variáveis
`O preço com 10% de desconto é R$${(preco * 0.9).toFixed(2)}`;

const s = "  JavaScript  ";

s.trim();               // "JavaScript" — remove espaços das pontas
s.toUpperCase();          // "  JAVASCRIPT  "
s.toLowerCase();          // "  javascript  "
s.includes("Script");      // true
s.trim().length;            // 10

const frase = "aprender javascript é ótimo";
frase.split(" ");            // ["aprender", "javascript", "é", "ótimo"]
["a", "b", "c"].join("-");   // "a-b-c"

frase.slice(0, 8);          // "aprender" — fatiamento, igual em arrays
frase.replace("ótimo", "essencial");  // troca a primeira ocorrência
frase.replaceAll("a", "@");            // troca TODAS as ocorrências

// startsWith / endsWith
"CodePath".startsWith("Code");  // true
"CodePath".endsWith("Path");     // true
```

## Exercício 1: Monte um cartão de apresentação

Dadas as variáveis `nome = "Bia"`, `cargo = "Desenvolvedora"` e `anos = 3`, use um template literal
para montar a string
`"Bia é Desenvolvedora há 3 anos."`.

### Solução

```javascript
const nome = "Bia";
const cargo = "Desenvolvedora";
const anos = 3;

const apresentacao = `${nome} é ${cargo} há ${anos} anos.`;
console.log(apresentacao); // "Bia é Desenvolvedora há 3 anos."
```

Cada `${}` dentro da crase é substituído pelo valor da expressão correspondente — nesse caso,
simplesmente o valor de cada variável, sem precisar concatenar manualmente com `+`.

## Exercício 2: Normalize um nome de usuário

Escreva uma função `paraSlug(titulo)` que recebe uma string como `"  Aprenda JavaScript  "` e
retorna `"aprenda-javascript"`: sem espaços nas pontas, minúsculo e espaços internos trocados por
`-`.

### Solução

```javascript
function paraSlug(titulo) {
  return titulo.trim().toLowerCase().replaceAll(" ", "-");
}

console.log(paraSlug("  Aprenda JavaScript  ")); // "aprenda-javascript"
```

Assim como em Python, métodos de string em JavaScript podem ser encadeados porque cada um retorna
uma nova string: `trim()` remove os espaços das pontas, `toLowerCase()` normaliza para minúsculas,
e `replaceAll(" ", "-")` troca todos os espaços internos.

## Quiz

### 1. Qual a principal vantagem de um template literal sobre concatenação com `+`?

- [ ] Template literals são o único jeito de criar strings em JavaScript
- [x] Permitem interpolar variáveis/expressões diretamente com `${}`, de forma mais legível
- [ ] Template literals não podem conter números
- [ ] São mais rápidos de digitar, mas não têm outra vantagem

> Template literals eliminam a necessidade de quebrar a string em vários pedaços concatenados com
> `+`, permitindo escrever expressões diretamente dentro de `${}` no meio do texto — além de
> suportar múltiplas linhas sem `\n`.

### 2. Qual método troca TODAS as ocorrências de um trecho em uma string?

- [ ] `replace()`
- [x] `replaceAll()`
- [ ] `split()`
- [ ] `slice()`

> `replace()` substitui apenas a primeira ocorrência encontrada (a menos que se use uma regex
> global). `replaceAll()`, introduzido mais recentemente na linguagem, substitui todas as
> ocorrências de uma vez.

### 3. O que `${}` faz dentro de um template literal?

- [ ] Comenta a linha
- [x] Interpola (insere) o resultado de uma expressão JavaScript no texto
- [ ] Cria um novo array
- [ ] Só funciona com números inteiros

> Qualquer expressão JavaScript válida pode ser colocada dentro de `${}` em um template literal —
> variáveis, operações matemáticas, chamadas de função — e o resultado é convertido para texto e
> inserido naquele ponto da string.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Strings e template literals" na trilha de JavaScript/TypeScript do CodePath.
> Contexto: o capítulo explica métodos de string comuns e interpolação com template literals
> (`${}`). Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
