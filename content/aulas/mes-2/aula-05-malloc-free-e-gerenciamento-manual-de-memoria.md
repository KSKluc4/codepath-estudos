---
id: "m2-a5"
mes: 2
numero: 5
titulo: "malloc, free e gerenciamento manual de memória"
objetivo: "Aprender a alocar e liberar memória manualmente em C, e os perigos de fazer isso errado."
duracao: 30
status: "completo"
---

## Pedindo espaço no depósito

Na aula passada, comparamos o heap a um depósito nos fundos de um restaurante: você vai até lá, pede
exatamente o que precisa, e é responsável por devolver depois. Chegou a hora de aprender as
"palavras mágicas" reais para fazer esse pedido em C: `malloc`, `calloc`, `realloc` e `free`.

## `malloc`: pedindo um bloco de memória

`malloc` (*memory allocation*) pede ao sistema um bloco de memória do heap, do tamanho (em bytes)
que você especificar, e devolve um **ponteiro** para o início desse bloco:

```c
#include <stdio.h>
#include <stdlib.h> // necessário para malloc, calloc, realloc e free

int main() {
    int *numeros = malloc(5 * sizeof(int));

    if (numeros == NULL) {
        printf("Falha ao alocar memoria!\n");
        return 1;
    }

    for (int i = 0; i < 5; i++) {
        numeros[i] = i * 10;
    }

    for (int i = 0; i < 5; i++) {
        printf("%d\n", numeros[i]);
    }

    free(numeros);
    numeros = NULL;

    return 0;
}
```

Repare em `malloc(5 * sizeof(int))`: pedimos espaço suficiente para **5 inteiros**. Usar `sizeof`
aqui (em vez de "adivinhar" que um int tem 4 bytes) é uma prática essencial — o tamanho exato de
`int` pode variar entre sistemas, e `sizeof` sempre calcula o valor correto para a máquina em que o
programa está rodando (voltando à Aula 2 deste mês).

Note também a verificação `if (numeros == NULL)`: `malloc` pode falhar (por exemplo, se não houver
memória disponível suficiente) e, nesse caso, devolve `NULL` em vez de um endereço válido. Verificar
isso antes de usar o ponteiro é uma prática de segurança importante — usar um ponteiro `NULL` como se
fosse válido é exatamente o tipo de erro perigoso que vimos na Aula 3.

## `free`: devolvendo a memória

Depois de terminar de usar a memória alocada com `malloc`, você **precisa** devolvê-la explicitamente
usando `free`:

```c
free(numeros);
```

Isso avisa ao sistema que aquele bloco de memória pode ser reutilizado para outra coisa. Diferente da
stack (Aula 4), o heap **não faz isso sozinho** — se você esquecer de chamar `free`, aquela memória
fica "presa", reservada, mesmo que seu programa não esteja mais usando ela. Isso se chama **vazamento
de memória** (*memory leak*).

## Vazamento de memória: o depósito que nunca esvazia

Um vazamento de memória acontece quando um programa aloca memória repetidamente sem nunca liberá-la.
Cada vazamento individual pode ser pequeno, mas em um programa que roda por muito tempo (um servidor,
por exemplo), pequenos vazamentos repetidos acumulam até esgotar toda a memória disponível,
derrubando o programa (ou o sistema inteiro).

```c
void funcao_com_vazamento() {
    int *dados = malloc(100 * sizeof(int));
    // ... usa "dados" para alguma coisa ...

    // esqueceu de chamar free(dados) antes de sair da função!
}
```

Toda vez que `funcao_com_vazamento` é chamada, um novo bloco de 100 inteiros é alocado no heap — mas
como a função termina sem chamar `free`, o programa perde a única referência (`dados`, uma variável
local que desaparece da stack quando a função termina) para aquele bloco. A memória fica alocada,
mas **inacessível e irrecuperável**, até o programa inteiro terminar.

## Ponteiros soltos (dangling pointers)

O problema oposto também é perigoso: usar um ponteiro **depois** de já ter chamado `free` nele. Esse
ponteiro se chama **ponteiro solto** (*dangling pointer*) — ele ainda guarda o endereço antigo, mas
aquela memória já foi devolvida ao sistema e pode ser reutilizada a qualquer momento por outra parte
do programa.

```c
int *numero = malloc(sizeof(int));
*numero = 42;

free(numero);

printf("%d\n", *numero); // PERIGO: usando memoria já liberada!
```

