---
numero: 6
titulo: "Arrays e List<T>"
nivel: "basico"
objetivo: "Usar arrays de tamanho fixo e List<T> como coleção dinâmica."
duracao: 12
status: "completo"
---

## Conceito

C# tem arrays de tamanho fixo (como C/Java) e `List<T>`, uma coleção dinâmica genérica da
biblioteca padrão que cresce e encolhe conforme necessário — o equivalente a uma lista Python ou
um `ArrayList`/`std::vector`. `T` no nome `List<T>` é um parâmetro de tipo genérico: `List<int>`
guarda apenas `int`, `List<string>` apenas `string`, com checagem de tipo em tempo de compilação.

## Sintaxe

```csharp
int[] numeros = new int[5];             // array de 5 ints, tamanho FIXO
int[] notas = { 8, 7, 9 };                // array inicializado, tamanho inferido

List<int> lista = new List<int>();         // lista vazia, tamanho DINÂMICO
lista.Add(10);
lista.Add(20);
```

## Exemplos comentados

```csharp
// Arrays: tamanho fixo, definido na criação
int[] notas = { 8, 7, 9, 6, 10 };
Console.WriteLine(notas.Length);   // 5 — propriedade Length (não Count!)
Console.WriteLine(notas[0]);        // 8

foreach (int nota in notas) {
    Console.WriteLine(nota);
}

// List<T>: cresce e encolhe dinamicamente
List<string> nomes = new List<string> { "Ana", "Bia" };
nomes.Add("Carlos");           // adiciona ao final
nomes.Insert(1, "Duda");        // insere na posição 1
nomes.Remove("Bia");             // remove pelo VALOR
nomes.RemoveAt(0);                // remove pelo ÍNDICE
Console.WriteLine(nomes.Count);   // propriedade Count (não Length!)

// Percorrer com índice, quando necessário
for (int i = 0; i < nomes.Count; i++) {
    Console.WriteLine($"{i}: {nomes[i]}");
}

// Verificações comuns
bool existe = nomes.Contains("Carlos"); // true
int indice = nomes.IndexOf("Carlos");     // posição do item, ou -1 se não existir

// Ordenar
List<int> numeros = new List<int> { 5, 2, 8, 1 };
numeros.Sort();                    // ordena in place, crescente
numeros.Sort((a, b) => b - a);      // ordena decrescente, com comparador customizado

// Arrays multidimensionais e "jagged arrays" (arrays de arrays, tamanhos diferentes)
int[,] matriz = { { 1, 2 }, { 3, 4 } };     // matriz retangular fixa
int[][] jagged = new int[2][];               // jagged array: cada linha pode ter tamanho diferente
jagged[0] = new int[] { 1, 2, 3 };
jagged[1] = new int[] { 4, 5 };
```

## Exercício 1: Some os elementos de uma List

Dada `List<int> valores = new List<int> { 3, 7, 2, 9, 4 };`, escreva código que soma todos os
elementos usando um `foreach`.

### Solução

```csharp
List<int> valores = new List<int> { 3, 7, 2, 9, 4 };
int soma = 0;

foreach (int valor in valores) {
    soma += valor;
}

Console.WriteLine(soma); // 25
```

`foreach` percorre cada item de `valores` diretamente, acumulando em `soma` — o mesmo padrão
usado com arrays, já que `List<T>` também implementa a interface que permite ser percorrida com
`foreach`.

## Exercício 2: Remova duplicatas de uma lista

Escreva uma função `List<int> removerDuplicatas(List<int> lista)` que retorna uma nova lista sem
valores repetidos, preservando a ordem de primeira aparição.

### Solução

```csharp
List<int> removerDuplicatas(List<int> lista) {
    List<int> resultado = new List<int>();
    foreach (int item in lista) {
        if (!resultado.Contains(item)) {
            resultado.Add(item);
        }
    }
    return resultado;
}

List<int> comDuplicatas = new List<int> { 1, 2, 2, 3, 1, 4 };
List<int> semDuplicatas = removerDuplicatas(comDuplicatas);
Console.WriteLine(string.Join(", ", semDuplicatas)); // 1, 2, 3, 4
```

A função percorre a lista original e só adiciona um item ao `resultado` se ele ainda não estiver
lá (checado com `.Contains()`) — preservando a ordem original de aparição. (O capítulo de coleções
e LINQ mostra uma alternativa mais concisa usando `HashSet<T>` ou `.Distinct()`.)

## Quiz

### 1. Qual a principal diferença entre um array (`int[]`) e uma `List<int>` em C#?

- [ ] Não há diferença nenhuma
- [x] Arrays têm tamanho fixo definido na criação; `List<T>` cresce e encolhe dinamicamente
- [ ] `List<T>` só pode guardar números
- [ ] Arrays não podem ser percorridos com `foreach`

> Arrays em C# são de tamanho fixo, assim como em C. `List<T>`, da biblioteca padrão, oferece uma
> coleção dinâmica com métodos como `.Add()` e `.Remove()`, gerenciando automaticamente o
> redimensionamento interno conforme itens são adicionados ou removidos.

### 2. Qual propriedade dá o tamanho de um array, e qual dá o tamanho de uma `List<T>`?

- [ ] Ambos usam `.Length`
- [x] Arrays usam `.Length`; `List<T>` usa `.Count`
- [ ] Ambos usam `.Count`
- [ ] Arrays usam `.Size`; `List<T>` usa `.Length`

> É uma pegadinha comum em C#: arrays expõem a propriedade `Length`, enquanto `List<T>` (e a
> maioria das outras coleções genéricas) expõem `Count` — usar o nome errado gera erro de
> compilação, não um bug silencioso.

### 3. O que o `T` em `List<T>` representa?

- [ ] Uma abreviação de "table"
- [x] Um parâmetro de tipo genérico: o tipo específico dos elementos daquela lista (int, string, etc.)
- [ ] O tamanho máximo da lista
- [ ] É apenas decorativo, sem significado

> `List<T>` é uma classe genérica: `T` é substituído pelo tipo real usado em cada declaração, como
> `List<int>` ou `List<string>`. Isso garante checagem de tipo em tempo de compilação — tentar
> adicionar uma `string` a uma `List<int>` seria um erro de compilação, não um bug descoberto só em
> tempo de execução.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Arrays e List<T>" na trilha de C# do CodePath. Contexto: o capítulo explica
> arrays de tamanho fixo, List<T> genérica e métodos como Add/Remove/Sort/Contains. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
