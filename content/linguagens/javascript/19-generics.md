---
numero: 19
titulo: "Generics"
nivel: "avancado"
objetivo: "Escrever código reutilizável e type-safe com generics."
duracao: 15
status: "completo"
---

## Conceito

Generics permitem escrever funções, interfaces e classes que funcionam com **qualquer tipo**, sem
perder a segurança de tipo — em vez de usar `any` (que desliga a checagem), um generic captura o
tipo real usado em cada chamada e o "propaga" para o restante da assinatura. É como um parâmetro,
mas para tipos em vez de valores.

## Sintaxe

```typescript
function primeiro<T>(lista: T[]): T {
  return lista[0];
}

primeiro([1, 2, 3]);        // T é inferido como number; retorna number
primeiro(["a", "b", "c"]);   // T é inferido como string; retorna string

// T é só um nome convencional (poderia ser qualquer identificador)
```

## Exemplos comentados

```typescript
// Sem generics, você perderia informação de tipo (teria que usar any)
function primeiroSemGenerics(lista: any[]): any {
  return lista[0];
}
const resultado = primeiroSemGenerics([1, 2, 3]); // tipo: any (perdeu que era number!)

// Com generics, o tipo de retorno é preciso, mesmo sem anotar manualmente
function primeiroComGenerics<T>(lista: T[]): T {
  return lista[0];
}
const numero = primeiroComGenerics([1, 2, 3]); // tipo: number, inferido automaticamente

// Generics com múltiplos parâmetros de tipo
function combinar<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
combinar("id", 42); // tipo: [string, number]

// Interfaces genéricas
interface CaixaDeValor<T> {
  valor: T;
}
const caixaDeNumero: CaixaDeValor<number> = { valor: 42 };
const caixaDeTexto: CaixaDeValor<string> = { valor: "olá" };

// Restringindo o tipo genérico com "extends" (aceita só tipos com certa forma)
interface TemId {
  id: number;
}
function buscarPorId<T extends TemId>(lista: T[], id: number): T | undefined {
  return lista.find((item) => item.id === id);
}
buscarPorId([{ id: 1, nome: "Ana" }], 1); // ok, o objeto tem "id"
// buscarPorId([{ nome: "Ana" }], 1); // erro: falta a propriedade "id"

// Generics em classes
class Pilha<T> {
  private itens: T[] = [];

  empilhar(item: T): void {
    this.itens.push(item);
  }

  desempilhar(): T | undefined {
    return this.itens.pop();
  }
}
const pilhaDeNumeros = new Pilha<number>();
pilhaDeNumeros.empilhar(1);
pilhaDeNumeros.empilhar(2);
```

## Exercício 1: Escreva uma função genérica de último item

Escreva uma função genérica `ultimo<T>(lista: T[]): T | undefined` que retorna o último elemento de
um array de qualquer tipo (ou `undefined` se a lista estiver vazia).

### Solução

```typescript
function ultimo<T>(lista: T[]): T | undefined {
  return lista[lista.length - 1];
}

console.log(ultimo([1, 2, 3]));         // 3 (tipo: number | undefined)
console.log(ultimo(["a", "b", "c"]));    // "c" (tipo: string | undefined)
console.log(ultimo([]));                  // undefined
```

O tipo `T` é capturado a partir do array recebido em cada chamada — a função funciona igualmente
bem para `number[]`, `string[]` ou qualquer outro tipo de array, sem precisar duplicar código nem
usar `any`.

## Exercício 2: Crie uma interface genérica de resposta de API

Escreva uma interface genérica `RespostaApi<T>` com duas propriedades: `sucesso` (boolean) e
`dados` (do tipo `T`). Depois, use-a para tipar uma resposta que contém um array de `string`.

### Solução

```typescript
interface RespostaApi<T> {
  sucesso: boolean;
  dados: T;
}

const resposta: RespostaApi<string[]> = {
  sucesso: true,
  dados: ["item1", "item2"],
};

console.log(resposta.dados); // ["item1", "item2"], tipado como string[]
```

`RespostaApi<T>` pode representar a resposta de QUALQUER endpoint da API — quando usada como
`RespostaApi<string[]>`, o TypeScript sabe que `dados` é um array de strings; se fosse
`RespostaApi<Produto>`, `dados` seria tipado como `Produto`. É a mesma interface reaproveitada para
formas diferentes de dados, sem duplicar código nem perder a checagem de tipo.

## Quiz

### 1. Qual o principal problema de usar `any` em vez de generics?

- [ ] `any` não é permitido em TypeScript
- [x] `any` desliga a checagem de tipo, perdendo a informação sobre qual tipo realmente está sendo usado
- [ ] `any` só funciona com números
- [ ] Não há diferença prática entre `any` e generics

> `any` aceita qualquer coisa mas também "esquece" o tipo original — o TypeScript não consegue mais
> ajudar com autocompletar ou detectar erros relacionados àquele valor. Generics preservam a
> informação de tipo real usada em cada chamada específica.

### 2. O que `<T extends TemId>` significa em uma função genérica?

- [ ] `T` só pode ser exatamente o tipo `TemId`
- [x] `T` pode ser qualquer tipo, desde que tenha (pelo menos) as propriedades exigidas por `TemId`
- [ ] É um erro de sintaxe
- [ ] `T` é ignorado quando há um `extends`

> `extends` em um generic é uma restrição (constraint): garante que o tipo usado no lugar de `T`
> tenha, no mínimo, a forma especificada — permitindo acessar com segurança as propriedades dessa
> forma (como `item.id`) dentro da função.

### 3. Por que `Pilha<T>` (uma classe genérica) é mais reutilizável que uma `PilhaDeNumeros` específica?

- [ ] Não é mais reutilizável, ambas fazem exatamente a mesma coisa
- [x] A mesma implementação de `Pilha<T>` funciona para qualquer tipo de item, mantendo a segurança de tipo em cada uso
- [ ] `Pilha<T>` só funciona com números, apesar do nome genérico
- [ ] Classes genéricas são mais lentas em tempo de execução

> Uma única implementação de `Pilha<T>` serve para `Pilha<number>`, `Pilha<string>`,
> `Pilha<Produto>`, etc. — sem precisar reescrever a lógica de empilhar/desempilhar para cada tipo,
> e ainda assim cada instância mantém a checagem de tipo específica daquele uso.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Generics" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica funções/interfaces/classes genéricas, e restrições com extends. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
