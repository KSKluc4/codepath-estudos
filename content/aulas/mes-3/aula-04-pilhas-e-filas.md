---
id: "m3-a4"
mes: 3
numero: 4
titulo: "Pilhas e Filas"
objetivo: "Entender as estruturas LIFO (pilha) e FIFO (fila) e seus casos de uso reais."
duracao: 20
status: "completo"
---

## Duas regras de fila, dois nomes diferentes

Você já conhece a disciplina LIFO desde a Aula 4 do mês 2, quando vimos como a stack de chamadas de
função funciona. Hoje vamos formalizar essa ideia — e sua irmã, FIFO — como estruturas de dados que
**você mesmo** pode usar para organizar qualquer tipo de informação, não apenas chamadas de função.

- **Pilha (stack)**: segue LIFO (*Last In, First Out* — o último a entrar é o primeiro a sair). Pense
  em uma pilha de pratos: você sempre pega o prato do topo, e sempre coloca um prato novo no topo.
- **Fila (queue)**: segue FIFO (*First In, First Out* — o primeiro a entrar é o primeiro a sair).
  Pense em uma fila de banco: quem chega primeiro é atendido primeiro; novas pessoas entram no fim da
  fila.

Ambas são o que chamamos de **tipos abstratos de dados**: elas definem um conjunto restrito de
operações permitidas (você não pode simplesmente "pegar o prato do meio da pilha" ou "furar a fila"),
e é exatamente essa restrição que torna cada uma previsível, rápida e útil para problemas
específicos.

## Pilha (stack): push e pop

Uma pilha tem duas operações principais: `push` (empilhar, adicionar um elemento no topo) e `pop`
(desempilhar, remover e devolver o elemento do topo). Podemos implementar uma pilha usando exatamente
a lista ligada da Aula 3 — inserindo e removendo sempre pela cabeça, que já sabemos ser `O(1)`:

```c
#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct No* push(struct No *topo, int valor) {
    struct No *novo = malloc(sizeof(struct No));
    novo->valor = valor;
    novo->proximo = topo;
    return novo; // o novo nó vira o novo topo
}

struct No* pop(struct No *topo, int *valor_removido) {
    if (topo == NULL) {
        printf("Pilha vazia!\n");
        return NULL;
    }
    struct No *novo_topo = topo->proximo;
    *valor_removido = topo->valor;
    free(topo);
    return novo_topo;
}
```

Repare que `push` é exatamente a mesma função `inserir_no_inicio` da Aula 3 — inserir sempre na
cabeça de uma lista ligada **é**, na prática, implementar uma pilha. `pop` faz o caminho inverso:
guarda o valor do nó do topo, "avança" o topo para o próximo nó, libera a memória do nó antigo, e
devolve o novo topo.

## Onde pilhas aparecem na prática

- **Botão "desfazer" (undo)** em editores: cada ação é empilhada; desfazer significa desempilhar a
  última ação e reverter seu efeito.
- **Botão "voltar" do navegador**: cada página visitada é empilhada; voltar significa desempilhar a
  página atual e mostrar a anterior.
- **A própria stack de chamadas de função**, vista lá no mês 2 — o mecanismo que faz `return` sempre
  voltar para quem chamou a função mais recentemente.

## Fila (queue): enqueue e dequeue

Uma fila também tem duas operações principais: `enqueue` (enfileirar, adicionar ao final) e `dequeue`
(desenfileirar, remover do início). Aqui está uma sutileza importante: se implementássemos a fila
apenas com um ponteiro para a cabeça (como fizemos na pilha), enfileirar no final exigiria percorrer
a lista inteira toda vez (`O(n)`) para encontrar o último nó. A solução é manter **dois** ponteiros:
um para a cabeça (início) e outro para a cauda (fim) da lista:

```c
#include <stdio.h>
#include <stdlib.h>

struct No {
    int valor;
    struct No *proximo;
};

struct Fila {
    struct No *inicio;
    struct No *fim;
};

void enqueue(struct Fila *fila, int valor) {
    struct No *novo = malloc(sizeof(struct No));
    novo->valor = valor;
    novo->proximo = NULL;

    if (fila->fim == NULL) { // fila estava vazia
        fila->inicio = novo;
        fila->fim = novo;
    } else {
        fila->fim->proximo = novo;
        fila->fim = novo;
    }
}

int dequeue(struct Fila *fila) {
    if (fila->inicio == NULL) {
        printf("Fila vazia!\n");
        return -1;
    }
    struct No *removido = fila->inicio;
    int valor = removido->valor;

    fila->inicio = fila->inicio->proximo;
    if (fila->inicio == NULL) { // a fila ficou vazia
        fila->fim = NULL;
    }

    free(removido);
    return valor;
}
```

Com um ponteiro dedicado ao `fim`, `enqueue` consegue adicionar diretamente ao final sem percorrer a
lista, e `dequeue` remove diretamente do início — ambas as operações permanecem `O(1)`.

## Onde filas aparecem na prática

- **Fila de impressão**: documentos são impressos na ordem em que foram enviados.
- **Fila de tarefas de um sistema operacional**: retomando a Aula 7 do mês 1, o escalonador
  frequentemente organiza processos esperando pela CPU usando estruturas baseadas em filas.
- **Mensagens entre sistemas**: sistemas de mensageria (que veremos com mais contexto no mês 4, ao
  falar de redes) frequentemente processam mensagens na ordem em que chegaram.

## Exercício 1: Rastreie a pilha

Considerando uma pilha vazia, execute a sequência de operações abaixo e diga o estado da pilha (do
topo para a base) após cada uma: `push(5)`, `push(10)`, `push(15)`, `pop()`, `push(20)`.

