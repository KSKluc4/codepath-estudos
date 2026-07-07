---
numero: 7
titulo: "Métodos"
nivel: "basico"
objetivo: "Declarar métodos com parâmetros, valores padrão e retorno em C#."
duracao: 12
status: "completo"
---

## Conceito

Em C#, uma função declarada dentro de uma classe é chamada de **método**. A sintaxe é próxima de
Java e C++: tipo de retorno explícito (ou `void`), nome, parâmetros tipados — e, como em C++,
suporta parâmetros com valor padrão e sobrecarga (múltiplos métodos com o mesmo nome e assinaturas
diferentes).

## Sintaxe

```csharp
int Somar(int a, int b) {
    return a + b;
}

void Saudar(string nome = "visitante") {
    Console.WriteLine($"Olá, {nome}!");
}

int resultado = Somar(2, 3); // 5
```

## Exemplos comentados

```csharp
// Método com retorno
int Somar(int a, int b) {
    return a + b;
}

// Expression-bodied method: forma compacta para métodos de uma expressão só
int Multiplicar(int a, int b) => a * b;

// void: método que não retorna valor
void Log(string mensagem) {
    Console.WriteLine($"[LOG] {mensagem}");
}

// Parâmetro com valor padrão
void Configurar(int largura = 800, int altura = 600) {
    Console.WriteLine($"{largura}x{altura}");
}
Configurar();          // usa os padrões
Configurar(1024);      // só largura customizada
Configurar(altura: 480); // parâmetro NOMEADO, pode pular os anteriores

// Sobrecarga de métodos, como em C++
int Area(int lado) => lado * lado;
double Area(double largura, double altura) => largura * altura;

// Parâmetro "out": permite retornar um valor adicional através de um parâmetro
bool TentarDividir(int a, int b, out int resultado) {
    if (b == 0) {
        resultado = 0;
        return false;
    }
    resultado = a / b;
    return true;
}

if (TentarDividir(10, 2, out int quociente)) {
    Console.WriteLine(quociente); // 5
}

// params: número variável de argumentos (equivalente a *args do Python)
int SomarTudo(params int[] numeros) {
    int total = 0;
    foreach (int n in numeros) total += n;
    return total;
}
SomarTudo(1, 2, 3, 4); // 10 — pode passar quantos argumentos quiser
```

## Exercício 1: Escreva um método com valor padrão

Escreva um método `string Cumprimentar(string nome, string saudacao = "Olá")` que retorna
`"<saudacao>, <nome>!"`, usando `"Olá"` como saudação padrão.

### Solução

```csharp
string Cumprimentar(string nome, string saudacao = "Olá") {
    return $"{saudacao}, {nome}!";
}

Console.WriteLine(Cumprimentar("Ana"));              // "Olá, Ana!"
Console.WriteLine(Cumprimentar("Bia", "Bom dia"));    // "Bom dia, Bia!"
```

Como `saudacao` tem um valor padrão, o método pode ser chamado com um ou dois argumentos. O
parâmetro com valor padrão precisa vir depois dos parâmetros obrigatórios na assinatura, assim
como em C++.

## Exercício 2: Use params para uma função variádica

Escreva um método `double Media(params double[] numeros)` que calcula a média de qualquer
quantidade de números passados.

### Solução

```csharp
double Media(params double[] numeros) {
    if (numeros.Length == 0) return 0;
    double soma = 0;
    foreach (double n in numeros) soma += n;
    return soma / numeros.Length;
}

Console.WriteLine(Media(4, 8, 15));   // 9
Console.WriteLine(Media(10, 20));      // 15
```

`params double[] numeros` permite chamar `Media(4, 8, 15)` passando quantos argumentos forem
necessários diretamente, sem precisar criar um array explicitamente — dentro do método, `numeros`
já é um array de verdade, com todos os métodos e propriedades de array disponíveis (como
`.Length`).

## Quiz

### 1. O que `int Multiplicar(int a, int b) => a * b;` representa?

- [ ] Um erro de sintaxe
- [x] Um "expression-bodied method": forma compacta de escrever um método cujo corpo é uma única expressão
- [ ] Uma arrow function anônima, sem nome
- [ ] Um método que só pode ser chamado uma vez

> `=>` (arrow) permite escrever métodos cujo corpo é uma única expressão de forma mais concisa,
> sem chaves `{}` nem `return` explícito — equivalente semanticamente a
> `int Multiplicar(int a, int b) { return a * b; }`.

### 2. Para que serve o modificador `out` em um parâmetro de método?

- [ ] Marca o parâmetro como opcional
- [x] Permite que o método "retorne" um valor adicional através daquele parâmetro, além do retorno normal
- [ ] Impede que o parâmetro seja alterado dentro do método
- [ ] Só funciona com tipos `string`

> Um parâmetro `out` precisa ser obrigatoriamente atribuído dentro do método, e o valor
> atribuído fica disponível para quem chamou, na variável passada com `out` na chamada — muito
> usado no padrão "tentar fazer algo, retornando sucesso/falha e um resultado", como em
> `int.TryParse` e `TentarDividir`.

### 3. O que `params int[] numeros` permite fazer na chamada de um método?

- [ ] Passar exatamente um argumento, sempre
- [x] Passar qualquer quantidade de argumentos `int` diretamente, sem precisar criar um array manualmente
- [ ] Só pode ser usado em métodos `void`
- [ ] `params` não existe em C#

> `params` transforma o(s) último(s) parâmetro(s) de um método em uma lista de tamanho variável:
> quem chama pode passar zero, um ou vários valores separados por vírgula, e o método os recebe já
> agrupados em um array — parecido com `*args` em Python ou rest parameters em JavaScript.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Métodos" na trilha de C# do CodePath. Contexto: o capítulo explica declaração de
> métodos, parâmetros padrão/nomeados, out e params. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].
