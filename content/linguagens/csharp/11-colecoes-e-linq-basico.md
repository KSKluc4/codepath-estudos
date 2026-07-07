---
numero: 11
titulo: "Coleções e LINQ básico"
nivel: "intermediario"
objetivo: "Usar Dictionary, List e consultas LINQ básicas sobre coleções."
duracao: 15
status: "completo"
---

## Conceito

Além de `List<T>`, C# oferece `Dictionary<TChave, TValor>` (pares chave-valor, como um dict Python
ou um objeto JS) e `HashSet<T>` (valores únicos). **LINQ** (Language Integrated Query) é um recurso
central de C#: permite consultar e transformar qualquer coleção com uma sintaxe declarativa
parecida com SQL, ou com métodos encadeados como `.Where()` e `.Select()` — muito similar a
`filter`/`map` de JavaScript.

## Sintaxe

```csharp
Dictionary<string, int> idades = new Dictionary<string, int> {
    { "Ana", 28 },
    { "Bia", 25 }
};
idades["Carlos"] = 30; // adiciona ou atualiza

List<int> numeros = new List<int> { 1, 2, 3, 4, 5 };
var pares = numeros.Where(n => n % 2 == 0); // LINQ: filtra
```

## Exemplos comentados

```csharp
using System.Linq; // necessário para usar os métodos de LINQ

// Dictionary: pares chave-valor
Dictionary<string, int> estoque = new Dictionary<string, int> {
    { "Mouse", 15 },
    { "Teclado", 8 }
};

estoque["Monitor"] = 5;          // adiciona nova chave
estoque["Mouse"] = 20;            // atualiza chave existente

if (estoque.ContainsKey("Mouse")) {
    Console.WriteLine(estoque["Mouse"]);
}

// TryGetValue: forma segura de acessar, sem lançar exceção se a chave não existir
if (estoque.TryGetValue("Cabo", out int quantidade)) {
    Console.WriteLine(quantidade);
} else {
    Console.WriteLine("Não encontrado");
}

foreach (KeyValuePair<string, int> item in estoque) {
    Console.WriteLine($"{item.Key}: {item.Value}");
}

// HashSet: coleção de valores ÚNICOS
HashSet<string> tags = new HashSet<string> { "csharp", "dotnet" };
tags.Add("csharp"); // ignorado, já existe
Console.WriteLine(tags.Count); // 2

// LINQ: método de sintaxe (encadeamento de métodos)
List<int> numeros = new List<int> { 4, 8, 15, 16, 23, 42 };

var pares = numeros.Where(n => n % 2 == 0);          // [4, 8, 16, 42]
var dobrados = numeros.Select(n => n * 2);             // transforma cada item
var primeiro = numeros.FirstOrDefault(n => n > 20);      // 23, ou 0 se nenhum satisfizer
bool algum = numeros.Any(n => n > 40);                    // true
int soma = numeros.Sum();                                   // soma total
int maior = numeros.Max();                                   // maior valor

// LINQ: sintaxe de consulta (parecida com SQL) — equivalente ao Where acima
var paresQuery = from n in numeros
                  where n % 2 == 0
                  select n;
```

## Exercício 1: Conte a frequência de palavras com Dictionary

Dada `List<string> palavras = new List<string> { "csharp", "java", "csharp", "python", "csharp" };`,
construa um `Dictionary<string, int>` com a frequência de cada palavra.

### Solução

```csharp
List<string> palavras = new List<string> { "csharp", "java", "csharp", "python", "csharp" };
Dictionary<string, int> frequencia = new Dictionary<string, int>();

foreach (string palavra in palavras) {
    if (frequencia.ContainsKey(palavra)) {
        frequencia[palavra]++;
    } else {
        frequencia[palavra] = 1;
    }
}

foreach (var item in frequencia) {
    Console.WriteLine($"{item.Key}: {item.Value}");
}
// csharp: 3
// java: 1
// python: 1
```

O padrão é checar se a chave já existe com `ContainsKey`: se sim, incrementa o contador; se não,
inicializa com `1`. `Dictionary<TChave, TValor>` garante acesso rápido (O(1) em média) pela chave,
independente do tamanho da coleção.

## Exercício 2: Filtre e transforme com LINQ

Dada `List<int> notas = new List<int> { 55, 80, 42, 90, 67, 100 };`, use LINQ para obter uma lista
apenas com as notas `>= 70`, convertidas para o conceito `"Aprovado"`.

### Solução

```csharp
using System.Linq;

List<int> notas = new List<int> { 55, 80, 42, 90, 67, 100 };

var aprovados = notas
    .Where(n => n >= 70)
    .Select(n => $"Nota {n}: Aprovado")
    .ToList();

foreach (string resultado in aprovados) {
    Console.WriteLine(resultado);
}
// Nota 80: Aprovado
// Nota 90: Aprovado
// Nota 100: Aprovado
```

`.Where()` filtra primeiro os elementos que satisfazem a condição, e `.Select()` transforma cada
um dos que sobraram — o mesmo padrão de encadear `filter` e `map` em JavaScript, ou `filter` e
`map` em Python. `.ToList()` no final materializa o resultado em uma `List<string>` de verdade
(LINQ, por padrão, é "preguiçoso": só calcula quando o resultado é efetivamente consumido).

## Quiz

### 1. Qual a diferença entre `Dictionary<TChave, TValor>` e `List<T>`?

- [ ] Não há diferença nenhuma
- [x] `Dictionary` acessa valores por chave (não por posição numérica); `List` acessa por índice
- [ ] `List` não pode conter objetos
- [ ] `Dictionary` só aceita `string` como valor

> `Dictionary<TChave, TValor>` armazena pares chave-valor, permitindo buscar um valor diretamente
> pela sua chave (`dicionario[chave]`), com desempenho muito melhor que procurar em uma lista.
> `List<T>` é uma sequência ordenada, acessada por posição numérica (`lista[indice]`).

### 2. O que `numeros.Where(n => n % 2 == 0)` faz?

- [ ] Modifica a lista original, removendo os ímpares
- [x] Retorna uma nova sequência contendo apenas os elementos que satisfazem a condição, sem alterar `numeros`
- [ ] Soma todos os números pares
- [ ] Lança um erro se algum número for ímpar

> `.Where()` é o equivalente LINQ de `filter` em JavaScript ou `filter()` em Python: recebe uma
> condição (um predicado) e retorna uma nova sequência apenas com os elementos que satisfazem essa
> condição, sem modificar a coleção original.

### 3. Por que `TryGetValue` costuma ser preferível a acessar `dicionario[chave]` diretamente quando a chave pode não existir?

- [ ] Não há diferença de comportamento
- [x] `dicionario[chave]` lança `KeyNotFoundException` se a chave não existir; `TryGetValue` retorna `false` sem lançar exceção
- [ ] `TryGetValue` só funciona com chaves numéricas
- [ ] `dicionario[chave]` é sempre mais rápido

> Acessar uma chave inexistente com colchetes lança uma exceção que precisa ser tratada com
> try/catch se não for garantido que a chave existe. `TryGetValue(chave, out valor)` é a forma
> segura e idiomática, retornando `true`/`false` sem lançar exceção — parecido com `int.TryParse`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Coleções e LINQ básico" na trilha de C# do CodePath. Contexto: o capítulo explica
> Dictionary, HashSet e consultas LINQ como Where/Select/FirstOrDefault. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
