---
numero: 13
titulo: "Generics"
nivel: "avancado"
objetivo: "Escrever classes e métodos genéricos reutilizáveis e type-safe."
duracao: 12
status: "completo"
---

## Conceito

Generics permitem escrever classes e métodos que funcionam com **qualquer tipo**, sem perder a
checagem de tipo em tempo de compilação — exatamente o mesmo conceito de generics em TypeScript
(`List<T>`, que você já usa desde o capítulo de arrays, é o exemplo mais comum de classe genérica
da própria biblioteca padrão). `T` é um parâmetro de tipo: um "espaço reservado" preenchido com o
tipo real em cada uso.

## Sintaxe

```csharp
T Primeiro<T>(List<T> lista) {
    return lista[0];
}

Primeiro(new List<int> { 1, 2, 3 });        // T inferido como int
Primeiro(new List<string> { "a", "b" });     // T inferido como string
```

## Exemplos comentados

```csharp
// Método genérico
T Ultimo<T>(List<T> lista) {
    return lista[lista.Count - 1];
}
Console.WriteLine(Ultimo(new List<int> { 1, 2, 3 }));      // 3
Console.WriteLine(Ultimo(new List<string> { "x", "y" }));    // "y"

// Classe genérica
class Caixa<T> {
    public T Conteudo { get; set; }

    public Caixa(T conteudo) {
        Conteudo = conteudo;
    }
}
Caixa<int> caixaDeNumero = new Caixa<int>(42);
Caixa<string> caixaDeTexto = new Caixa<string>("olá");

// Múltiplos parâmetros de tipo
class Par<TChave, TValor> {
    public TChave Chave { get; set; }
    public TValor Valor { get; set; }
}
Par<string, int> idade = new Par<string, int> { Chave = "Ana", Valor = 28 };

// Restrições de tipo (constraints) com "where": limita quais tipos T pode assumir
class Repositorio<T> where T : class {  // T precisa ser um reference type
    private List<T> _itens = new List<T>();
    public void Adicionar(T item) => _itens.Add(item);
}

// Constraint comum: exigir que T implemente uma interface específica
double SomarPrecos<T>(List<T> itens) where T : IPrecificavel {
    double total = 0;
    foreach (T item in itens) {
        total += item.Preco; // seguro, porque T garantidamente tem Preco (da interface)
    }
    return total;
}
interface IPrecificavel {
    double Preco { get; }
}

// Pilha genérica, exemplo clássico de estrutura de dados reutilizável
class Pilha<T> {
    private List<T> _itens = new List<T>();
    public void Empilhar(T item) => _itens.Add(item);
    public T Desempilhar() {
        T topo = _itens[^1]; // ^1 é o índice "último elemento" (C# 8+)
        _itens.RemoveAt(_itens.Count - 1);
        return topo;
    }
}
```

## Exercício 1: Escreva um método genérico de troca

Escreva um método genérico `void Trocar<T>(ref T a, ref T b)` que troca os valores de duas
variáveis de qualquer tipo `T`.

### Solução

```csharp
void Trocar<T>(ref T a, ref T b) {
    T temp = a;
    a = b;
    b = temp;
}

int x = 5, y = 10;
Trocar(ref x, ref y);
Console.WriteLine($"x={x} y={y}"); // x=10 y=5

string s1 = "primeiro", s2 = "segundo";
Trocar(ref s1, ref s2);
Console.WriteLine($"s1={s1} s2={s2}"); // s1=segundo s2=primeiro
```

`ref T a, ref T b` permite que o método altere as variáveis originais (assim como `int &a` faria
em C++), e como o método é genérico, a mesma implementação funciona tanto para `int` quanto para
`string` — o tipo real de `T` é inferido a partir dos argumentos passados em cada chamada.

## Exercício 2: Crie uma classe genérica com restrição

Crie uma classe genérica `Repositorio<T> where T : IIdentificavel` (com uma interface
`IIdentificavel { int Id { get; } }`) que armazena itens e tem um método `BuscarPorId(int id)`.

### Solução

```csharp
interface IIdentificavel {
    int Id { get; }
}

class Repositorio<T> where T : IIdentificavel {
    private List<T> _itens = new List<T>();

    public void Adicionar(T item) => _itens.Add(item);

    public T BuscarPorId(int id) {
        foreach (T item in _itens) {
            if (item.Id == id) return item;
        }
        return default(T); // valor padrão do tipo (null para reference types)
    }
}

class Produto : IIdentificavel {
    public int Id { get; set; }
    public string Nome { get; set; }
}

Repositorio<Produto> repositorio = new Repositorio<Produto>();
repositorio.Adicionar(new Produto { Id = 1, Nome = "Mouse" });
Console.WriteLine(repositorio.BuscarPorId(1).Nome); // "Mouse"
```

A restrição `where T : IIdentificavel` garante, em tempo de compilação, que qualquer tipo usado
com `Repositorio<T>` tem uma propriedade `Id` — o que permite ao método `BuscarPorId` acessar
`item.Id` com segurança, sem precisar de `any` nem checagem de tipo em tempo de execução.

## Quiz

### 1. Para que servem generics em C#?

- [ ] Para tornar o código mais lento, mas mais legível
- [x] Para escrever código reutilizável que funciona com múltiplos tipos, mantendo checagem de tipo em tempo de compilação
- [ ] Apenas para trabalhar com números
- [ ] Generics substituem completamente a necessidade de interfaces

> Generics permitem escrever uma única implementação (como `Pilha<T>` ou `Repositorio<T>`) que
> funciona corretamente para qualquer tipo específico usado em cada instância, sem precisar
> duplicar código nem abrir mão da segurança de tipo que `object`/`any` sacrificariam.

### 2. O que `where T : IPrecificavel` faz na declaração de um método genérico?

- [ ] Restringe `T` a ser exatamente o tipo `IPrecificavel`
- [x] Restringe `T` a qualquer tipo que implemente a interface `IPrecificavel`, permitindo acessar seus membros com segurança
- [ ] É um erro de sintaxe
- [ ] Torna o método mais lento

> Uma constraint (`where T : Interface`) garante, em tempo de compilação, que o tipo usado no
> lugar de `T` implementa aquela interface — permitindo ao método acessar propriedades/métodos
> daquela interface (como `item.Preco`) com segurança, sem lançar cast nem checagem manual.

### 3. O que `default(T)` retorna para um tipo genérico `T`?

- [ ] Sempre `0`
- [x] O valor padrão daquele tipo específico: `0` para números, `false` para bool, `null` para reference types, etc.
- [ ] Sempre lança uma exceção
- [ ] O primeiro valor já usado com aquele `T`

> `default(T)` retorna o valor padrão apropriado para o tipo real substituído em `T` naquela
> instância — `0` para tipos numéricos, `false` para `bool`, `null` para qualquer reference type
> (classe) — útil quando um método genérico precisa de um valor "vazio" antes de saber, em tempo
> de compilação, qual será o tipo concreto usado.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Generics" na trilha de C# do CodePath. Contexto: o capítulo explica métodos e
> classes genéricas, restrições de tipo (where) e default(T). Minha dúvida/meu exercício: [descreva
> aqui exatamente onde travou].
