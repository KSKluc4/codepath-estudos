---
numero: 3
titulo: "Operadores"
nivel: "basico"
objetivo: "Usar operadores aritméticos, relacionais, lógicos e de atribuição em C."
duracao: 10
status: "completo"
---

## Conceito

C tem os mesmos grupos de operadores encontrados na maioria das linguagens: aritméticos (`+ - * /
%`), relacionais (`== != > <`), lógicos (`&& || !`) e de atribuição (`= += -= ...`). A pegadinha
mais comum para quem vem de outras linguagens é a divisão entre inteiros, que sempre trunca o
resultado (descarta a parte decimal), e a confusão entre `=` (atribuição) e `==` (comparação).

## Sintaxe

```c
int a = 10, b = 3;

a + b;   // 13
a - b;   // 7
a * b;   // 30
a / b;   // 3  — divisão entre int trunca o resultado!
a % b;   // 1  — resto da divisão (módulo)

a == b;  // 0 (falso)
a > b;   // 1 (verdadeiro)
```

## Exemplos comentados

```c
#include <stdio.h>

int main(void) {
    int x = 7, y = 2;

    printf("%d\n", x / y);          // 3, não 3.5 — divisão inteira trunca
    printf("%f\n", (float)x / y);   // 3.500000 — cast para float antes de dividir

    // Em C, não existe tipo bool nativo em versões antigas: 0 é falso, qualquer outro valor é verdadeiro
    int verdadeiro = 1;
    int falso = 0;

    // Operadores lógicos
    int idade = 20;
    if (idade >= 18 && idade < 65) {
        printf("Adulto em idade produtiva\n");
    }

    // ATENÇÃO: = é atribuição, == é comparação — trocar um pelo outro é um erro clássico
    int ativo = 1;
    if (ativo == 1) {  // correto: compara
        printf("Está ativo\n");
    }
    // if (ativo = 1) {  // BUG: isso ATRIBUI 1 a ativo (sempre verdadeiro!), não compara

    // Operadores de atribuição compostos
    int contador = 0;
    contador += 5;   // contador = contador + 5
    contador *= 2;    // contador = contador * 2
    contador++;        // incrementa em 1 (equivalente a contador += 1)
    contador--;         // decrementa em 1

    // Operadores bit a bit (bitwise) — comuns em programação de baixo nível
    int flags = 5 & 3;   // AND bit a bit
    int uniao = 5 | 3;    // OR bit a bit
    int deslocado = 1 << 3; // desloca os bits: 1 vira 8

    return 0;
}
```

## Exercício 1: Corrija a divisão

O código abaixo deveria calcular a média de três notas e imprimir com casas decimais, mas sempre
imprime um número inteiro truncado. Identifique o problema e conserte.

```c
int nota1 = 8, nota2 = 7, nota3 = 9;
float media = (nota1 + nota2 + nota3) / 3;
printf("%f\n", media);
```

### Solução

```c
int nota1 = 8, nota2 = 7, nota3 = 9;
float media = (nota1 + nota2 + nota3) / 3.0f;  // 3.0f força divisão de ponto flutuante
printf("%f\n", media);  // 8.000000
```

O problema é que `(nota1 + nota2 + nota3) / 3` é uma divisão entre dois `int` — o resultado já
sai truncado (`24 / 3 = 8`, um int) **antes** de ser atribuído a `media`. Trocar o divisor `3` por
`3.0f` (um `float`) faz com que C promova a divisão inteira para ponto flutuante antes de calcular,
preservando as casas decimais.

## Exercício 2: Encontre o bug de atribuição

O código abaixo sempre imprime `"Acesso permitido"`, mesmo quando `senhaCorreta` é `0`. Identifique
e conserte o bug.

```c
int senhaCorreta = 0;
if (senhaCorreta = 1) {
    printf("Acesso permitido\n");
} else {
    printf("Acesso negado\n");
}
```

### Solução

```c
int senhaCorreta = 0;
if (senhaCorreta == 1) {  // == compara, = atribui
    printf("Acesso permitido\n");
} else {
    printf("Acesso negado\n");
}
```

`senhaCorreta = 1` dentro do `if` é uma **atribuição**, não uma comparação: ela atribui `1` a
`senhaCorreta` e o resultado da expressão de atribuição é o próprio valor atribuído (`1`, que é
"verdadeiro" em C), fazendo o `if` sempre entrar no bloco `true`. Trocar por `==` corrige a
comparação.

## Quiz

### 1. O que `7 / 2` retorna em C, considerando ambos os operandos como `int`?

- [ ] `3.5`
- [x] `3`
- [ ] `4`
- [ ] Um erro de compilação

> A divisão entre dois `int` em C sempre trunca (descarta) a parte decimal do resultado. Para
> obter `3.5`, é preciso que pelo menos um dos operandos seja de ponto flutuante (`float` ou
> `double`), geralmente forçado com um cast como `(float)7 / 2`.

### 2. Qual a diferença entre `=` e `==` em C?

- [ ] Não há diferença, são intercambiáveis
- [x] `=` atribui um valor a uma variável; `==` compara dois valores e retorna verdadeiro/falso
- [ ] `==` só funciona com números
- [ ] `=` só pode ser usado fora de um `if`

> `=` é o operador de atribuição. `==` é o operador de comparação de igualdade. Usar `=` dentro de
> um `if` por engano (`if (x = 1)`) não gera erro de compilação — apenas atribui o valor e avalia
> o resultado como condição, um dos bugs mais clássicos e traiçoeiros de C.

### 3. Em C mais antigo (sem `<stdbool.h>`), como valores booleanos são representados?

- [ ] Com as palavras `true` e `false`, nativamente
- [x] `0` representa falso, e qualquer valor diferente de zero representa verdadeiro
- [ ] C não tem nenhuma forma de representar lógica booleana
- [ ] Apenas com strings `"true"`/`"false"`

> Historicamente, C não tinha um tipo booleano nativo (isso só foi introduzido depois, com
> `<stdbool.h>` a partir do C99). Convencionalmente, qualquer expressão com valor `0` é tratada
> como falsa em um `if`/`while`, e qualquer valor diferente de zero é tratado como verdadeiro.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Operadores" na trilha de C do CodePath. Contexto: o capítulo explica operadores
> aritméticos, relacionais, lógicos, de atribuição e a pegadinha entre = e ==. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
