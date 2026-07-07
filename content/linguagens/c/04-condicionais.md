---
numero: 4
titulo: "Condicionais"
nivel: "basico"
objetivo: "Controlar o fluxo com if, else e switch em C."
duracao: 10
status: "completo"
---

## Conceito

C usa `if`/`else if`/`else`, assim como a maioria das linguagens, com blocos delimitados por chaves
`{}`. Também tem `switch`, útil quando há várias comparações contra o mesmo valor — mas com um
detalhe importante: sem `break`, a execução "cai" (fall-through) para o próximo `case`
automaticamente.

## Sintaxe

```c
int idade = 20;

if (idade < 12) {
    printf("Criança\n");
} else if (idade < 18) {
    printf("Adolescente\n");
} else {
    printf("Adulto\n");
}
```

## Exemplos comentados

```c
#include <stdio.h>

int main(void) {
    int nota = 75;

    if (nota >= 90) {
        printf("A\n");
    } else if (nota >= 70) {
        printf("B\n");
    } else if (nota >= 50) {
        printf("C\n");
    } else {
        printf("D\n");
    }

    // Operador ternário: forma compacta de um if/else que retorna um valor
    int idade = 20;
    const char *status = (idade >= 18) ? "adulto" : "menor";
    printf("%s\n", status);

    // switch: útil para comparar contra vários valores inteiros/char específicos
    int diaDaSemana = 3;
    switch (diaDaSemana) {
        case 1:
            printf("Domingo\n");
            break;      // sem break, cairia (fall-through) para o próximo case!
        case 2:
            printf("Segunda\n");
            break;
        case 3:
            printf("Terça\n");
            break;
        default:
            printf("Dia inválido\n");
    }

    // Fall-through intencional: agrupar vários cases para o mesmo resultado
    char nota2 = 'B';
    switch (nota2) {
        case 'A':
        case 'B':
            printf("Aprovado com destaque\n"); // A e B caem no mesmo bloco
            break;
        case 'C':
            printf("Aprovado\n");
            break;
        default:
            printf("Reprovado\n");
    }

    return 0;
}
```

## Exercício 1: Classifique um triângulo

Escreva um programa que, dados três lados `a = 5`, `b = 5`, `c = 5`, imprime `"Equilátero"` se os
três lados forem iguais, `"Isósceles"` se exatamente dois forem iguais, ou `"Escaleno"` se todos
forem diferentes.

### Solução

```c
#include <stdio.h>

int main(void) {
    int a = 5, b = 5, c = 5;

    if (a == b && b == c) {
        printf("Equilátero\n");
    } else if (a == b || b == c || a == c) {
        printf("Isósceles\n");
    } else {
        printf("Escaleno\n");
    }

    return 0;
}
```

A ordem das checagens importa: primeiro verifica se TODOS os lados são iguais (caso mais
específico), e só depois verifica se PELO MENOS UM PAR é igual — se a ordem fosse invertida, um
triângulo equilátero seria erroneamente classificado como isósceles na primeira condição
verdadeira encontrada.

## Exercício 2: Conserte o fall-through indesejado

O código abaixo deveria imprimir apenas `"Segunda"` quando `dia = 2`, mas imprime `"Segunda"` E
`"Terça"`. Identifique e conserte o bug.

```c
int dia = 2;
switch (dia) {
    case 1:
        printf("Domingo\n");
    case 2:
        printf("Segunda\n");
    case 3:
        printf("Terça\n");
    default:
        printf("Outro dia\n");
}
```

### Solução

```c
int dia = 2;
switch (dia) {
    case 1:
        printf("Domingo\n");
        break;
    case 2:
        printf("Segunda\n");
        break;
    case 3:
        printf("Terça\n");
        break;
    default:
        printf("Outro dia\n");
}
```

Sem `break` ao final de cada `case`, a execução continua ("cai") para os `case`s seguintes
automaticamente, até encontrar um `break` ou chegar ao fim do `switch` — por isso o código original
imprimia todos os casos a partir do que combinou. Adicionar `break` em cada `case` isola a execução
apenas ao bloco correspondente.

## Quiz

### 1. O que acontece se um `case` de um `switch` não tiver `break`?

- [ ] O programa não compila
- [x] A execução "cai" (fall-through) automaticamente para o próximo `case`, executando-o também
- [ ] O `switch` inteiro é ignorado
- [ ] É equivalente a ter um `break`

> Diferente de linguagens como Python (que não tem switch tradicional) ou algumas outras que
> exigem `break` implícito, em C a ausência de `break` faz a execução continuar para o próximo
> `case`, mesmo que sua condição não bata — um comportamento chamado fall-through.

### 2. Qual a vantagem do operador ternário `condicao ? valorSeVerdadeiro : valorSeFalso`?

- [ ] Só funciona com números
- [x] Permite escrever um if/else compacto que retorna diretamente um valor, em uma expressão
- [ ] É mais rápido de executar que um if/else normal
- [ ] Substitui totalmente a necessidade de switch

> O operador ternário condensa um `if/else` simples em uma única expressão que produz um valor,
> útil para atribuições condicionais diretas, como escolher entre duas strings, sem precisar do
> bloco completo de `if/else`.

### 3. Por que agrupar `case 'A':` e `case 'B':` sem `break` entre eles pode ser intencional?

- [ ] Nunca é intencional, é sempre um bug
- [x] Para que ambos os casos executem o mesmo bloco de código (fall-through proposital)
- [ ] Porque `switch` exige pelo menos dois `case`s vazios
- [ ] Para desativar o `default`

> Colocar múltiplos `case`s em sequência, sem código entre eles, é uma forma comum e válida de
> agrupar vários valores que devem levar ao mesmo resultado — o fall-through só se torna "bug"
> quando ele ocorre de forma não intencional, deixando de isolar blocos que deveriam ser separados.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Condicionais" na trilha de C do CodePath. Contexto: o capítulo explica if/else,
> o operador ternário e switch/case, incluindo o comportamento de fall-through. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
