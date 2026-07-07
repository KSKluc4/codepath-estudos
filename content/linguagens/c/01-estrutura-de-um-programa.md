---
numero: 1
titulo: "Estrutura de um programa"
nivel: "basico"
objetivo: "Reconhecer as partes de um programa C: includes, main e compilação."
duracao: 10
status: "completo"
---

## Conceito

Todo programa em C começa em uma função especial chamada `main`. Diferente de Python ou
JavaScript, C não é interpretado: o código-fonte (arquivo `.c`) precisa ser **compilado** para um
arquivo binário executável antes de rodar. `#include` traz funcionalidades de bibliotecas
externas — a mais comum é `stdio.h`, responsável por entrada e saída (como `printf`).

## Sintaxe

```c
#include <stdio.h>

int main(void) {
    printf("Olá, mundo!\n");
    return 0;
}
```

```bash
gcc programa.c -o programa   # compila programa.c e gera o executável "programa"
./programa                    # roda o executável
```

## Exemplos comentados

```c
#include <stdio.h>  // biblioteca padrão de entrada/saída, dá acesso a printf/scanf

// main é o ponto de entrada: a primeira função que roda quando o programa é executado
// "int" antes de main significa que a função retorna um número inteiro
// "void" entre parênteses significa que main não recebe argumentos (nesse caso)
int main(void) {
    printf("Iniciando o programa\n");

    int idade = 25;
    printf("Idade: %d\n", idade); // %d é um placeholder para inteiros

    // return 0 sinaliza ao sistema operacional que o programa terminou SEM ERRO
    // por convenção, valores diferentes de 0 indicam algum tipo de falha
    return 0;
}

// Comentários de uma linha usam //
/* Comentários de várias
   linhas usam barra-asterisco */
```

## Exercício 1: Escreva o "Hello, World!" com uma variável

Escreva um programa C completo que declara uma variável `char nome[] = "Ana";` e imprime
`"Olá, Ana!"` usando `printf` com o placeholder `%s` (para strings).

### Solução

```c
#include <stdio.h>

int main(void) {
    char nome[] = "Ana";
    printf("Olá, %s!\n", nome);
    return 0;
}
```

`%s` é o placeholder de `printf` específico para strings (arrays de `char`). A ordem importa: cada
`%` na string de formato corresponde, na mesma ordem, a um argumento extra passado depois dela —
aqui, `nome`.

## Exercício 2: Identifique o erro de compilação

O programa abaixo não compila. Identifique o problema e conserte.

```c
#include <stdio.h>

int main(void) {
    printf("Total: %d\n", 42)
    return 0;
}
```

### Solução

```c
#include <stdio.h>

int main(void) {
    printf("Total: %d\n", 42);
    return 0;
}
```

Falta o ponto e vírgula `;` ao final da chamada de `printf`. Em C, todo comando precisa terminar
com `;` — esquecê-lo é um dos erros de compilação mais comuns para quem está começando, e o
compilador geralmente aponta a linha seguinte como origem do erro (por isso vale sempre checar a
linha anterior também).

## Quiz

### 1. Qual função é o ponto de entrada obrigatório de todo programa C?

- [ ] `start()`
- [x] `main()`
- [ ] `init()`
- [ ] `run()`

> Todo programa executável em C precisa ter exatamente uma função `main`, que é de onde a execução
> começa quando o programa é rodado.

### 2. Para que serve a linha `#include <stdio.h>`?

- [ ] Define a função `main`
- [x] Importa a biblioteca padrão de entrada/saída, que fornece funções como `printf` e `scanf`
- [ ] Compila o programa automaticamente
- [ ] É opcional e nunca faz diferença

> `#include` é uma diretiva de pré-processador que insere o conteúdo de um arquivo de cabeçalho
> (header) no código antes da compilação. `stdio.h` declara as funções de entrada/saída padrão,
> como `printf` e `scanf`, que main usa neste capítulo.

### 3. Por que C precisa ser compilado antes de rodar, diferente de Python?

- [ ] Não precisa — C também é interpretado
- [x] Porque C gera um arquivo binário executável diretamente para o processador, em vez de ser interpretado linha a linha
- [ ] Porque C é mais antigo que Python
- [ ] Apenas por convenção histórica, sem motivo técnico

> C é uma linguagem compilada: o compilador (como `gcc`) traduz todo o código-fonte para
> instruções de máquina antes da execução, gerando um executável binário. Linguagens interpretadas
> como Python leem e executam o código linha a linha em tempo de execução, sem essa etapa
> separada de compilação.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Estrutura de um programa" na trilha de C do CodePath. Contexto: o capítulo
> explica a função main, #include e o processo de compilação com gcc. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
