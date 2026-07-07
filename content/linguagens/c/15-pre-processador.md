---
numero: 15
titulo: "Pré-processador"
nivel: "avancado"
objetivo: "Usar diretivas de pré-processador como #define e #ifdef."
duracao: 10
status: "completo"
---

## Conceito

O pré-processador roda **antes** da compilação de verdade: ele processa linhas que começam com `#`
(diretivas), fazendo substituições textuais e inclusões de arquivo. É uma etapa de manipulação de
texto puro, sem entender a linguagem C — por isso macros de pré-processador podem ser poderosas,
mas também fonte de bugs sutis se usadas sem cuidado.

## Sintaxe

```c
#define PI 3.14159            // constante de texto: toda ocorrência de PI vira 3.14159
#define DOBRO(x) ((x) * 2)     // macro com "parâmetro"

#ifdef DEBUG
    printf("Modo debug ativo\n");
#endif
```

## Exemplos comentados

```c
#include <stdio.h>

#define MAX_USUARIOS 100          // constante simbólica
#define QUADRADO(x) ((x) * (x))    // macro "função" — cuidado com parênteses!

// Sem os parênteses extras, QUADRADO(2 + 3) viraria "2 + 3 * 2 + 3" = 11, errado!
// Com parênteses: ((2 + 3) * (2 + 3)) = 25, correto

int main(void) {
    printf("%d\n", MAX_USUARIOS);       // 100 (substituído em tempo de pré-processamento)
    printf("%d\n", QUADRADO(5));         // 25
    printf("%d\n", QUADRADO(2 + 3));      // 25, graças aos parênteses na macro

    return 0;
}

// Compilação condicional: útil para código específico de plataforma ou modo debug
#define DEBUG

#ifdef DEBUG
    // este bloco só é compilado se DEBUG estiver definido
    #define LOG(msg) printf("[DEBUG] %s\n", msg)
#else
    #define LOG(msg) // vira "nada": desaparece completamente do código compilado
#endif

// include guards: evitam que um header seja incluído mais de uma vez no mesmo arquivo
// (visto com mais detalhe no próximo capítulo, sobre headers)
#ifndef MEU_HEADER_H
#define MEU_HEADER_H
// conteúdo do header aqui
#endif

// Macros condicionais também são usadas para código específico de sistema operacional
#ifdef _WIN32
    // código específico do Windows
#elif __linux__
    // código específico do Linux
#endif
```

## Exercício 1: Escreva uma macro segura

Escreva uma macro `#define MAIOR(a, b)` que retorna o maior entre dois valores, com parênteses
suficientes para funcionar corretamente mesmo com expressões como `MAIOR(x + 1, y + 2)`.

### Solução

```c
#include <stdio.h>

#define MAIOR(a, b) ((a) > (b) ? (a) : (b))

int main(void) {
    int x = 3, y = 7;
    printf("%d\n", MAIOR(x, y));            // 7
    printf("%d\n", MAIOR(x + 1, y + 2));     // 9, calculado corretamente
    return 0;
}
```

Cada ocorrência de `a` e `b` no corpo da macro está envolvida em parênteses próprios — isso evita
que a substituição textual quebre a precedência de operadores quando expressões (não apenas
valores simples) são passadas como argumento. Sem esses parênteses, `MAIOR(x + 1, y + 2)` viraria
algo como `x + 1 > y + 2 ? x + 1 : y + 2` sem os agrupamentos certos, o que ainda funcionaria nesse
caso simples, mas quebraria com operadores de menor precedência misturados.

## Exercício 2: Compilação condicional

Escreva um programa com uma macro `MODO_DEBUG` (definida ou não via `#define`) que, se definida,
imprime `"Rodando em modo debug"` antes do restante do programa, usando `#ifdef`.

### Solução

```c
#include <stdio.h>

#define MODO_DEBUG

int main(void) {
#ifdef MODO_DEBUG
    printf("Rodando em modo debug\n");
#endif

    printf("Programa em execução normalmente\n");
    return 0;
}
```

Comentando (ou removendo) a linha `#define MODO_DEBUG`, o bloco `#ifdef MODO_DEBUG ... #endif`
inteiro é descartado pelo pré-processador antes mesmo da compilação — o `printf` de debug nem chega
a existir no binário final, sem custo de performance nenhum em tempo de execução.

## Quiz

### 1. Quando o pré-processador processa as diretivas `#define`, `#include` e `#ifdef`?

- [ ] Durante a execução do programa
- [x] Antes da compilação propriamente dita, como uma etapa de substituição textual
- [ ] Depois que o programa já foi compilado
- [ ] Apenas quando há um erro de sintaxe

> O pré-processador é uma etapa separada, que roda antes do compilador de fato traduzir o código
> C para instruções de máquina. Ele processa diretivas (`#...`) fazendo substituições de texto puro
> — sem entender gramática ou tipos de C.

### 2. Por que `#define QUADRADO(x) x * x` (sem parênteses extras) é perigoso?

- [ ] Não é perigoso, funciona sempre corretamente
- [x] A substituição textual pode quebrar a precedência de operadores quando uma expressão é passada como argumento
- [ ] Macros sem parênteses não compilam
- [ ] `x * x` só funciona com números pares

> Como o pré-processador só faz substituição de texto, `QUADRADO(2 + 3)` viraria literalmente
> `2 + 3 * 2 + 3`, que por precedência de operadores calcula `2 + 6 + 3 = 11`, não `25` como
> esperado. Envolver cada parâmetro (e a expressão inteira) em parênteses evita esse problema.

### 3. Para que serve `#ifdef` combinado com `#define`?

- [ ] Para declarar variáveis condicionalmente em tempo de execução
- [x] Para incluir ou excluir blocos inteiros de código da compilação, dependendo se uma macro está definida
- [ ] Para substituir `if` comuns dentro de funções
- [ ] `#ifdef` não existe em C, apenas em C++

> `#ifdef NOME` verifica se `NOME` foi definido (via `#define`) antes daquele ponto do arquivo. Se
> não estiver, o bloco de código entre `#ifdef` e `#endif` (ou `#else`) é completamente removido
> antes mesmo da compilação — muito usado para código de debug, específico de plataforma, ou
> include guards.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Pré-processador" na trilha de C do CodePath. Contexto: o capítulo explica
> #define, macros com parâmetros e compilação condicional com #ifdef/#ifndef. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
