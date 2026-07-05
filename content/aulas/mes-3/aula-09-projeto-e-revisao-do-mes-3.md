---
id: "m3-a9"
mes: 3
numero: 9
titulo: "Projeto e revisão do Mês 3"
objetivo: "Consolidar estruturas de dados e algoritmos com problemas práticos integrados."
duracao: 30
status: "completo"
---

## Da teoria à prática: um sistema de atendimento

Este mês cobriu muita coisa: Big O, arrays, listas ligadas, pilhas, filas, hash tables, árvores,
grafos e padrões de entrevista. Neste projeto guiado (em Python, pela clareza), vamos construir um
pequeno **sistema de atendimento por senhas** que combina três estruturas do mês: **fila** (para
atender por ordem de chegada), **pilha** (para desfazer a última ação) e **hash table** (para buscar
clientes rapidamente por ID).

## Passo 1: fila de atendimento (FIFO)

Em Python, uma lista comum já pode servir de fila (embora, na prática, existam estruturas mais
eficientes especificamente para isso) — o importante é respeitar a disciplina FIFO da Aula 4:
clientes são atendidos na ordem em que chegaram.

## Exercício 1: Implemente a fila de atendimento

Escreva funções `emitir_senha(fila, nome_cliente)` (adiciona ao final da fila) e
`chamar_proximo(fila)` (remove e devolve o cliente do início da fila, ou `None` se estiver vazia).

### Solução

```python
def emitir_senha(fila, nome_cliente):
    fila.append(nome_cliente)  # adiciona ao final, O(1)

def chamar_proximo(fila):
    if not fila:
        return None
    return fila.pop(0)  # remove do início, respeitando FIFO
```

Note que `fila.pop(0)` em uma lista Python é, na prática, `O(n)` (porque a lista precisa deslocar
todos os elementos restantes, exatamente como vimos na Aula 2 sobre remoção no início de um array).
Uma fila "de verdade", como a que construímos com listas ligadas e um ponteiro de cauda na Aula 4,
evita esse custo, mantendo `O(1)` tanto para inserir quanto para remover. Vale a reflexão: bibliotecas
de produção (como `collections.deque` do próprio Python) já implementam isso de forma eficiente por
trás dos panos.

## Passo 2: histórico de ações com desfazer (LIFO)

## Exercício 2: Implemente o histórico com desfazer

Usando uma lista Python como pilha, escreva funções `registrar_acao(historico, descricao)` (empilha
uma ação) e `desfazer_ultima(historico)` (desempilha e devolve a última ação registrada, ou `None` se
vazio).

### Solução

```python
def registrar_acao(historico, descricao):
    historico.append(descricao)  # push: adiciona ao topo (final da lista), O(1)

def desfazer_ultima(historico):
    if not historico:
        return None
    return historico.pop()  # pop: remove do topo (final da lista), O(1)
```

Diferente da fila, aqui usamos o **final** da lista tanto para inserir quanto para remover — e por
isso ambas as operações são genuinamente `O(1)` em uma lista Python (adicionar/remover no final não
exige deslocar nenhum outro elemento, retomando a Aula 2). Essa é exatamente a razão pela qual pilhas
costumam ser implementadas com arrays/listas na prática, enquanto filas se beneficiam mais de listas
ligadas (ou estruturas especializadas) para permanecerem eficientes.

## Passo 3: busca rápida de clientes por ID (hash table)

## Exercício 3: Implemente a busca por ID

Escreva uma função `buscar_cliente(clientes_por_id, id_buscado)` que recebe um dicionário (hash
table) mapeando ID → nome do cliente, e devolve o nome correspondente (ou `"Não encontrado"`).
Depois, explique por que essa busca é mais rápida do que procurar em uma lista de tuplas
`(id, nome)`.

### Solução

```python
def buscar_cliente(clientes_por_id, id_buscado):
    return clientes_por_id.get(id_buscado, "Nao encontrado")
```

