---
numero: 18
titulo: "Interfaces"
nivel: "avancado"
objetivo: "Descrever a forma de objetos com interfaces em TypeScript."
duracao: 12
status: "completo"
---

## Conceito

Uma `interface` descreve a **forma** que um objeto deve ter: quais propriedades existem e de qual
tipo. É como um "contrato" — qualquer objeto que tenha essas propriedades com esses tipos é aceito
onde a interface é exigida, mesmo sem declarar explicitamente que "implementa" aquela interface
(esse comportamento é chamado de *structural typing*, ou "tipagem por forma").

## Sintaxe

```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

function apresentar(pessoa: Pessoa): string {
  return `Oi, eu sou ${pessoa.nome} e tenho ${pessoa.idade} anos`;
}

apresentar({ nome: "Ana", idade: 28 }); // ok — o objeto "bate" com a forma de Pessoa
```

## Exemplos comentados

```typescript
interface Produto {
  nome: string;
  preco: number;
  descricao?: string;      // ? marca a propriedade como OPCIONAL
  readonly id: number;      // readonly impede reatribuir depois de criado
}

const produto: Produto = {
  id: 1,
  nome: "Mouse",
  preco: 80,
  // descricao é opcional, pode ser omitida
};

// produto.id = 2; // erro: Cannot assign to 'id' because it is a read-only property

// Interfaces podem descrever também métodos
interface Repositorio {
  buscarPorId(id: number): Produto | undefined;
  salvar(produto: Produto): void;
}

// Extensão de interfaces (herança entre interfaces)
interface ProdutoDigital extends Produto {
  tamanhoEmMb: number;
}

const ebook: ProdutoDigital = {
  id: 2,
  nome: "E-book",
  preco: 29.9,
  tamanhoEmMb: 5,
};

// "type" é uma alternativa a "interface" para casos mais simples (união de tipos, por exemplo)
type Status = "pendente" | "aprovado" | "rejeitado";

// Structural typing: qualquer objeto com a forma certa é aceito,
// mesmo sem declarar explicitamente que implementa Pessoa
interface Pessoa {
  nome: string;
}
function saudar(p: Pessoa) {
  console.log(`Olá, ${p.nome}`);
}
saudar({ nome: "Carlos", idade: 40 }); // ok! ter propriedades A MAIS não é problema
```

## Exercício 1: Descreva um objeto com interface

Escreva uma interface `Tarefa` com `titulo` (string), `concluida` (boolean) e `prioridade`
(opcional, `"baixa" | "media" | "alta"`). Depois, crie um objeto que satisfaça essa interface, sem
informar `prioridade`.

### Solução

```typescript
interface Tarefa {
  titulo: string;
  concluida: boolean;
  prioridade?: "baixa" | "media" | "alta";
}

const tarefa: Tarefa = {
  titulo: "Estudar TypeScript",
  concluida: false,
  // prioridade omitida, pois é opcional
};

console.log(tarefa);
```

O `?` depois de `prioridade` indica que essa propriedade não é obrigatória — objetos que satisfazem
`Tarefa` podem omiti-la completamente, sem erro de compilação.

## Exercício 2: Função que recebe uma interface

Escreva uma função `formatarTarefa(tarefa: Tarefa)` que retorna uma string no formato
`"[x] Titulo"` se concluída, ou `"[ ] Titulo"` se não, usando a interface `Tarefa` do exercício
anterior.

### Solução

```typescript
function formatarTarefa(tarefa: Tarefa): string {
  const marcador = tarefa.concluida ? "[x]" : "[ ]";
  return `${marcador} ${tarefa.titulo}`;
}

console.log(formatarTarefa({ titulo: "Estudar TypeScript", concluida: false }));
// "[ ] Estudar TypeScript"
console.log(formatarTarefa({ titulo: "Aprender interfaces", concluida: true }));
// "[x] Aprender interfaces"
```

A função aceita qualquer objeto cuja forma "bate" com `Tarefa` — não precisa ser criado com nenhuma
sintaxe especial de classe, basta ter as propriedades certas com os tipos certos.

## Quiz

### 1. O que uma `interface` descreve em TypeScript?

- [ ] O comportamento em tempo de execução de uma função
- [x] A forma esperada de um objeto: quais propriedades ele tem e de que tipo
- [ ] Apenas classes, nunca objetos literais
- [ ] O valor exato que uma variável deve ter

> Uma interface é um contrato estrutural: define quais propriedades (e métodos) um objeto precisa
> ter, e de que tipos, sem se importar com "como" o objeto foi criado.

### 2. O que o `?` depois do nome de uma propriedade em uma interface indica?

- [ ] Que a propriedade é obrigatória
- [x] Que a propriedade é opcional — pode estar presente ou ausente no objeto
- [ ] Que a propriedade só aceita valores booleanos
- [ ] Que houve um erro de sintaxe

> `propriedade?: tipo` marca a propriedade como opcional. Objetos que satisfazem a interface podem
> incluir essa propriedade ou omiti-la completamente, sem gerar erro de compilação.

### 3. O que é "structural typing" (tipagem por forma / estrutural)?

- [ ] A obrigação de declarar explicitamente `implements NomeDaInterface`
- [x] Um objeto satisfaz uma interface apenas por ter as propriedades certas, sem precisar declarar isso explicitamente
- [ ] Um recurso exclusivo de arrays
- [ ] Uma limitação do TypeScript que será removida em versões futuras

> Diferente de linguagens com tipagem nominal (onde é preciso declarar `class X implements Y`),
> TypeScript usa tipagem estrutural: se um objeto tem todas as propriedades exigidas pela
> interface, com os tipos corretos, ele é aceito onde essa interface é esperada — não importa como
> foi criado.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Interfaces" na trilha de JavaScript/TypeScript do CodePath. Contexto: o
> capítulo explica interfaces, propriedades opcionais/readonly, extends entre interfaces e
> structural typing. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
