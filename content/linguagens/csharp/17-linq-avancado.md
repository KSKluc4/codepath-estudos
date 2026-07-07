---
numero: 17
titulo: "LINQ avançado"
nivel: "avancado"
objetivo: "Encadear operações LINQ como Where, Select e OrderBy sobre coleções."
duracao: 15
status: "completo"
---

## Conceito

Além de `Where` e `Select` (vistos no capítulo de coleções), LINQ oferece um conjunto rico de
operadores que podem ser encadeados para expressar consultas complexas de forma declarativa:
ordenação (`OrderBy`), agrupamento (`GroupBy`), agregação (`Sum`, `Average`, `Count`) e junção
entre coleções (`Join`) — muito parecido com combinar `filter`/`map`/`reduce`/`sort` em JavaScript,
ou uma consulta SQL inteira expressa em código C#.

## Sintaxe

```csharp
var resultado = produtos
    .Where(p => p.Preco > 50)
    .OrderBy(p => p.Nome)
    .Select(p => p.Nome)
    .ToList();
```

## Exemplos comentados

```csharp
using System.Linq;

class Produto {
    public string Nome { get; set; }
    public double Preco { get; set; }
    public string Categoria { get; set; }
}

List<Produto> produtos = new List<Produto> {
    new Produto { Nome = "Mouse", Preco = 80, Categoria = "Periféricos" },
    new Produto { Nome = "Teclado", Preco = 150, Categoria = "Periféricos" },
    new Produto { Nome = "Monitor", Preco = 900, Categoria = "Telas" },
};

// Encadeamento: filtra, ordena, transforma
var nomesCaros = produtos
    .Where(p => p.Preco > 100)
    .OrderByDescending(p => p.Preco)
    .Select(p => p.Nome)
    .ToList();
// ["Monitor", "Teclado"]

// Agregações
double total = produtos.Sum(p => p.Preco);       // soma de todos os preços
double media = produtos.Average(p => p.Preco);    // média de preços
int quantidade = produtos.Count(p => p.Preco > 100); // conta itens que satisfazem a condição

// GroupBy: agrupa itens por uma chave, parecido com GROUP BY do SQL
var porCategoria = produtos.GroupBy(p => p.Categoria);
foreach (var grupo in porCategoria) {
    Console.WriteLine($"{grupo.Key}: {grupo.Count()} produtos");
}
// Periféricos: 2 produtos
// Telas: 1 produtos

// OrderBy + ThenBy: ordenação com critério de desempate
var ordenados = produtos
    .OrderBy(p => p.Categoria)
    .ThenBy(p => p.Preco);

// Select com índice, e projeção para um novo formato (anonymous type)
var comIndice = produtos.Select((p, indice) => new { Posicao = indice, p.Nome });

// First/Single: obter um único item, com variações para tratar ausência
Produto primeiro = produtos.First();                    // lança exceção se vazio
Produto primeiroOuNulo = produtos.FirstOrDefault(p => p.Preco > 1000); // null se nenhum satisfizer

// Sintaxe de consulta (query syntax), alternativa equivalente ao encadeamento de métodos
var query = from p in produtos
            where p.Preco > 100
            orderby p.Preco descending
            select p.Nome;
```

## Exercício 1: Agrupe e conte produtos por categoria

Dada a lista `produtos` do exemplo acima, use `GroupBy` para imprimir quantos produtos existem em
cada categoria.

### Solução

```csharp
using System.Linq;

var porCategoria = produtos.GroupBy(p => p.Categoria);

foreach (var grupo in porCategoria) {
    Console.WriteLine($"{grupo.Key}: {grupo.Count()} produto(s)");
}
// Periféricos: 2 produto(s)
// Telas: 1 produto(s)
```

`GroupBy(p => p.Categoria)` cria grupos onde `grupo.Key` é o valor da categoria e o próprio grupo
é uma sequência de todos os produtos com aquela categoria — permitindo aplicar qualquer outro
operador LINQ (como `Count()`, `Sum()`, `Average()`) dentro de cada grupo individualmente.

## Exercício 2: Encadeie filtro, ordenação e projeção

Use a lista `produtos` para obter uma lista de strings no formato `"Nome: R$Preco"`, apenas para
produtos da categoria `"Periféricos"`, ordenados por preço crescente.

### Solução

```csharp
using System.Linq;

var resultado = produtos
    .Where(p => p.Categoria == "Periféricos")
    .OrderBy(p => p.Preco)
    .Select(p => $"{p.Nome}: R${p.Preco:F2}")
    .ToList();

foreach (string linha in resultado) {
    Console.WriteLine(linha);
}
// Mouse: R$80.00
// Teclado: R$150.00
```

A cadeia é lida de cima para baixo, cada operador recebendo o resultado do anterior:
`Where` filtra só os periféricos, `OrderBy` ordena por preço, e `Select` transforma cada `Produto`
restante em uma string formatada — `.ToList()` no final materializa o resultado.

## Quiz

### 1. O que `GroupBy(p => p.Categoria)` produz?

- [ ] Uma lista simples, sem agrupamento real
- [x] Uma sequência de grupos, cada um com uma chave (a categoria) e os itens correspondentes a essa chave
- [ ] Remove os itens duplicados
- [ ] Ordena os produtos por categoria, sem agrupar de fato

> `GroupBy` particiona a coleção original em grupos, cada um identificado por `.Key` (o valor
> retornado pela função de agrupamento) e contendo, como uma sub-sequência, todos os elementos
> originais que compartilham essa chave — equivalente ao `GROUP BY` do SQL.

### 2. Qual a diferença entre `First()` e `FirstOrDefault()`?

- [ ] São idênticos
- [x] `First()` lança exceção se a sequência estiver vazia (ou nenhum item satisfizer a condição); `FirstOrDefault()` retorna o valor padrão (como `null`) nesse caso
- [ ] `FirstOrDefault()` sempre retorna o último item
- [ ] `First()` só funciona com números

> Ambos retornam o primeiro elemento (opcionalmente satisfazendo uma condição), mas `First()` é
> "estrito": lança `InvalidOperationException` se não houver nenhum resultado. `FirstOrDefault()`
> é mais seguro para casos onde a ausência de resultado é uma possibilidade esperada.

### 3. Por que operadores LINQ como `Where` e `Select` podem ser encadeados livremente?

- [ ] Porque modificam a coleção original diretamente
- [x] Porque cada um retorna uma nova sequência (IEnumerable), que pode ser passada diretamente para o próximo operador
- [ ] Só funcionam se forem chamados em uma ordem específica fixa
- [ ] Não podem ser encadeados, é preciso uma variável intermediária para cada etapa

> Assim como `map`/`filter` em JavaScript, cada operador LINQ recebe uma sequência e retorna uma
> nova sequência (sem alterar a original), o que permite chamar o próximo operador diretamente no
> resultado do anterior, formando uma cadeia fluente de transformações.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "LINQ avançado" na trilha de C# do CodePath. Contexto: o capítulo explica
> OrderBy/ThenBy, GroupBy, agregações (Sum/Average/Count) e First/FirstOrDefault. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
