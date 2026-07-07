---
numero: 7
titulo: "Arrays"
nivel: "intermediario"
objetivo: "Declarar e percorrer arrays de tamanho fixo em C."
duracao: 12
status: "completo"
---

## Conceito

Um array em C é um bloco **contíguo** de memória que guarda vários valores do mesmo tipo, acessados
por índice a partir de `0`. Diferente de listas em Python, arrays em C têm **tamanho fixo**,
definido na criação — não é possível "adicionar" um item além do tamanho original sem criar um
array novo (e maior) manualmente.

## Sintaxe

```c
int numeros[5];                        // array de 5 ints, sem valores iniciais definidos
int notas[3] = {8, 7, 9};                // array inicializado com valores
int idades[] = {20, 25, 30};              // tamanho inferido a partir dos valores (3)

numeros[0] = 10;    // atribui ao primeiro elemento
int primeiro = notas[0]; // lê o primeiro elemento
```

## Exemplos comentados

```c
#include <stdio.h>

int main(void) {
    int notas[5] = {8, 7, 9, 6, 10};

    // sizeof do array inteiro dividido pelo sizeof de UM elemento dá o tamanho
    int tamanho = sizeof(notas) / sizeof(notas[0]); // 5

    // Percorrer um array com for
    for (int i = 0; i < tamanho; i++) {
        printf("Nota %d: %d\n", i, notas[i]);
    }

    // Somar todos os valores
    int soma = 0;
    for (int i = 0; i < tamanho; i++) {
        soma += notas[i];
    }
    printf("Soma: %d\n", soma);

    // PERIGO: C não checa limites de array automaticamente!
    // notas[10] = 100; // comportamento indefinido — pode corromper memória, sem erro imediato

    // Arrays multidimensionais (matrizes)
    int matriz[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };
    for (int linha = 0; linha < 2; linha++) {
        for (int coluna = 0; coluna < 3; coluna++) {
            printf("%d ", matriz[linha][coluna]);
        }
    }
    printf("\n");

    return 0;
}
```

## Exercício 1: Encontre o maior valor

Escreva um programa que declara `int numeros[] = {4, 8, 15, 16, 23, 42};` e encontra o maior valor
percorrendo o array manualmente (sem usar nenhuma função pronta).

### Solução

```c
#include <stdio.h>

int main(void) {
    int numeros[] = {4, 8, 15, 16, 23, 42};
    int tamanho = sizeof(numeros) / sizeof(numeros[0]);

    int maior = numeros[0];
    for (int i = 1; i < tamanho; i++) {
        if (numeros[i] > maior) {
            maior = numeros[i];
        }
    }

    printf("Maior: %d\n", maior); // 42
    return 0;
}
```

A técnica clássica: assume-se que o primeiro elemento é o maior, e o loop compara cada elemento
seguinte, atualizando `maior` sempre que encontra um valor superior. `sizeof(numeros) /
sizeof(numeros[0])` é o idioma padrão em C para calcular quantos elementos um array tem (só
funciona dentro do escopo onde o array foi declarado, não em um array recebido como parâmetro).

## Exercício 2: Inverta um array in place

Escreva um programa que inverte a ordem dos elementos de `int valores[] = {1, 2, 3, 4, 5};`
diretamente no mesmo array (sem criar um array novo), e imprime o resultado.

### Solução

```c
#include <stdio.h>

int main(void) {
    int valores[] = {1, 2, 3, 4, 5};
    int tamanho = sizeof(valores) / sizeof(valores[0]);

    for (int i = 0; i < tamanho / 2; i++) {
        int temp = valores[i];
        valores[i] = valores[tamanho - 1 - i];
        valores[tamanho - 1 - i] = temp;
    }

    for (int i = 0; i < tamanho; i++) {
        printf("%d ", valores[i]); // 5 4 3 2 1
    }
    printf("\n");

    return 0;
}
```

A estratégia usa dois "ponteiros" lógicos (um do início, outro do fim) que trocam de posição e se
aproximam do meio. O loop só precisa ir até `tamanho / 2`, porque cada troca já cuida de dois
elementos de uma vez — ir além duplicaria as trocas e desfaria o resultado.

## Quiz

### 1. Qual a principal diferença entre um array em C e uma lista em Python?

- [ ] Não há diferença nenhuma
- [x] Arrays em C têm tamanho fixo, definido na criação; listas em Python crescem e encolhem dinamicamente
- [ ] Arrays em C não podem guardar números
- [ ] Listas em Python não podem ser percorridas com for

> Um array C ocupa um bloco contínuo de memória de tamanho fixo, decidido no momento da
> declaração. Não existe `.append()`: para "crescer" um array, seria necessário alocar um bloco
> novo maior e copiar os dados (algo que estruturas dinâmicas, como listas Python, fazem
> automaticamente por baixo dos panos).

### 2. O que acontece ao acessar `array[10]` em um array de tamanho 5 em C?

- [ ] C lança automaticamente um erro `IndexError`
- [x] Comportamento indefinido: pode não travar imediatamente, mas acessa/corrompe memória fora dos limites do array
- [ ] O array cresce automaticamente para acomodar o índice
- [ ] O valor `null` é retornado com segurança

> C não faz checagem de limites (bounds checking) em arrays por padrão. Acessar um índice fora do
> intervalo válido é "comportamento indefinido" — pode ler/escrever lixo de memória, corromper
> outras variáveis, ou até funcionar "por acaso" em alguns casos, tornando esse tipo de bug
> particularmente perigoso e difícil de rastrear.

### 3. Como se calcula quantos elementos um array tem em C, dentro do escopo onde foi declarado?

- [ ] `array.length`
- [ ] `len(array)`
- [x] `sizeof(array) / sizeof(array[0])`
- [ ] C sempre sabe automaticamente, sem cálculo necessário

> Diferente de outras linguagens, arrays em C não guardam seu próprio tamanho. O idioma padrão para
> descobrir quantos elementos um array tem é dividir o tamanho total em bytes (`sizeof(array)`)
> pelo tamanho de um único elemento (`sizeof(array[0])`) — mas isso só funciona no escopo onde o
> array foi originalmente declarado, não em arrays recebidos como parâmetro de função.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Arrays" na trilha de C do CodePath. Contexto: o capítulo explica declaração,
> indexação, percurso com for e o cálculo de tamanho com sizeof. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
