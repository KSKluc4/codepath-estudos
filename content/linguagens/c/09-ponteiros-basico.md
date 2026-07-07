---
numero: 9
titulo: "Ponteiros básico"
nivel: "intermediario"
objetivo: "Entender endereços de memória e os operadores & e * em C."
duracao: 15
status: "completo"
---

## Conceito

Um ponteiro é uma variável que guarda o **endereço de memória** de outra variável, em vez do valor
em si. É o conceito mais característico de C: entender ponteiros é entender como a linguagem
realmente manipula memória. Dois operadores são centrais: `&` ("endereço de", obtém o endereço de
uma variável) e `*` ("desreferência", acessa o valor guardado naquele endereço).

## Sintaxe

```c
int idade = 28;
int *ponteiro = &idade;   // ponteiro guarda o ENDEREÇO de idade

printf("%d\n", idade);      // 28 — o valor
printf("%p\n", &idade);      // 0x7ffee... — o endereço (formato %p)
printf("%d\n", *ponteiro);    // 28 — desreferencia: pega o valor NO endereço apontado

*ponteiro = 29;               // altera idade INDIRETAMENTE, através do ponteiro
printf("%d\n", idade);         // 29
```

## Exemplos comentados

```c
#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;   // p "aponta para" x

    printf("Valor de x: %d\n", x);           // 10
    printf("Endereço de x: %p\n", (void*)&x);  // algum endereço, ex: 0x7ffee...
    printf("Valor de p (o endereço): %p\n", (void*)p); // mesmo endereço de &x
    printf("Valor apontado por p: %d\n", *p);  // 10 — desreferenciando p

    *p = 20; // modifica x INDIRETAMENTE, através do ponteiro
    printf("Novo valor de x: %d\n", x); // 20

    // Ponteiro nulo: convenção para "não aponta para lugar nenhum"
    int *nulo = NULL;
    // *nulo = 5; // CRASH! desreferenciar um ponteiro nulo é comportamento indefinido

    // O tipo do ponteiro importa: int* aponta para int, char* aponta para char, etc.
    char letra = 'A';
    char *pLetra = &letra;
    printf("%c\n", *pLetra); // 'A'

    // Ponteiro para ponteiro (menos comum, mas existe)
    int **ppX = &p;   // ppX guarda o endereço de p, que guarda o endereço de x
    printf("%d\n", **ppX); // 20 — desreferencia duas vezes

    return 0;
}
```

## Exercício 1: Troque valores com ponteiros

Escreva uma função `void trocar(int *a, int *b)` que troca os valores de duas variáveis usando
ponteiros, e use-a para trocar `x = 5` e `y = 10`.

### Solução

```c
#include <stdio.h>

void trocar(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 5, y = 10;
    trocar(&x, &y);
    printf("x=%d y=%d\n", x, y); // x=10 y=5
    return 0;
}
```

Passar `&x` e `&y` (os endereços) em vez de `x` e `y` diretamente é o que permite à função alterar
as variáveis originais em `main`. Se a função recebesse `int a, int b` (por valor, como no capítulo
de funções), ela só trocaria cópias locais, sem nenhum efeito sobre `x` e `y` de fora.

## Exercício 2: Explique o resultado

Sem rodar o código, diga o que cada `printf` imprime, e explique por quê:

```c
int a = 100;
int *p = &a;
*p = *p + 50;
printf("%d\n", a);
printf("%d\n", *p);
```

### Solução

```c
int a = 100;
int *p = &a;
*p = *p + 50;
printf("%d\n", a);   // 150
printf("%d\n", *p);  // 150
```

`*p = *p + 50` lê o valor atual apontado por `p` (que é `100`, o valor de `a`), soma `50`, e grava
o resultado de volta no MESMO endereço — que é o endereço de `a`. Como `p` continua apontando para
`a`, tanto `a` quanto `*p` refletem o novo valor `150`: são, na prática, "a mesma memória" vista de
duas formas diferentes.

## Quiz

### 1. O que o operador `&` faz quando aplicado a uma variável?

- [ ] Compara dois valores
- [x] Retorna o endereço de memória onde a variável está armazenada
- [ ] Desreferencia um ponteiro
- [ ] Cria uma cópia da variável

> `&variavel` produz o endereço de memória onde aquela variável está guardada — é assim que se
> "pega o endereço" para atribuir a um ponteiro, como em `int *p = &x;`.

### 2. O que `*ponteiro` (desreferência) retorna?

- [ ] O endereço guardado no ponteiro
- [x] O valor armazenado no endereço para o qual o ponteiro aponta
- [ ] Sempre `NULL`
- [ ] O tamanho em bytes do tipo apontado

> O operador `*`, quando aplicado a um ponteiro (não na declaração), "segue" o endereço guardado
> nele e acessa o valor que está lá — permitindo tanto ler (`int y = *p;`) quanto escrever
> (`*p = 10;`) na variável original através do ponteiro.

### 3. Por que desreferenciar um ponteiro `NULL` (`*ponteiro` quando `ponteiro == NULL`) é perigoso?

- [ ] Não é perigoso, C trata isso automaticamente
- [x] `NULL` não é um endereço válido de memória — tentar acessá-lo causa uma falha grave (segmentation fault)
- [ ] Apenas retorna `0` silenciosamente
- [ ] Só é perigoso em sistemas operacionais antigos

> `NULL` é convencionalmente o endereço `0`, usado para indicar "este ponteiro não aponta para
> nada válido". Tentar ler ou escrever nesse endereço não é permitido pelo sistema operacional, e
> geralmente causa uma falha imediata do programa (segmentation fault), em vez de um erro tratável
> como em outras linguagens.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Ponteiros básico" na trilha de C do CodePath. Contexto: o capítulo explica os
> operadores & (endereço) e * (desreferência), e o conceito de ponteiro nulo. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
