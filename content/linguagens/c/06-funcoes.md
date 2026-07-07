---
numero: 6
titulo: "Funções"
nivel: "basico"
objetivo: "Declarar e chamar funções em C, com protótipos e retorno."
duracao: 12
status: "completo"
---

## Conceito

Uma função em C agrupa código reutilizável sob um nome, com um tipo de retorno declarado
explicitamente (ou `void`, se não retorna nada). Diferente de linguagens dinâmicas, C exige que uma
função seja **declarada** (o protótipo) antes de ser usada — se `main` chama uma função definida
mais abaixo no arquivo, o compilador precisa ver o protótipo antes.

## Sintaxe

```c
int somar(int a, int b) {
    return a + b;
}

int main(void) {
    int resultado = somar(2, 3); // 5
    return 0;
}
```

## Exemplos comentados

```c
#include <stdio.h>

// Protótipo: declara a assinatura da função antes de main, mesmo que a
// implementação completa esteja mais abaixo no arquivo
int multiplicar(int a, int b);

int main(void) {
    int resultado = multiplicar(4, 5);
    printf("%d\n", resultado); // 20
    return 0;
}

// Implementação completa (pode vir depois de main, já que o protótipo foi declarado antes)
int multiplicar(int a, int b) {
    return a * b;
}

// void: função que não retorna valor nenhum
void saudar(char nome[]) {
    printf("Olá, %s!\n", nome);
    // sem "return", ou com "return;" sem valor
}

// Argumentos em C são passados POR VALOR: a função recebe uma CÓPIA
void tentarDobrar(int numero) {
    numero = numero * 2; // altera só a cópia local, não a variável original
}

int main2(void) {
    int x = 5;
    tentarDobrar(x);
    printf("%d\n", x); // ainda imprime 5! a função não alterou o x original
    return 0;
}
// Para alterar a variável original, é preciso passar um ponteiro — assunto do
// capítulo "Ponteiros e funções" mais adiante nesta trilha
```

## Exercício 1: Escreva uma função de máximo

Escreva uma função `int maximo(int a, int b)` que retorna o maior entre dois números, e use-a em
`main` para imprimir o maior entre `7` e `12`.

### Solução

```c
#include <stdio.h>

int maximo(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

int main(void) {
    printf("%d\n", maximo(7, 12)); // 12
    return 0;
}
```

A função retorna imediatamente `a` se ele for maior; caso contrário, o fluxo continua até o
`return b`, cobrindo tanto o caso de `b` ser maior quanto o de serem iguais (nesse caso, `b` é
retornado, mas o valor seria o mesmo de qualquer forma).

## Exercício 2: Escreva uma função void que imprime uma tabela

Escreva uma função `void tabuada(int numero)` que imprime a tabuada de `numero` de 1 a 10 (por
exemplo, `"7 x 1 = 7"`, `"7 x 2 = 14"`, etc.), sem retornar nenhum valor.

### Solução

```c
#include <stdio.h>

void tabuada(int numero) {
    for (int i = 1; i <= 10; i++) {
        printf("%d x %d = %d\n", numero, i, numero * i);
    }
}

int main(void) {
    tabuada(7);
    return 0;
}
```

Como a função só imprime valores diretamente (efeito colateral via `printf`) e não precisa devolver
nenhum resultado para quem a chamou, seu tipo de retorno é `void` — e o corpo não usa nenhum
`return` com valor.

## Quiz

### 1. Para que serve o protótipo de uma função em C?

- [ ] É opcional e nunca faz diferença no comportamento
- [x] Declara a assinatura da função antes de usá-la, permitindo que o compilador a valide mesmo se a implementação vier depois no arquivo
- [ ] Substitui completamente a implementação da função
- [ ] Só é necessário para funções `void`

> O compilador de C processa o arquivo de cima para baixo. Se uma função é chamada antes de sua
> definição completa aparecer no código, um protótipo (a assinatura, terminada em `;`) precisa vir
> antes da primeira chamada, para o compilador saber os tipos de parâmetros e retorno esperados.

### 2. Como argumentos são passados para funções em C, por padrão?

- [ ] Por referência, sempre alterando a variável original
- [x] Por valor: a função recebe uma cópia do argumento, e alterá-lo dentro da função não afeta a variável original
- [ ] Depende do compilador usado
- [ ] Apenas ponteiros podem ser passados como argumento

> Em C, passar um argumento comum (não um ponteiro) para uma função cria uma cópia local daquele
> valor dentro da função. Qualquer alteração feita ali dentro fica restrita a essa cópia — a
> variável original, no escopo de quem chamou a função, permanece inalterada.

### 3. O que o tipo de retorno `void` significa em uma função?

- [ ] A função retorna sempre `0`
- [x] A função não retorna nenhum valor
- [ ] A função só pode ser chamada uma vez
- [ ] A função é opcional e pode ser removida pelo compilador

> `void` como tipo de retorno indica que a função não produz nenhum valor para ser usado por quem a
> chamou — ela é executada apenas pelos efeitos colaterais que causa (como imprimir algo na tela),
> e não pode ser usada em uma expressão que espera um valor, como `int x = minhaFuncaoVoid();`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Funções" na trilha de C do CodePath. Contexto: o capítulo explica declaração de
> funções, protótipos, retorno void e a passagem de argumentos por valor. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
