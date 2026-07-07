---
numero: 10
titulo: "Ponteiros e arrays"
nivel: "intermediario"
objetivo: "Ver a relação entre ponteiros e arrays na memória."
duracao: 15
status: "completo"
---

## Conceito

Em C, o nome de um array, na maioria dos contextos, "decai" (decay) para um ponteiro para seu
primeiro elemento. Isso significa que arrays e ponteiros são intimamente relacionados: acessar
`array[i]` é, internamente, equivalente a `*(array + i)` — aritmética de ponteiros somada à
desreferência.

## Sintaxe

```c
int numeros[] = {10, 20, 30};
int *p = numeros;  // "numeros" decai para um ponteiro ao primeiro elemento

printf("%d\n", numeros[0]);  // 10
printf("%d\n", *p);           // 10 — mesma coisa
printf("%d\n", *(p + 1));      // 20 — aritmética de ponteiro
printf("%d\n", p[1]);           // 20 — ponteiros também aceitam notação de colchetes
```

## Exemplos comentados

```c
#include <stdio.h>

int main(void) {
    int valores[] = {5, 10, 15, 20};
    int *p = valores;

    // Essas quatro formas são EQUIVALENTES:
    printf("%d\n", valores[2]);    // 15
    printf("%d\n", *(valores + 2)); // 15
    printf("%d\n", p[2]);           // 15
    printf("%d\n", *(p + 2));        // 15

    // Percorrendo um array via aritmética de ponteiros
    for (int i = 0; i < 4; i++) {
        printf("%d ", *(p + i));
    }
    printf("\n");

    // p++ avança o ponteiro para o PRÓXIMO elemento (soma sizeof(int), não 1 byte!)
    int *cursor = valores;
    printf("%d\n", *cursor);   // 5
    cursor++;
    printf("%d\n", *cursor);   // 10 — avançou um "passo" do tipo int

    // IMPORTANTE: array e ponteiro não são EXATAMENTE a mesma coisa
    printf("%zu\n", sizeof(valores));  // tamanho do array INTEIRO (4 * sizeof(int))
    printf("%zu\n", sizeof(p));         // tamanho de UM ponteiro (geralmente 8 bytes)

    // Passar um array para uma função: ele decai para ponteiro, perdendo o tamanho original
    // void funcao(int arr[]) { sizeof(arr) aqui daria o tamanho do PONTEIRO, não do array }

    return 0;
}
```

## Exercício 1: Percorra um array só com ponteiros

Escreva um programa que soma todos os elementos de `int valores[] = {2, 4, 6, 8, 10};` usando
apenas aritmética de ponteiros (sem usar `valores[i]`).

### Solução

```c
#include <stdio.h>

int main(void) {
    int valores[] = {2, 4, 6, 8, 10};
    int tamanho = sizeof(valores) / sizeof(valores[0]);
    int soma = 0;

    int *p = valores;
    for (int i = 0; i < tamanho; i++) {
        soma += *(p + i);
    }

    printf("%d\n", soma); // 30
    return 0;
}
```

`*(p + i)` acessa o elemento na posição `i` a partir do endereço base `p`, exatamente como
`valores[i]` faria — na verdade, o compilador traduz `valores[i]` internamente para essa mesma
expressão de aritmética de ponteiros.

## Exercício 2: Escreva uma função que recebe um array

Escreva uma função `int somarArray(int *arr, int tamanho)` que recebe um ponteiro e o tamanho do
array (já que o tamanho não pode ser calculado com `sizeof` dentro da função), e retorna a soma dos
elementos.

### Solução

```c
#include <stdio.h>

int somarArray(int *arr, int tamanho) {
    int soma = 0;
    for (int i = 0; i < tamanho; i++) {
        soma += arr[i]; // notação de colchetes também funciona em ponteiros
    }
    return soma;
}

int main(void) {
    int numeros[] = {1, 2, 3, 4, 5};
    int tamanho = sizeof(numeros) / sizeof(numeros[0]);
    printf("%d\n", somarArray(numeros, tamanho)); // 15
    return 0;
}
```

Como arrays decaem para ponteiros ao serem passados para funções, `sizeof(arr)` DENTRO da função
retornaria apenas o tamanho de um ponteiro (geralmente 8 bytes), não o tamanho real do array
original — por isso é necessário passar o `tamanho` explicitamente como um segundo parâmetro, um
padrão extremamente comum em código C.

## Quiz

### 1. O que significa dizer que um array "decai" para ponteiro?

- [ ] O array perde seus valores
- [x] Na maioria dos contextos, o nome do array é automaticamente tratado como um ponteiro para seu primeiro elemento
- [ ] O array é convertido para uma string
- [ ] É um erro de compilação

> Quando um array é usado em uma expressão (como argumento de função, ou em aritmética), ele
> "decai" para um ponteiro apontando para seu primeiro elemento — é por isso que `array` e `&array[0]`
> produzem o mesmo endereço.

### 2. Por que `sizeof` se comporta diferente dentro de uma função que recebe um array como parâmetro?

- [ ] `sizeof` não funciona dentro de funções
- [x] O array decai para ponteiro ao ser passado, então `sizeof` retorna o tamanho do ponteiro, não do array original
- [ ] `sizeof` retorna sempre o mesmo valor, não importa o contexto
- [ ] É necessário usar uma sintaxe diferente de `sizeof` dentro de funções

> Fora da função, `sizeof(array)` conhece o tamanho total do array porque o compilador ainda "vê"
> o tipo array completo. Dentro da função, o parâmetro já é efetivamente um ponteiro (mesmo
> declarado como `int arr[]`), então `sizeof(arr)` retorna o tamanho de um ponteiro — por isso o
> tamanho precisa ser passado explicitamente como argumento extra.

### 3. O que `cursor++` faz quando `cursor` é um ponteiro para `int`?

- [ ] Avança exatamente 1 byte na memória
- [x] Avança `sizeof(int)` bytes na memória, movendo para o PRÓXIMO elemento int, não o próximo byte
- [ ] Lança um erro
- [ ] Reinicia o ponteiro para o início do array

> Aritmética de ponteiros é "consciente do tipo": incrementar um ponteiro avança pelo tamanho do
> tipo apontado, não por 1 byte fixo. Para um `int *` (geralmente 4 bytes), `cursor++` move o
> ponteiro 4 bytes adiante, alinhando exatamente com o próximo elemento `int` do array.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Ponteiros e arrays" na trilha de C do CodePath. Contexto: o capítulo explica como
> arrays decaem para ponteiros, aritmética de ponteiros e a passagem de arrays para funções. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
