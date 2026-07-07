---
numero: 17
titulo: "Erros comuns e debugging"
nivel: "avancado"
objetivo: "Reconhecer e depurar os erros mais comuns de C: segfaults e vazamentos."
duracao: 12
status: "completo"
---

## Conceito

C não tem "rede de segurança": não há checagem automática de limites de array, coleta de lixo, nem
exceções para a maioria dos erros de memória. Isso torna alguns bugs — especialmente relacionados a
ponteiros e memória — silenciosos ou catastróficos (segmentation fault). Reconhecer os padrões mais
comuns desses erros é uma habilidade central para programar em C com confiança.

## Sintaxe

```bash
# Compilar com avisos ativados (sempre faça isso!)
gcc -Wall -Wextra programa.c -o programa

# Compilar com informações de debug para usar com um debugger (gdb)
gcc -g programa.c -o programa
gdb ./programa

# Valgrind detecta vazamentos e acessos inválidos de memória em tempo de execução
valgrind ./programa
```

## Exemplos comentados

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // ERRO 1: Segmentation fault por ponteiro nulo
    int *p = NULL;
    // printf("%d\n", *p); // crash: desreferenciar NULL

    // ERRO 2: Acesso fora dos limites do array (buffer overflow)
    int numeros[5] = {1, 2, 3, 4, 5};
    // numeros[10] = 99; // comportamento indefinido, sem erro imediato

    // ERRO 3: Variável não inicializada — contém "lixo" de memória
    int x;
    // printf("%d\n", x); // valor imprevisível, pode variar a cada execução

    // ERRO 4: Vazamento de memória (memory leak)
    int *vazamento = malloc(sizeof(int));
    // esqueceu de chamar free(vazamento)

    // ERRO 5: Use-after-free
    int *ptr = malloc(sizeof(int));
    free(ptr);
    // *ptr = 5; // comportamento indefinido, memória já foi devolvida

    // ERRO 6: Confundir = com == (visto no capítulo de operadores)
    int ativo = 0;
    // if (ativo = 1) { ... } // sempre "verdadeiro", bug de atribuição

    // ERRO 7: Comparar strings com == em vez de strcmp
    char a[] = "teste";
    char b[] = "teste";
    // if (a == b) { ... } // compara ENDEREÇOS, quase sempre falso

    // ERRO 8: Off-by-one em loops
    int arr[5] = {1, 2, 3, 4, 5};
    // for (int i = 0; i <= 5; i++) { arr[i]; } // deveria ser i < 5, não i <= 5

    return 0;
}
```

## Exercício 1: Encontre o bug de off-by-one

O código abaixo causa comportamento indefinido. Identifique o erro e conserte.

```c
int notas[5] = {8, 7, 9, 6, 10};
int soma = 0;
for (int i = 0; i <= 5; i++) {
    soma += notas[i];
}
```

### Solução

```c
int notas[5] = {8, 7, 9, 6, 10};
int soma = 0;
for (int i = 0; i < 5; i++) {  // < em vez de <=
    soma += notas[i];
}
```

Com `i <= 5`, o loop tenta acessar `notas[5]`, que está **fora** do array (índices válidos vão de
`0` a `4` para um array de tamanho 5) — um erro clássico chamado "off-by-one" (um a mais/a menos do
que deveria). Trocar para `i < 5` corrige o limite superior do loop.

## Exercício 2: Diagnostique um segmentation fault

O código abaixo trava com segmentation fault. Identifique a causa.

```c
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

int main(void) {
    struct No *cabeca = NULL;
    cabeca->valor = 10; // trava aqui
    return 0;
}
```

### Solução

```c
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

int main(void) {
    struct No *cabeca = malloc(sizeof(struct No)); // aloca memória de verdade primeiro
    cabeca->valor = 10; // agora funciona
    cabeca->proximo = NULL;
    free(cabeca);
    return 0;
}
```

`cabeca` foi declarado como `NULL` (não aponta para nenhuma memória válida), mas o código tenta
acessar `cabeca->valor` como se já existisse uma struct alocada naquele "endereço" — como `NULL`
não é um endereço válido, o sistema operacional interrompe o programa imediatamente com
segmentation fault. É preciso alocar memória de verdade (com `malloc`) antes de acessar campos
através do ponteiro.

## Quiz

### 1. O que causa um "segmentation fault" na maioria das vezes?

- [ ] Um erro de sintaxe no código
- [x] O programa tenta acessar uma região de memória que não tem permissão de acessar (como através de um ponteiro nulo ou inválido)
- [ ] O programa demorou demais para executar
- [ ] Falta de comentários no código

> Segmentation fault ocorre quando o programa tenta ler ou escrever em um endereço de memória fora
> das regiões que o sistema operacional concedeu a ele — o caso mais comum é desreferenciar um
> ponteiro `NULL` ou um ponteiro "solto" (já liberado, ou nunca inicializado corretamente).

### 2. Por que uma flag como `-Wall` ao compilar com gcc é recomendada?

- [ ] Ela corrige os bugs automaticamente
- [x] Ativa avisos (warnings) do compilador que apontam padrões suspeitos, como variáveis não usadas ou possíveis erros de tipo
- [ ] Deixa o programa compilado mais rápido
- [ ] É obrigatória, sem ela o código não compila

> `-Wall` (e `-Wextra`) fazem o compilador avisar sobre construções suspeitas que, embora
> tecnicamente válidas, costumam indicar bugs — como comparações entre tipos incompatíveis,
> variáveis declaradas e nunca usadas, ou funções sem `return` em todos os caminhos. Vale sempre
> compilar com esses avisos ativados e tratá-los como pistas a investigar.

### 3. Para que serve uma ferramenta como o Valgrind?

- [ ] Para formatar automaticamente o código C
- [x] Para detectar em tempo de execução vazamentos de memória e acessos inválidos que o compilador não consegue prever
- [ ] Para acelerar a compilação
- [ ] É um editor de texto especializado em C

> Valgrind roda o programa compilado sob um ambiente monitorado, detectando problemas que só se
> manifestam durante a execução real: memória alocada e nunca liberada (leaks), acessos fora dos
> limites de um array, uso de memória após `free`, entre outros — problemas que o compilador,
> analisando o código estaticamente, não consegue sempre identificar sozinho.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Erros comuns e debugging" na trilha de C do CodePath. Contexto: o capítulo
> explica segmentation faults, off-by-one, memory leaks, use-after-free e ferramentas como -Wall e
> Valgrind. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
