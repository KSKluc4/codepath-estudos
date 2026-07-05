---
id: "m3-a3"
mes: 3
numero: 3
titulo: "Listas ligadas"
objetivo: "Entender a estrutura de listas ligadas e quando preferi-las a arrays."
duracao: 30
status: "completo"
---

## Uma caça ao tesouro, em vez de uma rua numerada

Na aula passada, vimos que um array é como uma rua com casas numeradas, todas vizinhas, em ordem. Uma
**lista ligada** é bem diferente: é como uma **caça ao tesouro**, onde cada pista te diz exatamente
onde encontrar a próxima — mas as pistas podem estar espalhadas por qualquer lugar, sem nenhuma
relação de vizinhança física entre elas.

Em uma lista ligada, cada elemento (chamado **nó**) é um pequeno bloco de memória independente
(tipicamente alocado no heap, com `malloc` — retomando a Aula 5 do mês 2), que guarda dois tipos de
informação: (1) o **dado** em si, e (2) um **ponteiro** para o endereço do próximo nó da lista. Não há
nada garantindo que os nós estejam fisicamente próximos na memória — cada um pode estar em qualquer
lugar, e a única coisa que os conecta é essa cadeia de ponteiros.

## Definindo um nó com `struct`

Para representar um nó em C, precisamos de uma ferramenta nova: a **struct**, que agrupa vários
valores relacionados sob um único nome:

```c
struct No {
    int valor;
    struct No *proximo;
};
```

Essa `struct No` tem dois campos: `valor` (o dado guardado naquele nó) e `proximo`, um **ponteiro
para outro `struct No`** — ou seja, o endereço do próximo nó da lista (ou `NULL`, se este for o
último nó). Repare que a struct se refere a si mesma (`struct No *proximo` dentro da definição de
`struct No`) — isso é permitido porque `proximo` é um *ponteiro* (que sempre ocupa o mesmo tamanho
fixo em memória, retomando a Aula 2 do mês 2), não uma cópia inteira de outro nó.

## Criando e conectando nós

```c
#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

int main() {
    struct No *primeiro = malloc(sizeof(struct No));
    struct No *segundo = malloc(sizeof(struct No));

    primeiro->valor = 10;
    primeiro->proximo = segundo;

    segundo->valor = 20;
    segundo->proximo = NULL;

    printf("%d -> %d\n", primeiro->valor, segundo->valor);

    free(primeiro);
    free(segundo);

    return 0;
}
```

O operador `->` (seta) é um atalho para acessar um campo de uma struct **através de um ponteiro**:
`primeiro->valor` é exatamente equivalente a `(*primeiro).valor` (primeiro desreferencia o ponteiro,
depois acessa o campo). Como isso é extremamente comum ao trabalhar com structs e ponteiros juntos, C
oferece essa notação mais curta.

## Percorrendo a lista

Para visitar cada nó da lista, começamos no primeiro nó (a "cabeça" da lista) e seguimos os
ponteiros `proximo` até chegar a `NULL`:

```c
void imprimir_lista(struct No *cabeca) {
    struct No *atual = cabeca;
    while (atual != NULL) {
        printf("%d -> ", atual->valor);
        atual = atual->proximo;
    }
    printf("NULL\n");
}
```

Esse padrão — `atual = atual->proximo`, repetido até `atual` virar `NULL` — é a base de praticamente
toda operação sobre listas ligadas: busca, impressão, contagem, remoção.

## Inserindo no início: O(1), sem deslocar nada

Lembra que, na Aula 2, inserir no início de um array custava `O(n)` porque era preciso deslocar todos
os elementos seguintes? Em uma lista ligada, inserir um novo nó no início é `O(1)`: basta criar o
novo nó e apontar seu `proximo` para o antigo primeiro nó — nenhum outro nó precisa se mover na
memória, porque eles nunca estiveram "em ordem física" para começo de conversa.

```c
struct No* inserir_no_inicio(struct No *cabeca, int valor) {
    struct No *novo = malloc(sizeof(struct No));
    novo->valor = valor;
    novo->proximo = cabeca; // o novo nó aponta para o antigo início
    return novo; // o novo nó passa a ser a nova cabeça da lista
}
```

