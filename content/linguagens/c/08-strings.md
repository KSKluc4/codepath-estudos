---
numero: 8
titulo: "Strings"
nivel: "intermediario"
objetivo: "Manipular strings em C como arrays de char terminados em '\0'."
duracao: 12
status: "completo"
---

## Conceito

C não tem um tipo `string` nativo: uma string é simplesmente um **array de `char`** que termina com
um caractere especial `'\0'` (o "caractere nulo", de valor 0) marcando onde o texto acaba. Funções
de string da biblioteca padrão (`string.h`) dependem desse terminador para saber onde parar — um
array de `char` sem `'\0'` no lugar certo causa comportamento indefinido.

## Sintaxe

```c
#include <string.h>

char nome[] = "Ana";           // array de 4 chars: 'A', 'n', 'a', '\0' (automático)
char sobrenome[20] = "Silva";   // array de 20 posições, só as 6 primeiras usadas ("Silva\0")

strlen(nome);          // 3 — NÃO conta o '\0'
strcpy(sobrenome, "Costa");  // copia "Costa" para dentro de sobrenome
strcat(nome, sobrenome);      // concatena sobrenome ao final de nome
```

## Exemplos comentados

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char saudacao[50] = "Olá";

    printf("%zu\n", strlen(saudacao)); // 3 (bytes até o '\0', não conta ele mesmo)

    strcat(saudacao, ", mundo!"); // concatena, MODIFICANDO o array original
    printf("%s\n", saudacao);      // "Olá, mundo!"

    // strcmp compara duas strings: retorna 0 se forem IGUAIS
    // (diferente de outras linguagens, onde == compararia ENDEREÇOS, não conteúdo)
    char a[] = "teste";
    char b[] = "teste";
    if (strcmp(a, b) == 0) {
        printf("São iguais\n");
    }
    // if (a == b) // ERRADO: compara endereços de memória, quase sempre diferentes!

    // Copiar strings com segurança: cuidado com o tamanho do buffer de destino
    char origem[] = "Programação";
    char destino[20];
    strcpy(destino, origem); // destino precisa ter espaço suficiente!

    // Percorrer uma string manualmente, char por char, até o '\0'
    char texto[] = "abc";
    int i = 0;
    while (texto[i] != '\0') {
        printf("%c ", texto[i]);
        i++;
    }
    printf("\n");

    // Funções úteis de <ctype.h> para trabalhar com caracteres individuais
    // toupper('a') -> 'A', tolower('A') -> 'a', isdigit('5') -> verdadeiro

    return 0;
}
```

## Exercício 1: Conte as vogais de uma string

Escreva um programa que conta quantas vogais (a, e, i, o, u, maiúsculas ou minúsculas) existem em
`char texto[] = "Programacao em C";`, percorrendo a string manualmente até o `'\0'`.

### Solução

```c
#include <stdio.h>

int main(void) {
    char texto[] = "Programacao em C";
    int vogais = 0;

    for (int i = 0; texto[i] != '\0'; i++) {
        char c = texto[i];
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' ||
            c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U') {
            vogais++;
        }
    }

    printf("Vogais: %d\n", vogais);
    return 0;
}
```

O loop `for (int i = 0; texto[i] != '\0'; i++)` é o padrão idiomático para percorrer uma string em
C: em vez de usar `strlen()` para descobrir o tamanho antes, ele checa a cada posição se já chegou
ao caractere terminador `'\0'`.

## Exercício 2: Implemente sua própria função de comparação

Escreva uma função `int minhaStrcmp(char a[], char b[])` que retorna `1` se as duas strings forem
iguais e `0` caso contrário — sem usar `strcmp` da biblioteca padrão.

### Solução

```c
#include <stdio.h>

int minhaStrcmp(char a[], char b[]) {
    int i = 0;
    while (a[i] != '\0' && b[i] != '\0') {
        if (a[i] != b[i]) {
            return 0; // encontrou uma diferença
        }
        i++;
    }
    // se chegou aqui, todos os chars comparados até agora batem;
    // só são realmente iguais se AMBOS terminaram no mesmo ponto
    return a[i] == '\0' && b[i] == '\0';
}

int main(void) {
    printf("%d\n", minhaStrcmp("teste", "teste"));  // 1
    printf("%d\n", minhaStrcmp("teste", "testes")); // 0
    return 0;
}
```

A comparação precisa checar dois casos: se algum caractere difere em qualquer posição comum
(retorna `0` imediatamente), e — igualmente importante — se as duas strings têm exatamente o mesmo
comprimento (checado comparando se ambas terminam em `'\0'` na mesma posição `i`), já que
`"teste"` e `"testes"` compartilham o prefixo `"teste"` mas não são iguais.

## Quiz

### 1. O que marca o final de uma string em C?

- [ ] O tamanho declarado do array
- [x] O caractere nulo `'\0'`
- [ ] Uma quebra de linha `'\n'`
- [ ] C sabe automaticamente, sem nenhum marcador

> Strings em C são arrays de `char` terminados por `'\0'` (byte de valor zero). Funções como
> `strlen`, `printf` com `%s`, `strcpy`, etc. dependem desse terminador para saber onde o texto
> "de verdade" termina, independente do tamanho total alocado para o array.

### 2. Por que `if (a == b)` não funciona para comparar o CONTEÚDO de duas strings em C?

- [ ] Porque `==` não existe em C
- [x] Porque `a` e `b` são ponteiros/arrays — `==` compararia os ENDEREÇOS de memória, não o texto
- [ ] Porque strings em C não podem ser comparadas de forma alguma
- [ ] Porque `==` só funciona com um único caractere por vez

> Um nome de array (como `a` ou `b`) "decai" para um ponteiro ao ser usado em uma expressão. `a ==
> b` compara se os dois ponteiros apontam para o MESMO endereço de memória, não se o texto neles é
> igual — mesmo duas strings com conteúdo idêntico quase sempre estarão em endereços diferentes.
> Para comparar conteúdo, usa-se `strcmp(a, b) == 0`.

### 3. O que `strlen("abc")` retorna?

- [ ] `4`, contando o terminador `'\0'`
- [x] `3`, o número de caracteres antes do terminador
- [ ] Um ponteiro para o último caractere
- [ ] Um erro, pois `strlen` só aceita variáveis, não literais

> `strlen` retorna o número de caracteres visíveis da string, sem contar o `'\0'` que a
> termina. Para `"abc"`, isso é `3`, mesmo que o array na memória ocupe 4 bytes no total (`a`,
> `b`, `c`, `\0`).

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Strings" na trilha de C do CodePath. Contexto: o capítulo explica strings como
> arrays de char terminados em '\0', e funções como strlen, strcpy, strcat e strcmp. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