Como `clientes_por_id` é um dicionário — uma hash table, retomando a Aula 5 —, a busca por uma chave
(`id_buscado`) é `O(1)` em média: o Python calcula o hash do ID e vai diretamente ao "balde"
correspondente, sem precisar examinar os outros clientes. Se, em vez disso, os clientes estivessem
guardados em uma lista de tuplas `(id, nome)`, encontrar um ID específico exigiria percorrer a lista
inteira no pior caso — uma busca `O(n)`, retomando a Aula 2. Para um sistema com milhares de clientes
cadastrados, essa diferença é a diferença entre um sistema responsivo e um sistema que trava.

## Resumo do Mês 3 — a caixa de ferramentas do programador

Antes do quiz de revisão, um mapa mental de todo o mês:

- **Aula 1 — Big O**: mede como tempo/espaço crescem conforme o tamanho da entrada aumenta,
  ignorando hardware. Ordem de crescimento: O(1) < O(log n) < O(n) < O(n log n) < O(n²).
- **Aula 2 — Arrays e Strings**: acesso indexado é O(1) graças à fórmula de endereço; inserir/remover
  no início é O(n) (desloca tudo); strings em C são arrays de char terminados por `'\0'`.
- **Aula 3 — Listas ligadas**: cada nó guarda um valor e um ponteiro para o próximo; inserir no
  início é O(1), mas não há acesso indexado direto (O(n) para alcançar uma posição); listas
  duplamente ligadas navegam nos dois sentidos.
- **Aula 4 — Pilhas e Filas**: pilha é LIFO (push/pop, undo, chamadas de função); fila é FIFO
  (enqueue/dequeue, impressão, filas de atendimento).
- **Aula 5 — Hash Tables**: uma função de hash transforma uma chave em um índice; colisões são
  tratadas com encadeamento (listas ligadas); busca é O(1) em média.
- **Aula 6 — Árvores**: árvores binárias de busca mantêm valores ordenados (esquerda menor, direita
  maior); percursos em-ordem, pré-ordem e pós-ordem; O(log n) se balanceada, O(n) se degenerada.
- **Aula 7 — Grafos**: modelam relações gerais (redes sociais, mapas); representados por lista de
  adjacência; BFS (fila, camada por camada) e DFS (pilha/recursão, aprofunda primeiro).
- **Aula 8 — Padrões de entrevista**: two pointers (arrays ordenados), sliding window (subarrays
  contíguos), recursão/backtracking (explorar e desfazer escolhas).

A partir do mês 4, vamos sair da estrutura de dados isolada e entrar em **sistemas**: como
computadores se comunicam em rede (TCP/IP, DNS, HTTP), e como o sistema operacional gerencia
processos e threads rodando ao mesmo tempo.

## Tirou dúvida?

Se travar em algum ponto deste projeto ou da revisão, descreva o contexto exato do que você já
entendeu e onde travou. Copie e adapte o modelo abaixo:

> Estou estudando "Projeto e revisão do Mês 3" do meu curso de programação. Contexto: o projeto
> constrói um sistema de atendimento combinando fila, pilha e hash table em Python, revisando Big O,
> arrays, listas ligadas, árvores, grafos e padrões de entrevista do mês inteiro. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que a notação Big O mede?

- [ ] O tempo exato, em segundos, de um algoritmo
- [x] Como o tempo ou espaço de execução cresce conforme o tamanho da entrada aumenta
- [ ] O número de linhas de código de um programa
- [ ] A quantidade de RAM instalada no computador

> Big O descreve a taxa de crescimento do tempo/espaço em função do tamanho da entrada,
> independente do hardware usado.

### 2. Por que acessar um elemento de um array por índice é O(1)?

- [ ] Porque arrays nunca têm mais de 100 elementos
- [x] Porque o endereço de qualquer posição pode ser calculado diretamente, sem percorrer o array
- [ ] Porque o compilador otimiza arrays automaticamente
- [ ] Isso não é verdade, o acesso é sempre O(n)