```text
Antes:            [10] -> [20] -> NULL
Inserir 5 no início:
Depois:    [5] -> [10] -> [20] -> NULL
```

## Arrays vs. listas ligadas: a troca (trade-off)

| Operação | Array | Lista ligada |
|----------|-------|---------------|
| Acesso por índice (`array[i]`) | O(1) | O(n) — é preciso percorrer nó por nó |
| Inserir/remover no início | O(n) — desloca tudo | O(1) — só reconecta ponteiros |
| Inserir/remover no final | O(1) (se houver espaço) | O(n), a menos que se mantenha um ponteiro para o último nó |
| Uso de memória | Compacto, contíguo | Um pouco maior (cada nó guarda um ponteiro extra) |

Repare na primeira linha: essa é a maior desvantagem da lista ligada. Como os nós não são
fisicamente vizinhos na memória, **não existe fórmula de endereço** para "pular direto" ao décimo
elemento, como fazíamos com arrays na Aula 2 — é preciso percorrer nó por nó, a partir da cabeça, até
chegar lá. Escolher entre array e lista ligada é, no fundo, escolher **qual operação você vai fazer
com mais frequência** no seu programa.

## Listas duplamente ligadas

Uma **lista duplamente ligada** adiciona um segundo ponteiro a cada nó, apontando para o nó
**anterior**, além do `proximo`:

```c
struct NoDuplo {
    int valor;
    struct NoDuplo *proximo;
    struct NoDuplo *anterior;
};
```

```text
NULL <- [5] <-> [10] <-> [20] -> NULL
```

Isso permite percorrer a lista **em ambas as direções**, e — algo muito útil na prática — remover um
nó do meio da lista em `O(1)` **se você já tem um ponteiro direto para aquele nó**, porque é possível
reconectar os vizinhos dele (`anterior->proximo` e `proximo->anterior`) sem precisar percorrer a lista
para encontrá-los. O custo é usar um pouco mais de memória por nó (um ponteiro extra) e um pouco mais
de cuidado ao programar (mais ponteiros para manter corretos a cada operação).

## Exercício 1: Array ou lista ligada?

Para cada cenário abaixo, diga se um array ou uma lista ligada seria mais adequado, e explique por
quê: (a) uma lista de reprodução de música onde músicas são frequentemente adicionadas e removidas do
início; (b) uma tabela onde você precisa acessar frequentemente o elemento de índice 500 diretamente.

### Solução

**(a) Lista de reprodução com inserção/remoção frequente no início → Lista ligada.** Inserir e
remover no início de uma lista ligada é `O(1)`, enquanto em um array seria `O(n)` (precisando
deslocar todos os outros elementos a cada operação).

**(b) Acesso frequente por índice direto → Array.** Arrays oferecem acesso `O(1)` a qualquer posição
através da fórmula de endereço vista na Aula 2. Em uma lista ligada, acessar o elemento de índice 500
exigiria percorrer 500 nós a partir da cabeça, uma operação `O(n)`.

## Exercício 2: Monte a lista manualmente

Escreva um programa C completo que crie três nós (com valores 1, 2 e 3), conecte-os em sequência
formando uma lista ligada, e use a função `imprimir_lista` da aula para exibi-la.

### Solução

```c
#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

void imprimir_lista(struct No *cabeca) {
    struct No *atual = cabeca;
    while (atual != NULL) {
        printf("%d -> ", atual->valor);
        atual = atual->proximo;
    }
    printf("NULL\n");
}

int main() {
    struct No *no1 = malloc(sizeof(struct No));
    struct No *no2 = malloc(sizeof(struct No));
    struct No *no3 = malloc(sizeof(struct No));

    no1->valor = 1;
    no1->proximo = no2;

    no2->valor = 2;
    no2->proximo = no3;

    no3->valor = 3;
    no3->proximo = NULL;

    imprimir_lista(no1);

    free(no1);
    free(no2);
    free(no3);

    return 0;
}
```

Saída:

```text
1 -> 2 -> 3 -> NULL
```

## Exercício 3: Implemente `inserir_no_inicio`

Usando a função `inserir_no_inicio` vista na aula como referência, escreva um `main` que comece com
uma lista vazia (`cabeca = NULL`), insira os valores 30, 20 e 10, nessa ordem (sempre no início), e
imprima o resultado final.

