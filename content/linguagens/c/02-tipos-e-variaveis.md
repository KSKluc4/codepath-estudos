---
numero: 2
titulo: "Tipos e variáveis"
nivel: "basico"
objetivo: "Declarar variáveis com os tipos primitivos de C e seus tamanhos."
duracao: 12
status: "completo"
---

## Conceito

Diferente de Python ou JavaScript, C exige que você declare o **tipo** de cada variável, e esse
tipo determina exatamente quantos bytes de memória ela ocupa. Isso dá controle fino sobre memória,
mas exige atenção: escolher o tipo errado pode causar overflow (estouro) silencioso, sem nenhum
erro em tempo de execução.

## Sintaxe

```c
int idade = 28;         // inteiro, geralmente 4 bytes
float altura = 1.68f;     // ponto flutuante, 4 bytes (menos precisão)
double pi = 3.14159265;    // ponto flutuante de precisão dupla, 8 bytes
char letra = 'A';           // um único caractere, 1 byte
```

## Exemplos comentados

```c
#include <stdio.h>

int main(void) {
    int numero = 42;
    float preco = 19.99f;      // o sufixo f indica que é um float, não double
    double precisao = 3.14159265358979;
    char inicial = 'J';          // aspas SIMPLES para um único caractere

    // sizeof mostra quantos bytes cada tipo ocupa NESTA máquina
    printf("int: %zu bytes\n", sizeof(int));       // geralmente 4
    printf("float: %zu bytes\n", sizeof(float));    // geralmente 4
    printf("double: %zu bytes\n", sizeof(double));  // geralmente 8
    printf("char: %zu bytes\n", sizeof(char));       // sempre 1

    // Variantes de tamanho de int
    short pequeno = 100;          // geralmente 2 bytes
    long grande = 1000000000L;    // geralmente 8 bytes (o L marca o literal como long)
    unsigned int soPositivo = 42; // só valores >= 0, mas com faixa positiva maior

    // Overflow: ultrapassar o limite do tipo NÃO gera erro, só um resultado errado
    unsigned char byte = 255; // char sem sinal vai de 0 a 255
    byte = byte + 1;           // "estoura" e volta para 0, sem aviso nenhum!

    return 0;
}
```

## Exercício 1: Escolha o tipo certo

Para cada valor abaixo, diga qual tipo primitivo de C seria mais apropriado: (a) a idade de uma
pessoa (0-120), (b) o preço de um produto com centavos, (c) a inicial do nome de alguém, (d) a
população de um país (bilhões).

### Solução

```c
int idade = 28;              // (a) int é suficiente para 0-120
float preco = 49.90f;         // (b) float representa casas decimais
char inicial = 'A';            // (c) char guarda um único caractere
long populacao = 8000000000L;   // (d) long suporta números muito maiores que int
```

`int` costuma ter faixa suficiente até ~2 bilhões (positivo), o que não cobre a população mundial
— por isso `long` (ou `long long`) é mais seguro para números muito grandes. Preços geralmente
usam `float` ou `double`, sendo `double` a escolha mais segura quando precisão importa (como em
cálculos financeiros mais sérios, que costumam evitar ponto flutuante e usar inteiros representando
centavos).

## Exercício 2: Demonstre um overflow

Escreva um programa que declara `unsigned char contador = 250;`, soma `10` a ele, e imprime o
resultado com `printf`. Explique o resultado observado.

### Solução

```c
#include <stdio.h>

int main(void) {
    unsigned char contador = 250;
    contador = contador + 10;
    printf("Resultado: %d\n", contador);
    return 0;
}
```

`unsigned char` vai de 0 a 255. Somar 10 a 250 resultaria em 260, que ultrapassa o limite — o valor
"dá a volta" (wraps around), resultando em `260 - 256 = 4`. O programa imprime `Resultado: 4`, sem
nenhum erro ou aviso, exatamente o tipo de bug silencioso que overflow de tipos causa em C.

## Quiz

### 1. O que `sizeof(int)` retorna?

- [ ] O maior valor que um `int` pode guardar
- [x] Quantos bytes de memória um `int` ocupa nessa máquina/compilador
- [ ] Sempre o número 32
- [ ] O número de variáveis `int` declaradas no programa

> `sizeof` é um operador (não uma função comum) que retorna, em bytes, o tamanho que um tipo (ou
> variável) ocupa na memória. Para `int`, o valor mais comum em sistemas modernos é 4 bytes, mas
> tecnicamente pode variar entre plataformas.

### 2. O que acontece quando um valor ultrapassa o limite máximo do seu tipo em C?

- [ ] O compilador recusa compilar o programa
- [ ] Um erro é lançado em tempo de execução
- [x] O valor "estoura" silenciosamente e volta ao início da faixa (overflow), sem aviso
- [ ] C ajusta automaticamente o tipo da variável para um maior

> Diferente de linguagens como Python (onde inteiros crescem sem limite), tipos em C têm tamanho
> fixo. Ultrapassar o limite causa overflow: o valor "dá a volta" silenciosamente, sem lançar
> nenhum erro — um dos bugs mais traiçoeiros de C, por não ser sinalizado de forma alguma.

### 3. Qual a diferença entre `float` e `double`?

- [ ] Não há diferença, são sinônimos
- [x] `double` tem o dobro de precisão e ocupa mais memória (geralmente 8 bytes contra 4 de `float`)
- [ ] `float` só aceita números positivos
- [ ] `double` só funciona dentro de funções

> Ambos representam números de ponto flutuante, mas `double` (precisão dupla) usa mais bits para
> representar o valor, oferecendo mais casas decimais de precisão que `float` (precisão simples) —
> à custa de ocupar mais memória.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Tipos e variáveis" na trilha de C do CodePath. Contexto: o capítulo explica os
> tipos primitivos (int, float, double, char), sizeof e overflow. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
