---
numero: 2
titulo: "Variáveis e tipos"
nivel: "basico"
objetivo: "Declarar variáveis com var e tipos explícitos, e entender value types vs reference types."
duracao: 10
status: "completo"
---

## Conceito

C# é fortemente e estaticamente tipado: toda variável tem um tipo fixo, checado em tempo de
compilação. Você pode declarar o tipo explicitamente (`int idade = 28;`) ou deixar o compilador
inferir com `var` (`var idade = 28;`) — `var` não torna a linguagem dinâmica, é só um atalho de
escrita, o tipo ainda é fixado na compilação. C# também distingue **value types** (tipos como
`int`, `double`, `struct`, copiados por valor) de **reference types** (como `class`, `string`,
arrays, copiados por referência).

## Sintaxe

```csharp
int idade = 28;         // tipo explícito
var nome = "Ana";        // var: o compilador infere que é string

double preco = 19.90;
bool ativo = true;
char inicial = 'A';
```

## Exemplos comentados

```csharp
int a = 10;
double b = 3.14;
bool ehValido = true;
char letra = 'C';
string texto = "C#"; // string é reference type, mas se comporta como imutável (igual a Java/JS)

// var: só pode ser usado quando o compilador consegue inferir o tipo na mesma linha
var numero = 42;      // int, inferido
// var semValor;       // ERRO: não é possível inferir sem um valor inicial

// Conversões explícitas
string textoNumero = "42";
int convertido = int.Parse(textoNumero);          // lança exceção se o texto não for válido
int seguro = int.TryParse(textoNumero, out int resultado) ? resultado : 0; // não lança exceção

// Value types: copiar cria uma cópia INDEPENDENTE
int x = 5;
int y = x;
y = 10;
Console.WriteLine(x); // 5 — x não foi afetado

// Reference types: copiar a "referência" aponta para o MESMO objeto
int[] arrayX = { 1, 2, 3 };
int[] arrayY = arrayX; // arrayY aponta para o MESMO array, não uma cópia
arrayY[0] = 99;
Console.WriteLine(arrayX[0]); // 99 — arrayX também mudou!

// const: valor fixo, conhecido em tempo de compilação
const double PI = 3.14159;

// Tipos numéricos comuns: int (32 bits), long (64 bits), float, double, decimal (alta precisão, usado para dinheiro)
decimal preco = 19.90m; // sufixo m marca um literal decimal
```

## Exercício 1: Converta texto para número com segurança

Escreva um programa que tenta converter a string `"abc"` para `int` usando `int.TryParse`, e
imprime `"Conversão falhou"` se não for possível, sem lançar exceção.

### Solução

```csharp
string entrada = "abc";

if (int.TryParse(entrada, out int numero)) {
    Console.WriteLine("Convertido: " + numero);
} else {
    Console.WriteLine("Conversão falhou");
}
```

`int.TryParse` retorna `true`/`false` indicando sucesso, e escreve o resultado (se convertido) no
parâmetro `out numero` — diferente de `int.Parse`, que lançaria uma exceção `FormatException` para
uma entrada inválida como `"abc"`. `TryParse` é a forma recomendada quando a entrada pode não ser
confiável (como algo digitado pelo usuário).

## Exercício 2: Demonstre a diferença entre value type e reference type

Escreva um programa que declara um `int` e um `int[]`, copia cada um para uma segunda variável,
altera a cópia, e imprime os originais para mostrar a diferença de comportamento.

### Solução

```csharp
int numeroOriginal = 10;
int numeroCopia = numeroOriginal;
numeroCopia = 20;
Console.WriteLine(numeroOriginal); // 10 — value type, cópia independente

int[] arrayOriginal = { 1, 2, 3 };
int[] arrayCopia = arrayOriginal;
arrayCopia[0] = 99;
Console.WriteLine(arrayOriginal[0]); // 99 — reference type, mesmo objeto
```

`int` é um value type: `numeroCopia = numeroOriginal` copia o valor em si, criando duas variáveis
independentes. `int[]` é um reference type: `arrayCopia = arrayOriginal` copia apenas a
**referência** (o "endereço" do array), então ambas as variáveis apontam para o mesmo array na
memória — alterar uma reflete na outra.

## Quiz

### 1. `var numero = 42;` torna `numero` uma variável de tipo dinâmico?

- [ ] Sim, `numero` pode receber qualquer tipo depois
- [x] Não, `var` só é um atalho de escrita — o compilador infere `int` e fixa esse tipo permanentemente
- [ ] `var` só funciona com strings
- [ ] `var` é sinônimo de `object`

> `var` não torna C# dinamicamente tipado. O compilador analisa o valor inicial (`42`, um `int`) e
> fixa esse tipo para a variável — tentar depois `numero = "texto";` seria um erro de compilação,
> exatamente como se `numero` tivesse sido declarada como `int` explicitamente.

### 2. Qual a diferença entre `int.Parse` e `int.TryParse`?

- [ ] São idênticos
- [x] `Parse` lança uma exceção se a conversão falhar; `TryParse` retorna `false` sem lançar exceção
- [ ] `TryParse` só funciona com números negativos
- [ ] `Parse` é mais rápido em todos os casos

> `int.Parse(texto)` lança `FormatException` se `texto` não for um número válido, interrompendo o
> programa se não tratado. `int.TryParse(texto, out resultado)` é mais seguro: retorna `true`/
> `false` indicando sucesso, sem lançar exceção, ideal para validar entradas não confiáveis.

### 3. O que acontece ao copiar um array (`int[] b = a;`) em C#?

- [ ] Cria uma cópia independente de todos os elementos
- [x] `b` passa a apontar para o MESMO array que `a`, já que arrays são reference types
- [ ] Lança um erro de compilação
- [ ] Só copia o primeiro elemento

> Arrays (assim como classes) são reference types em C#: a variável guarda uma referência ao
> objeto na memória, não o objeto em si. Atribuir `b = a` copia apenas essa referência — alterar um
> elemento através de `b` também é visível através de `a`, pois ambas apontam para os mesmos dados.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Variáveis e tipos" na trilha de C# do CodePath. Contexto: o capítulo explica var,
> tipos explícitos, int.Parse/TryParse e a diferença entre value types e reference types. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