### Solução

```c
#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct No* inserir_no_inicio(struct No *cabeca, int valor) {
    struct No *novo = malloc(sizeof(struct No));
    novo->valor = valor;
    novo->proximo = cabeca;
    return novo;
}

void imprimir_lista(struct No *cabeca) {
    struct No *atual = cabeca;
    while (atual != NULL) {
        printf("%d -> ", atual->valor);
        atual = atual->proximo;
    }
    printf("NULL\n");
}

int main() {
    struct No *cabeca = NULL;

    cabeca = inserir_no_inicio(cabeca, 30);
    cabeca = inserir_no_inicio(cabeca, 20);
    cabeca = inserir_no_inicio(cabeca, 10);

    imprimir_lista(cabeca);

    return 0;
}
```

Saída:

```text
10 -> 20 -> 30 -> NULL
```

Repare que, como cada inserção acontece sempre no início, o **último** valor inserido (`10`) acaba
sendo o **primeiro** da lista final — cada novo nó "empurra" os anteriores para depois dele, exatamente
como vimos no diagrama da aula.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Listas ligadas" do meu curso de programação. Contexto: a aula explica como cada
> nó guarda um valor e um ponteiro para o próximo nó (usando struct e malloc), por que inserir no
> início é O(1) em uma lista ligada (mas O(n) em array), e o conceito de lista duplamente ligada.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que um "nó" de uma lista ligada contém tipicamente?

- [ ] Apenas um valor, sem nenhuma outra informação
- [x] Um valor e um ponteiro para o endereço do próximo nó
- [ ] Um índice numérico fixo
- [ ] Uma cópia de toda a lista

> Cada nó de uma lista ligada guarda o dado em si, além de um ponteiro apontando para onde o próximo
> nó da lista está na memória.

### 2. Por que inserir um elemento no início de uma lista ligada é O(1)?

- [ ] Porque listas ligadas nunca têm mais de um elemento
- [x] Porque basta criar o novo nó e apontá-lo para o antigo início, sem precisar mover nenhum outro nó na memória
- [ ] Porque o compilador otimiza automaticamente essa operação
- [ ] Isso não é verdade; inserir no início também é O(n) em listas ligadas

> Diferente de um array, os nós de uma lista ligada não precisam estar fisicamente organizados em
> ordem — inserir no início só exige reconectar um ponteiro, sem deslocar nenhum outro nó.

### 3. Qual é a principal desvantagem de uma lista ligada em comparação com um array?

- [ ] Listas ligadas não podem crescer dinamicamente
- [x] Não é possível acessar um elemento por índice diretamente; é preciso percorrer nó por nó a partir da cabeça
- [ ] Listas ligadas ocupam sempre menos memória que arrays
- [ ] Listas ligadas não podem ser usadas para guardar números inteiros

> Como os nós de uma lista ligada não são armazenados em posições contíguas de memória, não existe
> uma fórmula de endereço direta como em arrays — acessar o elemento de índice `i` exige percorrer
> `i` nós a partir da cabeça, uma operação O(n).

### 4. O que o operador `->` faz em C, ao usá-lo como em `no->valor`?

- [ ] Cria um novo nó automaticamente
- [x] Acessa o campo "valor" de uma struct através de um ponteiro, equivalente a (*no).valor
- [ ] Compara dois ponteiros
- [ ] Libera a memória apontada por "no"

> O operador seta (`->`) é um atalho para desreferenciar um ponteiro e acessar um campo da struct
> apontada por ele, evitando escrever `(*no).valor` por extenso.

### 5. O que uma lista duplamente ligada adiciona, em comparação com uma lista ligada simples?

- [ ] A capacidade de guardar dois valores por nó
- [x] Um ponteiro adicional para o nó anterior, permitindo percorrer a lista em ambas as direções
- [ ] Acesso O(1) a qualquer índice, como em arrays
- [ ] A eliminação da necessidade de usar malloc

> Cada nó de uma lista duplamente ligada guarda tanto um ponteiro para o próximo nó quanto para o
> nó anterior, permitindo navegação em ambas as direções e remoção O(1) de um nó já conhecido.
