---
numero: 5
titulo: "Loops"
nivel: "basico"
objetivo: "Repetir instruções com for, foreach e while em C#."
duracao: 10
status: "completo"
---

## Conceito

C# tem `for` (contagem controlada), `while`/`do-while` (repetição condicional) e `foreach`
(percorrer diretamente os itens de uma coleção, sem controlar índice manualmente) — o `foreach` é
o mais usado no dia a dia por ser mais legível e menos propenso a erros de índice.

## Sintaxe

```csharp
for (int i = 0; i < 5; i++) {
    Console.WriteLine(i);
}

int[] numeros = { 10, 20, 30 };
foreach (int n in numeros) {
    Console.WriteLine(n);
}

int contador = 0;
while (contador < 5) {
    Console.WriteLine(contador);
    contador++;
}
```

## Exemplos comentados

```csharp
// for: ideal quando se sabe o número de repetições ou precisa do índice
for (int i = 0; i < 10; i += 2) {
    Console.WriteLine(i); // 0 2 4 6 8
}

// foreach: percorre qualquer coleção diretamente, sem índice manual
List<string> nomes = new List<string> { "Ana", "Bia", "Carlos" };
foreach (string nome in nomes) {
    Console.WriteLine(nome);
}

// break e continue funcionam como em C/C++/JavaScript
foreach (int n in new[] { 1, 2, 3, 4, 5 }) {
    if (n == 3) continue; // pula o 3
    if (n == 5) break;     // para antes do 5
    Console.WriteLine(n);  // 1 2 4
}

// while: repete enquanto a condição for verdadeira
int valor = 100;
int divisoes = 0;
while (valor > 1) {
    valor /= 2;
    divisoes++;
}
Console.WriteLine(divisoes);

// do-while: garante pelo menos uma execução
int x = 10;
do {
    Console.WriteLine(x);
    x++;
} while (x < 5);

// foreach com índice manual, quando necessário (usando um contador junto)
string[] itens = { "a", "b", "c" };
for (int i = 0; i < itens.Length; i++) {
    Console.WriteLine($"{i}: {itens[i]}");
}

// Range e Index (C# 8+): sintaxe moderna para fatiar arrays/listas
int[] valores = { 1, 2, 3, 4, 5 };
int[] meio = valores[1..4]; // { 2, 3, 4 } — igual ao slicing de Python
```

## Exercício 1: Some os números de 1 a 100

Escreva um programa C# que usa um `for` para somar todos os inteiros de 1 a 100 (inclusive) e
imprime o resultado.

### Solução

```csharp
int soma = 0;
for (int i = 1; i <= 100; i++) {
    soma += i;
}
Console.WriteLine(soma); // 5050
```

Assim como em C, a condição `i <= 100` garante que o valor `100` também seja incluído na soma, já
que a condição do `for` é avaliada **antes** de cada iteração e o loop para assim que ela se torna
falsa.

## Exercício 2: Filtre números pares com foreach

Dada `List<int> numeros = new List<int> { 4, 7, 10, 13, 18, 21, 24 };`, use `foreach` para criar
uma nova lista `pares` contendo apenas os números pares.

### Solução

```csharp
List<int> numeros = new List<int> { 4, 7, 10, 13, 18, 21, 24 };
List<int> pares = new List<int>();

foreach (int n in numeros) {
    if (n % 2 == 0) {
        pares.Add(n);
    }
}

Console.WriteLine(string.Join(", ", pares)); // 4, 10, 18, 24
```

`foreach` percorre cada elemento de `numeros` diretamente (sem precisar de um índice), e a
condição `n % 2 == 0` filtra os pares para adicionar à nova lista com `.Add()`. O capítulo de LINQ,
mais adiante, mostra uma forma ainda mais concisa de expressar esse mesmo filtro.

## Quiz

### 1. Quando `foreach` é preferível a um `for` tradicional?

- [ ] Sempre, `for` nunca deveria ser usado em C#
- [x] Quando você só precisa percorrer os itens de uma coleção, sem precisar do índice numérico
- [ ] `foreach` só funciona com arrays de números
- [ ] `for` é mais lento, então `foreach` deve substituí-lo sempre

> `foreach` é mais legível e menos propenso a erros (como off-by-one) quando o objetivo é apenas
> visitar cada item de uma coleção. `for` continua sendo necessário quando se precisa do índice
> explicitamente, ou quando o padrão de iteração não é uma simples varredura sequencial.

### 2. O que `numeros[1..4]` faz em C# moderno (C# 8+)?

- [ ] Cria um array com os elementos nos índices 1 e 4
- [x] Extrai um novo array/lista com os elementos dos índices 1, 2 e 3 (o índice final é exclusivo)
- [ ] É um erro de sintaxe
- [ ] Remove os elementos entre os índices 1 e 4

> A sintaxe de range (`inicio..fim`) em C# 8+ funciona de forma parecida com o slicing de Python:
> extrai um novo array/lista com os elementos do índice `inicio` até `fim - 1` (o índice final é
> exclusivo).

### 3. O que `break` e `continue` fazem dentro de um `foreach`?

- [ ] Não podem ser usados dentro de `foreach`
- [x] `break` encerra o loop inteiro; `continue` pula para o próximo item da coleção
- [ ] `continue` encerra o loop; `break` pula o item
- [ ] Ambos encerram o programa

> `break` e `continue` funcionam em `foreach` exatamente como em `for` ou `while`: `break`
> interrompe toda a iteração da coleção, e `continue` pula o restante do código apenas para o item
> atual, seguindo para o próximo.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Loops" na trilha de C# do CodePath. Contexto: o capítulo explica for, foreach,
> while/do-while e a sintaxe de range (`..`) para fatiar coleções. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
