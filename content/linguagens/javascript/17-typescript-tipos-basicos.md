---
numero: 17
titulo: "TypeScript: tipos básicos"
nivel: "avancado"
objetivo: "Adicionar tipos estáticos básicos a código JavaScript com TypeScript."
duracao: 12
status: "completo"
---

## Conceito

TypeScript é um superset de JavaScript que adiciona **tipagem estática opcional**: você anota os
tipos esperados de variáveis, parâmetros e retornos, e o compilador do TypeScript verifica essas
anotações **antes** do código rodar, pegando erros que só apareceriam em tempo de execução em
JavaScript puro. No final, TypeScript é "compilado" (transpilado) para JavaScript comum.

## Sintaxe

```typescript
let idade: number = 28;
let nome: string = "Ana";
let ativo: boolean = true;

function somar(a: number, b: number): number {
  return a + b;
}

// Erro detectado em tempo de compilação, antes mesmo de rodar:
// somar("2", 3); // Argument of type 'string' is not assignable to parameter of type 'number'
```

## Exemplos comentados

```typescript
// Arrays tipados
let numeros: number[] = [1, 2, 3];
let nomes: Array<string> = ["Ana", "Bia"]; // sintaxe alternativa, mesmo efeito

// Tuplas: array de tamanho e tipos fixos por posição
let coordenada: [number, number] = [10, 20];

// any: desativa a checagem de tipo (evitar, é uma "escotilha de fuga")
let qualquerCoisa: any = "texto";
qualquerCoisa = 42; // permitido, mas perde toda a segurança de tipo

// unknown: mais seguro que any — exige checagem antes de usar
let valorDesconhecido: unknown = "texto";
// valorDesconhecido.toUpperCase(); // erro: precisa verificar o tipo primeiro
if (typeof valorDesconhecido === "string") {
  valorDesconhecido.toUpperCase(); // ok, TypeScript já sabe que é string aqui
}

// União de tipos: aceita mais de um tipo possível
let id: number | string;
id = 42;
id = "abc"; // ambos válidos

// Tipos literais: restringe a valores específicos
let status: "pendente" | "aprovado" | "rejeitado";
status = "aprovado";   // ok
// status = "cancelado"; // erro: não está entre os valores permitidos

// void: função que não retorna nada útil
function logar(mensagem: string): void {
  console.log(mensagem);
}

// Inferência de tipo: TypeScript costuma "adivinhar" o tipo sem anotação explícita
let contador = 0; // inferido como number, sem precisar escrever ": number"
```

## Exercício 1: Tipe uma função

Escreva a assinatura tipada de uma função `calcularMedia` que recebe um array de `number` e retorna
um `number`.

### Solução

```typescript
function calcularMedia(numeros: number[]): number {
  const soma = numeros.reduce((total, n) => total + n, 0);
  return soma / numeros.length;
}

console.log(calcularMedia([4, 8, 15])); // 9
```

`numeros: number[]` garante que a função só aceita um array de números como argumento — tentar
chamar `calcularMedia(["4", "8"])` seria pego como erro pelo compilador antes mesmo do código
rodar, diferente de JavaScript puro, onde o erro só apareceria (ou nem apareceria!) durante a
execução.

## Exercício 2: Use união de tipos

Escreva uma função `formatarId(id)` que aceita um `id` do tipo `number | string`, e retorna sempre
uma `string` (convertendo com `String()` se for número).

### Solução

```typescript
function formatarId(id: number | string): string {
  if (typeof id === "number") {
    return String(id);
  }
  return id;
}

console.log(formatarId(42));      // "42"
console.log(formatarId("abc"));   // "abc"
```

Dentro da função, checar `typeof id === "number"` faz o TypeScript "estreitar" (narrow) o tipo de
`id` para `number` apenas naquele bloco `if` — esse mecanismo é o assunto do próprio capítulo de
Narrowing, mais adiante nesta trilha.

## Quiz

### 1. Qual o principal benefício de adicionar tipos com TypeScript?

- [ ] O código roda mais rápido no navegador
- [x] Erros de tipo são detectados durante a escrita/compilação do código, antes de rodar
- [ ] TypeScript substitui completamente a necessidade de testes
- [ ] Tipos são obrigatórios em toda variável, sem exceção

> TypeScript verifica a compatibilidade de tipos em tempo de compilação (antes da execução),
> capturando erros como passar uma `string` onde se espera um `number` muito antes de esse código
> chegar à produção — algo que em JavaScript puro só seria descoberto rodando o código.

### 2. Qual a diferença entre os tipos `any` e `unknown`?

- [ ] São idênticos, apenas nomes diferentes
- [x] `any` desativa toda checagem de tipo; `unknown` exige verificar o tipo antes de usar o valor
- [ ] `unknown` só pode ser usado com números
- [ ] `any` é mais seguro que `unknown`

> `any` é uma "escotilha de fuga" que desliga completamente a checagem de tipos para aquele valor,
> perdendo a segurança que o TypeScript oferece. `unknown` também aceita qualquer valor, mas exige
> que você comprove o tipo real (por exemplo, com `typeof`) antes de operar sobre ele.

### 3. O que `let status: "pendente" | "aprovado" | "rejeitado";` representa?

- [ ] Uma variável que pode ser qualquer string
- [x] Um tipo literal união: `status` só pode valer exatamente uma dessas três strings específicas
- [ ] Um erro de sintaxe
- [ ] Um array com essas três strings

> Tipos literais restringem uma variável a um conjunto específico de valores possíveis (aqui, três
> strings exatas), em vez de aceitar qualquer `string`. É muito usado para representar estados
> finitos, como status de um pedido.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "TypeScript: tipos básicos" na trilha de JavaScript/TypeScript do CodePath.
> Contexto: o capítulo explica anotações de tipo, any vs. unknown, união de tipos e tipos literais.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
