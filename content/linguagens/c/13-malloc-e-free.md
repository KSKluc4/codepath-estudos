---
numero: 13
titulo: "malloc e free"
nivel: "avancado"
objetivo: "Alocar e liberar memória dinamicamente com malloc e free."
duracao: 15
status: "completo"
---

## Conceito

Até agora, todo array tinha tamanho fixo, decidido em tempo de compilação. `malloc` (memory
allocation) permite pedir um bloco de memória em tempo de **execução**, na região chamada *heap* —
útil quando o tamanho necessário só é conhecido durante a execução do programa. Toda memória pedida
com `malloc` precisa, obrigatoriamente, ser devolvida com `free` quando não for mais usada, ou o
programa "vaza" memória (memory leak).

## Sintaxe

```c
#include <stdlib.h>

int *numeros = malloc(5 * sizeof(int)); // pede espaço para 5 ints
if (numeros == NULL) {
    // malloc pode falhar (memória insuficiente) e retorna NULL nesse caso
}

numeros[0] = 10; // usa como um array normal

free(numeros);     // devolve a memória ao sistema quando não precisar mais
numeros = NULL;      // boa prática: evita usar o ponteiro por engano depois do free
```

## Exemplos comentados

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int tamanho;
    printf("Quantos números? ");
    scanf("%d", &tamanho);

    // Array de tamanho DEFINIDO EM TEMPO DE EXECUÇÃO — impossível com array normal
    int *numeros = malloc(tamanho * sizeof(int));
    if (numeros == NULL) {
        printf("Falha ao alocar memória\n");
        return 1;
    }

    for (int i = 0; i < tamanho; i++) {
        numeros[i] = i * i;
    }

    for (int i = 0; i < tamanho; i++) {
        printf("%d ", numeros[i]);
    }
    printf("\n");

    free(numeros); // devolve a memória
    numeros = NULL;

    // calloc: como malloc, mas já inicializa tudo com zero
    int *zeros = calloc(5, sizeof(int)); // 5 ints, todos = 0
    free(zeros);

    // realloc: redimensiona um bloco já alocado (pode mover para outro endereço!)
    int *lista = malloc(3 * sizeof(int));
    lista = realloc(lista, 6 * sizeof(int)); // agora cabem 6 ints
    free(lista);

    // ERRO CLÁSSICO 1: usar depois de liberar (use-after-free)
    // int *p = malloc(sizeof(int));
    // free(p);
    // *p = 5; // comportamento indefinido!

    // ERRO CLÁSSICO 2: esquecer de liberar (memory leak)
    // int *vazamento = malloc(sizeof(int)); // nunca chamado free() nele

    // ERRO CLÁSSICO 3: liberar duas vezes (double free)
    // int *q = malloc(sizeof(int));
    // free(q);
    // free(q); // comportamento indefinido!

    return 0;
}
```

## Exercício 1: Aloque um array dinamicamente

Escreva um programa que aloca um array de `n = 5` inteiros com `malloc`, preenche com os quadrados
de 0 a 4 (`0, 1, 4, 9, 16`), imprime todos, e libera a memória corretamente ao final.

### Solução

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *quadrados = malloc(n * sizeof(int));

    if (quadrados == NULL) {
        return 1;
    }

    for (int i = 0; i < n; i++) {
        quadrados[i] = i * i;
    }

    for (int i = 0; i < n; i++) {
        printf("%d ", quadrados[i]); // 0 1 4 9 16
    }
    printf("\n");

    free(quadrados);
    return 0;
}
```

Sempre checar se `malloc` retornou `NULL` antes de usar o ponteiro é uma boa prática — em sistemas
com pouca memória disponível, a alocação pode falhar, e usar um ponteiro `NULL` como se fosse um
array válido causaria uma falha grave.

## Exercício 2: Identifique o vazamento de memória

O código abaixo tem um vazamento de memória (memory leak). Identifique e conserte.

```c
void processar(int tamanho) {
    int *dados = malloc(tamanho * sizeof(int));
    for (int i = 0; i < tamanho; i++) {
        dados[i] = i;
    }
    printf("Processamento concluído\n");
    // função termina aqui, sem liberar "dados"
}
```

### Solução

```c
void processar(int tamanho) {
    int *dados = malloc(tamanho * sizeof(int));
    for (int i = 0; i < tamanho; i++) {
        dados[i] = i;
    }
    printf("Processamento concluído\n");
    free(dados); // libera antes de a função terminar
}
```

Quando a função `processar` termina sem chamar `free(dados)`, o ponteiro local `dados` deixa de
existir (sai de escopo), mas a memória que ele apontava no heap continua "reservada" — não há mais
nenhuma forma de acessá-la ou liberá-la depois, um vazamento permanente enquanto o programa
continuar rodando. Toda alocação com `malloc`/`calloc`/`realloc` precisa de um `free`
correspondente antes que o último ponteiro para ela deixe de existir.

## Quiz

### 1. Qual a principal diferença entre um array normal e memória alocada com `malloc`?

- [ ] Não há diferença nenhuma
- [x] `malloc` permite definir o tamanho em tempo de execução, e a memória fica na heap até ser liberada explicitamente com `free`
- [ ] `malloc` só funciona com números
- [ ] Arrays normais também precisam de `free`

> Arrays declarados normalmente (`int arr[10]`) têm tamanho fixo definido em tempo de compilação, e
> vivem na stack, sendo liberados automaticamente quando saem de escopo. Memória alocada com
> `malloc` fica na heap, pode ter tamanho decidido durante a execução, e precisa ser liberada
> manualmente com `free` — o sistema nunca faz isso sozinho.

### 2. O que acontece se você esquecer de chamar `free()` em memória alocada com `malloc`?

- [ ] O programa não compila
- [x] Ocorre um vazamento de memória (memory leak): aquele espaço fica ocupado até o programa terminar
- [ ] A memória é liberada automaticamente após 1 segundo
- [ ] `malloc` já libera a memória sozinho ao final da função

> Diferente de variáveis na stack, memória alocada na heap com `malloc` não é liberada
> automaticamente quando o ponteiro que a referenciava sai de escopo. Se nenhum `free`
> correspondente for chamado antes de perder a última referência ao endereço, essa memória fica
> "presa" (vazada) até o processo inteiro terminar.

### 3. Por que usar um ponteiro depois de chamar `free()` nele é perigoso (use-after-free)?

- [ ] Não é perigoso, C permite reutilizar o ponteiro livremente depois
- [x] A memória apontada já foi devolvida ao sistema e pode ser reaproveitada para outra coisa, tornando o acesso imprevisível
- [ ] `free()` sempre trava o programa imediatamente
- [ ] Só é perigoso se o ponteiro apontar para uma struct

> Depois de `free(p)`, o endereço que `p` guardava pode ser reutilizado pelo sistema para qualquer
> outra alocação futura. Continuar lendo ou escrevendo através de `p` (sem redefini-lo) é
> comportamento indefinido: pode "parecer funcionar" às vezes, corromper dados de outra parte do
> programa, ou travar — por isso a boa prática de atribuir `p = NULL;` logo após o `free`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "malloc e free" na trilha de C do CodePath. Contexto: o capítulo explica alocação
> dinâmica de memória com malloc/calloc/realloc, e os erros comuns como memory leak, use-after-free
> e double free. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
