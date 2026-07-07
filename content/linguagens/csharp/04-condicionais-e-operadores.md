---
numero: 4
titulo: "Condicionais e operadores"
nivel: "basico"
objetivo: "Controlar fluxo com if/else/switch e operadores lógicos em C#."
duracao: 10
status: "completo"
---

## Conceito

C# usa `if`/`else if`/`else` de forma idêntica à maioria das linguagens C-like. `switch` em C#
moderno vai além do `switch` clássico de C: além do formato tradicional, existe a **switch
expression** (a partir do C# 8), uma forma compacta que retorna um valor diretamente, muito
parecida com pattern matching de linguagens funcionais.

## Sintaxe

```csharp
int idade = 20;

if (idade < 18) {
    Console.WriteLine("Menor de idade");
} else {
    Console.WriteLine("Maior de idade");
}

string categoria = idade switch {
    < 12 => "Criança",
    < 18 => "Adolescente",
    _ => "Adulto"
};
```

## Exemplos comentados

```csharp
int nota = 75;

if (nota >= 90) {
    Console.WriteLine("A");
} else if (nota >= 70) {
    Console.WriteLine("B");
} else {
    Console.WriteLine("C");
}

// Operador ternário: idêntico a C/C++/JavaScript
string status = idade >= 18 ? "adulto" : "menor";

// switch clássico (statement), como em C
int dia = 3;
switch (dia) {
    case 1:
        Console.WriteLine("Domingo");
        break; // sem break, o compilador C# EXIGE break ou outro terminador — não há fall-through silencioso!
    case 2:
        Console.WriteLine("Segunda");
        break;
    default:
        Console.WriteLine("Outro dia");
        break;
}

// switch expression (C# 8+): forma compacta que RETORNA um valor
string nomeDia = dia switch {
    1 => "Domingo",
    2 => "Segunda",
    3 => "Terça",
    _ => "Outro dia" // _ é o "default" da switch expression
};
Console.WriteLine(nomeDia);

// switch expression com padrões relacionais (muito usado para faixas de valores)
string faixaEtaria = idade switch {
    < 0 => "Idade inválida",
    <= 12 => "Criança",
    <= 17 => "Adolescente",
    _ => "Adulto"
};

// Operadores lógicos: && || ! (idênticos a C/JavaScript)
bool podeVotar = idade >= 16 && idade < 120;

// Operador de coalescência nula (visto com detalhe no capítulo de nullable types)
string nome = null;
string exibicao = nome ?? "Anônimo"; // usa "Anônimo" se nome for null
```

## Exercício 1: Classifique uma nota com switch expression

Escreva uma switch expression que, dado `int nota = 85;`, retorna `"A"` se `>= 90`, `"B"` se
`>= 70`, `"C"` se `>= 50`, ou `"D"` caso contrário.

### Solução

```csharp
int nota = 85;

string conceito = nota switch {
    >= 90 => "A",
    >= 70 => "B",
    >= 50 => "C",
    _ => "D"
};

Console.WriteLine(conceito); // "B"
```

Assim como uma cadeia de `if/else if`, a switch expression avalia os padrões **em ordem**, de cima
para baixo, usando o primeiro que corresponder — por isso `>= 70` não precisa repetir `< 90`, já
que só chega ali se o padrão anterior (`>= 90`) já tiver falhado.

## Exercício 2: Corrija um switch sem break

O código abaixo não compila em C#. Explique por quê e conserte.

```csharp
int dia = 2;
switch (dia) {
    case 1:
        Console.WriteLine("Domingo");
    case 2:
        Console.WriteLine("Segunda");
}
```

### Solução

```csharp
int dia = 2;
switch (dia) {
    case 1:
        Console.WriteLine("Domingo");
        break;
    case 2:
        Console.WriteLine("Segunda");
        break;
}
```

Diferente de C, C++ e JavaScript, o compilador de C# **exige** que cada `case` termine com `break`
(ou `return`, `goto case`, etc.) — fall-through implícito (cair silenciosamente para o próximo
`case`) não é permitido, evitando exatamente o tipo de bug comum nessas outras linguagens.

## Quiz

### 1. O que uma "switch expression" (`valor switch { ... }`) faz, diferente de um switch statement clássico?

- [ ] Não existe diferença, são sinônimos
- [x] Retorna diretamente um valor, podendo ser usada em uma atribuição ou expressão
- [ ] Só funciona com números
- [ ] É mais lenta que um switch statement

> Uma switch expression avalia os padrões e produz um valor diretamente, permitindo escrever
> `string x = valor switch { ... };` em vez do switch statement tradicional (que só executa
> comandos, sem retornar valor por si só).

### 2. O que acontece se um `case` de um switch statement clássico em C# não tiver `break` (ou outro terminador)?

- [ ] A execução cai silenciosamente para o próximo `case` (fall-through), como em C
- [x] O código não compila — C# exige que cada case seja terminado explicitamente
- [ ] O `case` é ignorado silenciosamente
- [ ] É permitido apenas no primeiro `case`

> Diferente de C/C++/JavaScript, C# proíbe fall-through implícito entre cases não vazios — cada
> bloco precisa terminar com `break`, `return`, `throw` ou similar, o que elimina uma classe
> inteira de bugs relacionados a esquecer o `break`.

### 3. O que `_` representa dentro de uma switch expression em C#?

- [ ] Uma variável qualquer
- [x] O padrão "curinga" (discard), equivalente ao `default` de um switch clássico
- [ ] Um erro de sintaxe
- [ ] Sempre retorna `null`

> `_` (discard) casa com qualquer valor que não tenha sido capturado pelos padrões anteriores,
> funcionando como o `default:` de um switch statement tradicional — geralmente colocado por
> último, já que os padrões são avaliados em ordem.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Condicionais e operadores" na trilha de C# do CodePath. Contexto: o capítulo
> explica if/else, switch statement clássico e switch expressions com padrões relacionais. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