### Solução

```text
push(5):    [5]
push(10):   [10, 5]
push(15):   [15, 10, 5]
pop():      remove 15 (o topo) → [10, 5]
push(20):   [20, 10, 5]
```

Repare que `pop()` sempre remove o elemento mais recentemente adicionado (`15`, que foi o último
`push`) — exatamente a disciplina LIFO. O estado final da pilha, do topo para a base, é `20, 10, 5`.

## Exercício 2: Rastreie a fila

Considerando uma fila vazia, execute a sequência de operações abaixo e diga o estado da fila (do
início para o fim) após cada uma: `enqueue(1)`, `enqueue(2)`, `enqueue(3)`, `dequeue()`,
`enqueue(4)`.

### Solução

```text
enqueue(1):   [1]
enqueue(2):   [1, 2]
enqueue(3):   [1, 2, 3]
dequeue():    remove 1 (o início) → [2, 3]
enqueue(4):   [2, 3, 4]
```

Repare que `dequeue()` sempre remove o elemento que está há mais tempo na fila (`1`, o primeiro
`enqueue`) — a disciplina FIFO. O estado final da fila, do início para o fim, é `2, 3, 4`.

## Exercício 3: Verificando parênteses balanceados com uma pilha

Um uso clássico de pilhas é verificar se os parênteses de uma expressão estão balanceados (cada `(`
tem um `)` correspondente, na ordem correta). Descreva, em passos (sem precisar escrever código C
completo), como usar uma pilha para verificar se a string `"(()())"` tem parênteses balanceados.

### Solução

O algoritmo percorre a string caractere por caractere:

1. Ao encontrar um `(`, faz `push` (empilha), marcando que um parêntese foi aberto e ainda precisa
   ser fechado.
2. Ao encontrar um `)`, faz `pop` (desempilha) — se a pilha estiver vazia nesse momento, significa que
   há um `)` sem um `(` correspondente, e a expressão está desbalanceada.
3. Ao final, se a pilha estiver **vazia**, todos os parênteses abertos foram devidamente fechados, na
   ordem correta — a expressão está balanceada. Se sobrar algo na pilha, há parênteses abertos sem
   fechamento correspondente.

Aplicando à string `"(()())"`, caractere por caractere:

```text
'(' → push → [(]
'(' → push → [(, (]
')' → pop  → [(]
'(' → push → [(, (]
')' → pop  → [(]
')' → pop  → []
```

A pilha termina vazia, confirmando que `"(()())"` tem parênteses corretamente balanceados. Note como
a disciplina LIFO da pilha captura naturalmente a ideia de que o parêntese mais recentemente aberto
deve ser o primeiro a ser fechado.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Pilhas e Filas" do meu curso de programação. Contexto: a aula explica pilhas
> (LIFO, push/pop) e filas (FIFO, enqueue/dequeue), implementadas usando listas ligadas, e suas
> aplicações reais (desfazer, filas de impressão, verificação de parênteses balanceados). Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Qual disciplina uma pilha (stack) segue?

- [ ] FIFO — o primeiro a entrar é o primeiro a sair
- [x] LIFO — o último a entrar é o primeiro a sair
- [ ] Ordem aleatória
- [ ] Ordem alfabética dos valores

> Uma pilha segue LIFO: o elemento mais recentemente adicionado (push) é sempre o primeiro a ser
> removido (pop).

### 2. Qual das opções abaixo é um exemplo real de estrutura FIFO (fila)?

- [ ] O botão "desfazer" de um editor de texto
- [x] Uma fila de impressão, onde documentos são impressos na ordem em que foram enviados
- [ ] A pilha de chamadas de função
- [ ] O botão "voltar" do navegador

> Uma fila de impressão processa documentos na ordem de chegada (FIFO) — o primeiro documento
> enviado é o primeiro a ser impresso.

### 3. Por que uma fila implementada com lista ligada mantém um ponteiro separado para o "fim", além do "início"?

- [ ] Para economizar memória
- [x] Para permitir que enqueue (inserir no final) seja O(1), sem precisar percorrer a lista inteira para encontrar o último nó
- [ ] Porque listas ligadas não podem ter apenas um ponteiro
- [ ] Para impedir que a fila fique vazia

> Sem um ponteiro para o fim, encontrar o último nó para inserir exigiria percorrer toda a lista
> (O(n)) a cada enqueue. Com o ponteiro dedicado, o novo nó é conectado diretamente, mantendo O(1).

### 4. O que a operação `pop` faz em uma pilha?

- [ ] Adiciona um elemento ao final da pilha
- [x] Remove e devolve o elemento do topo da pilha
- [ ] Remove o elemento mais antigo da pilha
- [ ] Verifica se a pilha está vazia, sem remover nada

> `pop` remove e devolve especificamente o elemento do topo — o mais recentemente adicionado —,
> respeitando a disciplina LIFO da pilha.

### 5. No algoritmo de verificar parênteses balanceados usando uma pilha, o que acontece quando um `)` é encontrado, mas a pilha já está vazia?

- [ ] A pilha reinicia automaticamente
- [x] Isso indica que a expressão está desbalanceada, já que há um fechamento sem uma abertura correspondente
- [ ] O caractere é ignorado e o algoritmo continua normalmente
- [ ] Um novo `(` é empilhado automaticamente

> Se a pilha está vazia ao encontrar um `)`, não existe nenhum `(` pendente para "casar" com ele —
> isso é justamente a condição usada para detectar que os parênteses não estão balanceados.