> O endereço de `array[i]` é calculado com uma fórmula direta (`base + i × tamanho`), levando o
> mesmo tempo independente da posição acessada.

### 3. Por que inserir no início de uma lista ligada é O(1), mas inserir no início de um array é O(n)?

- [ ] Porque listas ligadas não têm início
- [x] Porque uma lista ligada só precisa reconectar um ponteiro, enquanto um array precisa deslocar todos os elementos existentes
- [ ] Porque arrays não podem crescer
- [ ] Isso não é verdade, ambos custam o mesmo

> Nós de uma lista ligada não precisam estar fisicamente em ordem — inserir no início só exige
> apontar o novo nó para o antigo início. Um array precisa deslocar fisicamente cada elemento
> existente para abrir espaço.

### 4. Qual disciplina uma pilha segue?

- [ ] FIFO
- [x] LIFO
- [ ] Ordem alfabética
- [ ] Ordem aleatória

> Pilhas seguem LIFO: o último elemento inserido é o primeiro a ser removido.

### 5. Como uma hash table trata colisões usando encadeamento?

- [ ] Ignorando a segunda chave que colidiu
- [x] Guardando uma lista ligada de entradas em cada posição da tabela
- [ ] Aumentando a tabela automaticamente a cada colisão
- [ ] Impedindo que colisões aconteçam

> Com encadeamento, cada posição da tabela guarda a cabeça de uma lista ligada, permitindo múltiplas
> chaves na mesma posição sem perder dados.

### 6. Em uma árvore binária de busca, qual percurso produz os valores em ordem crescente?

- [ ] Pré-ordem
- [x] Em-ordem
- [ ] Pós-ordem
- [ ] Nenhum

> O percurso em-ordem (esquerda, nó, direita) visita os valores de uma BST em ordem crescente.

### 7. Qual estrutura de dados BFS utiliza para controlar a ordem de visita dos vértices de um grafo?

- [ ] Uma pilha
- [x] Uma fila
- [ ] Uma árvore binária
- [ ] Uma matriz de adjacência

> BFS usa uma fila (FIFO), processando vértices na ordem em que foram descobertos, camada por
> camada.

### 8. Qual é a vantagem do padrão "two pointers" em um array ordenado, ao buscar um par com soma específica?

- [ ] Elimina a necessidade de ordenar o array
- [x] Resolve em O(n) um problema que, com laços aninhados, seria O(n²)
- [ ] Só funciona em arrays com menos de 10 elementos
- [ ] Elimina a necessidade da estrutura de dados array

> Movendo dois índices de forma inteligente a partir das extremidades, o padrão evita comparar
> todos os pares possíveis, reduzindo a complexidade de O(n²) para O(n).

### 9. O que caracteriza a técnica de backtracking?

- [ ] Executar um algoritmo em paralelo
- [x] Tentar uma escolha, explorar recursivamente, e desfazer essa escolha antes de tentar a próxima
- [ ] Ordenar os dados antes de processá-los
- [ ] Usar apenas hash tables

> Backtracking explora uma escolha via recursão e desfaz essa escolha ao retornar, permitindo
> explorar sistematicamente todas as alternativas possíveis.

### 10. Por que buscar um cliente por ID em um dicionário (hash table) é mais rápido do que em uma lista de tuplas?

- [ ] Dicionários armazenam menos informação
- [x] A busca por chave em um dicionário é O(1) em média, enquanto em uma lista seria O(n) no pior caso
- [ ] Listas não podem guardar tuplas
- [ ] Não há diferença real de desempenho entre os dois

> Um dicionário (hash table) calcula o índice diretamente a partir da chave, evitando percorrer
> todos os elementos — diferente de uma lista, onde encontrar um item exige, no pior caso, examinar
> todos eles.
