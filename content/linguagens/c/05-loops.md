---
numero: 5
titulo: "Loops"
nivel: "basico"
objetivo: "Repetir instruções com for, while e do-while em C."
duracao: 10
status: "completo"
---

## Conceito

C tem três formas de loop: `for` (ideal quando se sabe o número de repetições), `while` (repete
enquanto uma condição for verdadeira, testada antes de cada iteração) e `do-while` (igual ao
`while`, mas testa a condição **depois** de cada iteração, garantindo que o corpo rode pelo menos
uma vez).

## Sintaxe

```c
for (int i = 0; i < 5; i++) {
    printf("%d\n", i);
}

int contador = 0;
while (contador < 5) {
    printf("%d\n", contador);
    contador++;
}

int n = 0;
do {
    printf("%d\n", n);
    n++;
} while (n < 5);
```

## Exemplos comentados

```c
#include <stdio.h>

int main(void) {
    // for tem três partes: inicialização; condição; incremento
    for (int i = 0; i < 10; i += 2) {
        printf("%d ", i); // 0 2 4 6 8
    }
    printf("\n");

    // break interrompe o loop imediatamente
    for (int i = 0; i < 100; i++) {
        if (i == 5) break;
        printf("%d ", i); // 0 1 2 3 4
    }
    printf("\n");

    // continue pula para a próxima iteração
    for (int i = 0; i < 6; i++) {
        if (i % 2 == 0) continue;
        printf("%d ", i); // 1 3 5
    }
    printf("\n");

    // while: útil quando o número de iterações não é conhecido de antemão
    int valor = 100;
    int divisoes = 0;
    while (valor > 1) {
        valor /= 2;
        divisoes++;
    }
    printf("Divisões: %d\n", divisoes);

    // do-while: sempre roda pelo menos uma vez, mesmo que a condição já comece falsa
    int x = 10;
    do {
        printf("x vale %d\n", x); // roda uma vez, mesmo com x=10 e condição x<5
        x++;
    } while (x < 5);

    // Loops aninhados: comum para percorrer estruturas bidimensionais
    for (int linha = 0; linha < 3; linha++) {
        for (int coluna = 0; coluna < 3; coluna++) {
            printf("(%d,%d) ", linha, coluna);
        }
    }
    printf("\n");

    return 0;
}
```

## Exercício 1: Some os números de 1 a 100

Escreva um programa C que usa um `for` para calcular a soma de todos os inteiros de 1 a 100
(inclusive), e imprime o resultado.

### Solução

```c
#include <stdio.h>

int main(void) {
    int soma = 0;
    for (int i = 1; i <= 100; i++) {
        soma += i;
    }
    printf("%d\n", soma); // 5050
    return 0;
}
```

O `for` percorre `i` de `1` até `100` inclusive (por isso a condição é `i <= 100`, não `i < 100`),
acumulando cada valor em `soma`. É o mesmo raciocínio de `range(1, 101)` em Python, só que a
condição de parada é escrita explicitamente em vez de embutida em uma função `range`.

## Exercício 2: Verifique se um número é primo

Escreva uma função que usa um `for` para verificar se `numero = 29` é primo (divisível apenas por 1
e por ele mesmo), imprimindo `"Primo"` ou `"Não é primo"`.

### Solução

```c
#include <stdio.h>

int main(void) {
    int numero = 29;
    int ehPrimo = 1; // assume que é primo até provar o contrário

    if (numero < 2) {
        ehPrimo = 0;
    } else {
        for (int i = 2; i < numero; i++) {
            if (numero % i == 0) {
                ehPrimo = 0;
                break; // já encontrou um divisor, não precisa continuar checando
            }
        }
    }

    printf(ehPrimo ? "Primo\n" : "Não é primo\n");
    return 0;
}
```

A estratégia é testar se algum número entre `2` e `numero - 1` divide `numero` sem deixar resto
(`numero % i == 0`). Assim que um divisor é encontrado, `break` interrompe o loop imediatamente —
não há necessidade de continuar testando, já que basta UM divisor para provar que o número não é
primo.

## Quiz

### 1. Qual a principal diferença entre `while` e `do-while`?

- [ ] Não há diferença nenhuma
- [x] `while` testa a condição antes de cada iteração; `do-while` testa depois, garantindo pelo menos uma execução
- [ ] `do-while` não pode usar `break`
- [ ] `while` só funciona com números

> `while` pode não executar nenhuma vez, se a condição já começar falsa. `do-while` sempre executa
> o corpo do loop pelo menos uma vez, pois a condição só é avaliada depois da primeira execução.

### 2. O que a segunda parte de um `for (inicializacao; condicao; incremento)` representa?

- [ ] O valor inicial da variável de controle
- [x] A condição testada antes de CADA iteração — o loop continua enquanto ela for verdadeira
- [ ] Quantas vezes o loop vai rodar, exatamente
- [ ] O incremento aplicado à variável a cada volta

> As três partes do `for` são: inicialização (roda uma vez, no início), condição (testada antes de
> cada iteração — o loop para quando ela for falsa) e incremento (roda ao final de cada iteração).

### 3. Qual a diferença entre `break` e `continue` dentro de um loop?

- [ ] São sinônimos em C
- [x] `break` encerra o loop inteiro; `continue` pula apenas a iteração atual e segue para a próxima
- [ ] `continue` encerra o loop; `break` pula a iteração
- [ ] Ambos encerram o programa inteiro

> `break` interrompe o loop imediatamente, sem executar mais nenhuma iteração. `continue` pula
> apenas o restante do código da iteração atual, indo direto para a checagem da condição (ou o
> incremento, no caso do `for`) da próxima volta.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Loops" na trilha de C do CodePath. Contexto: o capítulo explica for, while,
> do-while, break e continue. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