Depois do `free(numero)`, o conteúdo daquele endereço não é mais garantido — pode ainda parecer
`42` por acaso, pode ser outro valor completamente diferente (se outra parte do programa já reutilizou
aquele espaço), ou pode até travar o programa. Esse tipo de bug é notoriamente difícil de depurar,
porque o comportamento é imprevisível e pode até "funcionar por acaso" em alguns testes.

A prática recomendada (que já usamos no primeiro exemplo desta aula) é **atribuir `NULL` ao ponteiro
logo após liberá-lo**:

```c
free(numero);
numero = NULL;
```

Assim, qualquer tentativa acidental de usar `numero` depois de liberado vai gerar um erro claro e
imediato (tentar desreferenciar `NULL`), em vez de um bug silencioso e imprevisível.

## `calloc`: como malloc, mas zerado

`calloc` (*cleared allocation*) também aloca memória no heap, mas com duas diferenças: recebe dois
argumentos (quantidade de elementos e tamanho de cada um, em vez de um total já calculado), e **zera**
toda a memória alocada antes de devolvê-la:

```c
int *numeros = calloc(5, sizeof(int)); // 5 inteiros, todos inicializados com 0
```

Isso é útil quando você quer ter certeza de que não vai ler "lixo" de memória não inicializada por
engano — com `malloc`, o conteúdo inicial do bloco alocado é indefinido (pode ser qualquer coisa que
estava naquele espaço antes).

## `realloc`: redimensionando um bloco já alocado

Se você precisar aumentar (ou diminuir) um bloco de memória já alocado — por exemplo, porque uma
lista cresceu além do espaço originalmente reservado — use `realloc`:

```c
int *numeros = malloc(3 * sizeof(int));
// ... preenche os 3 primeiros valores ...

int *novo_bloco = realloc(numeros, 5 * sizeof(int)); // agora cabem 5 inteiros
if (novo_bloco == NULL) {
    // realloc falhou; "numeros" ainda é válido e não foi alterado
    free(numeros);
    return 1;
}
numeros = novo_bloco;
```

Um detalhe importante: `realloc` pode precisar **mover** o bloco inteiro para outro endereço de
memória (se não houver espaço contíguo suficiente no local atual), copiando os dados automaticamente
para o novo local. Por isso, é fundamental guardar o resultado de `realloc` em uma variável separada
antes de substituir o ponteiro original — se `realloc` falhar (devolvendo `NULL`) e você tivesse
sobrescrito diretamente `numeros`, você perderia a única referência ao bloco original, causando um
vazamento de memória.

## Exercício 1: Aloque, preencha e libere

Escreva um programa C que aloque dinamicamente um array de 6 inteiros usando `malloc`, preencha cada
posição com o quadrado do seu índice (posição 0 recebe `0*0=0`, posição 1 recebe `1*1=1`, etc.),
imprima todos os valores, e libere a memória corretamente ao final.

### Solução

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *quadrados = malloc(6 * sizeof(int));

    if (quadrados == NULL) {
        printf("Falha ao alocar memoria!\n");
        return 1;
    }

    for (int i = 0; i < 6; i++) {
        quadrados[i] = i * i;
    }

    for (int i = 0; i < 6; i++) {
        printf("%d\n", quadrados[i]);
    }

    free(quadrados);
    quadrados = NULL;

    return 0;
}
```

Saída:

```text
0
1
4
9
16
25
```

## Exercício 2: Encontre o vazamento

O programa abaixo tem um vazamento de memória. Identifique onde, e corrija.

```c
#include <stdlib.h>

void processar_lote() {
    for (int i = 0; i < 10; i++) {
        int *bloco = malloc(50 * sizeof(int));
        // ... usa "bloco" para algum processamento ...
    }
}
```

### Solução

O vazamento está no laço `for`: a cada uma das 10 iterações, um novo bloco de memória é alocado com
`malloc`, mas nunca é liberado com `free` antes que a variável `bloco` (local ao corpo do laço) saia
de escopo na próxima iteração — perdendo a única referência a cada bloco alocado anteriormente. Ao
final da função, 10 blocos de 50 inteiros cada ficam permanentemente vazados.

Correção, adicionando `free(bloco)` ao final de cada iteração:

```c
#include <stdlib.h>

