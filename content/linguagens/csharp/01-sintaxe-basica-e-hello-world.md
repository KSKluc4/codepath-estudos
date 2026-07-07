---
numero: 1
titulo: "Sintaxe básica e Hello World"
nivel: "basico"
objetivo: "Escrever e rodar um primeiro programa em C#, com Console.WriteLine e tipos primitivos."
duracao: 10
status: "completo"
---

## Conceito

C# é uma linguagem compilada e fortemente tipada, criada pela Microsoft, que roda sobre o .NET —
uma plataforma multiplataforma (Windows, Linux, macOS) desde suas versões mais recentes. Assim
como Java, C# compila para um bytecode intermediário (IL) que é executado por uma máquina virtual
(o CLR), em vez de compilar diretamente para código de máquina nativo como C ou C++.

## Sintaxe

```csharp
Console.WriteLine("Olá, mundo!");
```

```bash
dotnet new console -o MeuApp   # cria um novo projeto de console
cd MeuApp
dotnet run                       # compila e executa
```

## Exemplos comentados

```csharp
// Program.cs — em C# moderno (a partir do .NET 6), "top-level statements"
// permitem escrever código direto no arquivo, sem precisar de uma classe
// Program e um Main explícitos (o compilador gera isso automaticamente)

Console.WriteLine("Bem-vindo ao C#");

int idade = 28;
Console.WriteLine("Idade: " + idade); // concatenação simples com +

// Console.Write (sem "Line") não quebra linha ao final
Console.Write("Sem quebra de linha ");
Console.Write("continua aqui\n");

// Console.ReadLine() lê uma linha digitada pelo usuário (sempre como string)
Console.Write("Digite seu nome: ");
string nome = Console.ReadLine();
Console.WriteLine($"Olá, {nome}!"); // $ marca uma string interpolada (próximo capítulo detalha)

// Comentários: // de uma linha, /* */ de várias, igual em C/C++/JavaScript
// XML doc comments (///) documentam métodos/classes para ferramentas de IDE
/// <summary>Soma dois números.</summary>
int Somar(int a, int b) => a + b; // método local, sintaxe compacta com =>

Console.WriteLine(Somar(2, 3)); // 5

// Estrutura tradicional (ainda válida e comum em projetos maiores):
// class Program {
//     static void Main(string[] args) {
//         Console.WriteLine("Olá, mundo!");
//     }
// }
```

## Exercício 1: Escreva um "Hello, World!" com uma variável

Escreva um programa C# que declara uma variável `string nome = "Ana";` e imprime
`"Olá, Ana!"` usando `Console.WriteLine`.

### Solução

```csharp
string nome = "Ana";
Console.WriteLine("Olá, " + nome + "!");
```

`Console.WriteLine` imprime o texto seguido de uma quebra de linha automática. Concatenar com `+`
funciona da mesma forma que em Java ou JavaScript — o próximo capítulo mostra a forma mais
idiomática de fazer isso com string interpolation (`$"Olá, {nome}!"`).

## Exercício 2: Leia um nome e cumprimente

Escreva um programa que lê um nome digitado pelo usuário com `Console.ReadLine()` e imprime
`"Bem-vindo(a), <nome>!"`.

### Solução

```csharp
Console.Write("Digite seu nome: ");
string nome = Console.ReadLine();
Console.WriteLine("Bem-vindo(a), " + nome + "!");
```

`Console.ReadLine()` bloqueia a execução até o usuário digitar algo e pressionar Enter, retornando
sempre uma `string` (mesmo que o usuário digite números — seria necessário converter
explicitamente, como será visto no capítulo de variáveis e tipos).

## Quiz

### 1. O que é o CLR (Common Language Runtime) em C#?

- [ ] Um editor de código específico para C#
- [x] A máquina virtual que executa o código C# compilado (na forma de bytecode intermediário IL)
- [ ] Uma biblioteca de interface gráfica
- [ ] O compilador de C#

> Assim como a JVM executa bytecode Java, o CLR executa o Intermediate Language (IL) gerado pela
> compilação de C#. Essa camada intermediária é o que permite ao .NET rodar em múltiplas
> plataformas (Windows, Linux, macOS) sem recompilar o código-fonte para cada uma.

### 2. O que `Console.WriteLine` faz, diferente de `Console.Write`?

- [ ] `WriteLine` só aceita números
- [x] `WriteLine` imprime o texto seguido de uma quebra de linha automática; `Write` não quebra linha
- [ ] `Write` é mais rápido, `WriteLine` mais lento
- [ ] Não há diferença nenhuma

> `Console.WriteLine(texto)` adiciona automaticamente uma quebra de linha ao final da saída,
> enquanto `Console.Write(texto)` imprime exatamente o texto passado, sem nenhum caractere extra —
> útil quando se quer construir uma linha com múltiplas chamadas.

### 3. O que `Console.ReadLine()` sempre retorna?

- [ ] Um número, se o usuário digitar dígitos
- [x] Uma `string`, independentemente do que o usuário digitar
- [ ] `true` ou `false`
- [ ] Nada, é um método `void`

> Assim como `input()` em Python, `Console.ReadLine()` sempre devolve o texto digitado como
> `string`. Para usar como número, é necessário converter explicitamente (por exemplo, com
> `int.Parse(...)`), assunto do próximo capítulo.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Sintaxe básica e Hello World" na trilha de C# do CodePath. Contexto: o capítulo
> explica Console.WriteLine/ReadLine, top-level statements e o papel do CLR. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