void processar_lote() {
    for (int i = 0; i < 10; i++) {
        int *bloco = malloc(50 * sizeof(int));
        // ... usa "bloco" para algum processamento ...
        free(bloco);
    }
}
```

Agora cada bloco alocado dentro de uma iteração é devidamente liberado antes de a próxima iteração
alocar um novo, evitando o acúmulo de memória não utilizada.

## Exercício 3: Encontre o ponteiro solto

O programa abaixo compila, mas tem um comportamento perigoso e imprevisível. Identifique o problema
e corrija.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *idade = malloc(sizeof(int));
    *idade = 30;

    free(idade);

    printf("Idade: %d\n", *idade);

    return 0;
}
```

### Solução

O problema é um **ponteiro solto** (dangling pointer): depois de `free(idade)`, a memória apontada
por `idade` já foi devolvida ao sistema, e pode conter qualquer coisa (ou já ter sido reutilizada por
outra parte do programa). A linha `printf("Idade: %d\n", *idade);` desreferencia esse ponteiro já
liberado, o que é um comportamento indefinido — pode imprimir `30` por acaso, outro valor qualquer,
ou até travar o programa.

Correção: não usar o ponteiro depois de liberá-lo, e (como boa prática) atribuir `NULL` a ele
imediatamente após o `free`, para que qualquer uso acidental futuro falhe de forma clara e imediata:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *idade = malloc(sizeof(int));
    *idade = 30;

    printf("Idade: %d\n", *idade); // imprime ANTES de liberar

    free(idade);
    idade = NULL;

    return 0;
}
```

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "malloc, free e gerenciamento manual de memória" do meu curso de programação.
> Contexto: a aula explica como alocar memória no heap com malloc/calloc, redimensionar com realloc,
> liberar com free, e os perigos de vazamento de memória e ponteiros soltos. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que a função `malloc` devolve se não conseguir alocar a memória solicitada?

- [ ] Um erro de compilação
- [x] NULL
- [ ] O número zero
- [ ] Uma memória com lixo, mas válida

> Quando `malloc` falha (por exemplo, por falta de memória disponível), ela devolve `NULL` em vez de
> um endereço válido. Por isso é importante sempre verificar o retorno antes de usar o ponteiro.

### 2. O que é um "vazamento de memória" (memory leak)?

- [ ] Um erro de compilação causado por sintaxe incorreta
- [x] Memória alocada no heap que nunca é liberada com free, ficando reservada mesmo sem uso
- [ ] Um ponteiro que aponta para o endereço errado
- [ ] Uma variável declarada, mas nunca utilizada

> Um vazamento de memória acontece quando um programa aloca memória e perde a referência a ela sem
> nunca chamá-la `free`, deixando aquele espaço reservado (e inacessível) até o programa terminar.

### 3. O que é um "ponteiro solto" (dangling pointer)?

- [ ] Um ponteiro que nunca foi inicializado
- [x] Um ponteiro que ainda guarda o endereço de uma memória que já foi liberada com free
- [ ] Um ponteiro que aponta para uma variável na stack
- [ ] Um ponteiro que aponta para outro ponteiro

> Um ponteiro solto continua guardando um endereço de memória que já foi devolvido ao sistema
> (via free). Usar esse ponteiro depois disso tem comportamento indefinido e perigoso.

### 4. Qual a principal diferença entre `malloc` e `calloc`?

- [ ] malloc é mais rápido em qualquer situação
- [ ] calloc não pode ser usado com arrays
- [x] calloc inicializa toda a memória alocada com zero; malloc deixa o conteúdo inicial indefinido
- [ ] Não existe diferença real entre os dois

> `calloc` zera toda a memória alocada antes de devolvê-la, enquanto `malloc` devolve um bloco de
> memória com conteúdo indefinido (podendo conter "lixo" de usos anteriores daquele espaço).

### 5. Por que é importante guardar o resultado de `realloc` em uma variável separada antes de substituir o ponteiro original?

- [ ] Porque realloc sempre falha na primeira tentativa
- [x] Porque, se realloc falhar (devolvendo NULL), sobrescrever o ponteiro original faria perder a única referência ao bloco de memória ainda válido
- [ ] Porque realloc não pode ser usado com arrays de inteiros
- [ ] Isso não é uma prática recomendada, deve-se sempre sobrescrever diretamente

> Se `realloc` falhar, ele devolve `NULL`, mas o bloco de memória original continua válido e
> intacto. Se você sobrescrever diretamente o ponteiro original com esse `NULL`, perde a única
> referência ao bloco original, causando um vazamento de memória.
