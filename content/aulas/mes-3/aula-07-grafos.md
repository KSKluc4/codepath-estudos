---
id: "m3-a7"
mes: 3
numero: 7
titulo: "Grafos"
objetivo: "Entender grafos como modelo geral de relações e os algoritmos básicos de busca (BFS/DFS)."
duracao: 30
status: "completo"
---

## Quando a hierarquia não é suficiente

Uma árvore (Aula 6) tem uma regra rígida: cada nó tem exatamente um pai (exceto a raiz), e não há
ciclos — você nunca consegue, seguindo os filhos, voltar a um ancestral. Mas muitas relações do mundo
real não são hierárquicas: uma rede de amizades, o mapa de estradas entre cidades, os links entre
páginas de um site. Nessas relações, qualquer "ponto" pode se conectar a qualquer outro, sem regra de
hierarquia nenhuma — e é exatamente isso que um **grafo** representa.

## Terminologia básica

- **Vértice (ou nó)**: cada "ponto" do grafo (uma pessoa, uma cidade, uma página).
- **Aresta (edge)**: uma conexão entre dois vértices (uma amizade, uma estrada, um link).
- **Grafo direcionado**: as arestas têm uma direção específica (A segue B no Instagram não significa
  que B segue A de volta).
- **Grafo não-direcionado**: as arestas funcionam nos dois sentidos (uma amizade no Facebook é
  mútua).
- **Grafo com peso (weighted)**: cada aresta tem um valor associado (a distância em km entre duas
  cidades, por exemplo).

```text
Grafo não-direcionado simples:

    A --- B
    |     |
    C --- D
```

## Representando um grafo em código

Existem duas formas principais de representar um grafo:

- **Matriz de adjacência**: uma tabela (array 2D) onde `matriz[i][j] = 1` significa "existe uma
  aresta entre o vértice i e o vértice j". Simples de implementar, mas ocupa `O(V²)` de memória
  (`V` = número de vértices), mesmo que existam poucas conexões reais.
- **Lista de adjacência**: um array onde cada posição `i` guarda uma lista (frequentemente uma lista
  ligada, retomando a Aula 3) de todos os vértices conectados a `i`. Ocupa apenas `O(V + E)` de
  memória (`E` = número de arestas), muito mais eficiente quando o grafo é "esparso" (poucas conexões
  em relação ao total de vértices possíveis) — o caso mais comum na prática.

```c
#define MAX_VERTICES 4

struct NoAdjacente {
    int vertice;
    struct NoAdjacente *proximo;
};

struct NoAdjacente* lista_adjacencia[MAX_VERTICES]; // um por vértice, inicialmente todos NULL

void adicionar_aresta(int origem, int destino) {
    struct NoAdjacente *novo = malloc(sizeof(struct NoAdjacente));
    novo->vertice = destino;
    novo->proximo = lista_adjacencia[origem];
    lista_adjacencia[origem] = novo;
}
```

Para o grafo `A-B-C-D` do diagrama acima (vértices numerados 0=A, 1=B, 2=C, 3=D), chamaríamos
`adicionar_aresta` para cada conexão (e sua volta, já que é não-direcionado): A-B, B-D, D-C, C-A.

## Busca em largura (BFS): explorando "camada por camada"

**BFS** (*Breadth-First Search*) explora o grafo em camadas: primeiro visita todos os vizinhos
diretos do ponto de partida, depois os vizinhos dos vizinhos, e assim por diante — nunca "pulando"
mais fundo antes de terminar a camada atual. BFS usa uma **fila** (retomando a Aula 4!) para controlar
a ordem de visita, e um array de "visitados" para nunca processar o mesmo vértice duas vezes (essencial
para evitar loops infinitos em grafos com ciclos).

```c
void bfs(int inicio, int num_vertices) {
    int visitado[num_vertices];
    for (int i = 0; i < num_vertices; i++) visitado[i] = 0;

    struct Fila fila = { NULL, NULL };
    enqueue(&fila, inicio);
    visitado[inicio] = 1;

    while (fila.inicio != NULL) {
        int atual = dequeue(&fila);
        printf("Visitando %d\n", atual);

        struct NoAdjacente *vizinho = lista_adjacencia[atual];
        while (vizinho != NULL) {
            if (!visitado[vizinho->vertice]) {
                visitado[vizinho->vertice] = 1;
                enqueue(&fila, vizinho->vertice);
            }
            vizinho = vizinho->proximo;
        }
    }
}
```

Repare como esse código reaproveita diretamente a `struct Fila`, `enqueue` e `dequeue` construídos na
Aula 4 — BFS é, literalmente, "visitar vizinhos usando uma fila".

BFS é a estratégia certa quando você quer o **caminho mais curto** (em número de conexões) entre dois
pontos em um grafo sem pesos — por exemplo, o "grau de separação" entre duas pessoas em uma rede
social.

## Busca em profundidade (DFS): ir fundo antes de voltar

**DFS** (*Depth-First Search*) faz o oposto: aprofunda o máximo possível por um caminho antes de
voltar (*backtrack*) e tentar outro. DFS usa naturalmente uma **pilha** — e a forma mais simples de
implementar isso é através de **recursão**, aproveitando a própria stack de chamadas de função
(retomando a Aula 4 do mês 2!) como a pilha implícita:

```c
void dfs(int atual, int *visitado) {
    visitado[atual] = 1;
    printf("Visitando %d\n", atual);

    struct NoAdjacente *vizinho = lista_adjacencia[atual];
    while (vizinho != NULL) {
        if (!visitado[vizinho->vertice]) {
            dfs(vizinho->vertice, visitado); // mergulha fundo antes de continuar os outros vizinhos
        }
        vizinho = vizinho->proximo;
    }
}
```

Cada chamada recursiva de `dfs` empilha um novo frame (Aula 4 do mês 2), guardando "onde parei" com
aquele vértice, e continua explorando mais fundo antes de retornar (desempilhar) e tentar o próximo
vizinho não visitado.

## Por que o array de "visitados" é essencial

Diferente de árvores, grafos podem ter **ciclos** (A conecta a B, B conecta a C, C conecta de volta a
A). Sem controlar quais vértices já foram visitados, tanto BFS quanto DFS entrariam em um **loop
infinito**, revisitando os mesmos vértices repetidamente para sempre. O array `visitado` garante que
cada vértice seja processado exatamente uma vez.

## Grafos no mundo real

- **Redes sociais**: pessoas são vértices, conexões (amizade, seguir) são arestas. BFS encontra o
  "grau de separação" entre duas pessoas.
- **Mapas e GPS**: cidades ou cruzamentos são vértices, estradas são arestas com peso (distância ou
  tempo). Algoritmos derivados de BFS (como Dijkstra, fora do escopo deste curso) encontram a rota
  mais curta.
- **Gerenciadores de pacotes** (npm, pip, apt): pacotes são vértices, dependências são arestas
  direcionadas. DFS ajuda a determinar a ordem correta de instalação.
- **Rastreadores web (web crawlers)**: páginas são vértices, links são arestas direcionadas — motores
  de busca usam variações de BFS/DFS para "navegar" a internet inteira.

## Exercício 1: Represente o grafo

Considerando o grafo não-direcionado `A-B`, `B-C`, `A-C`, `C-D` (um triângulo A-B-C, com D pendurado
em C), escreva as chamadas de `adicionar_aresta` necessárias (lembrando que, em um grafo
não-direcionado, cada conexão precisa ser adicionada nos dois sentidos), numerando os vértices como
A=0, B=1, C=2, D=3.

### Solução

```c
adicionar_aresta(0, 1); // A-B
adicionar_aresta(1, 0); // B-A

adicionar_aresta(1, 2); // B-C
adicionar_aresta(2, 1); // C-B

adicionar_aresta(0, 2); // A-C
adicionar_aresta(2, 0); // C-A

adicionar_aresta(2, 3); // C-D
adicionar_aresta(3, 2); // D-C
```

Como o grafo é não-direcionado, cada aresta precisa ser registrada duas vezes na lista de
adjacência — uma vez a partir de cada extremidade — para que percorrer a partir de qualquer um dos
dois vértices encontre o outro como vizinho.

## Exercício 2: Trace o BFS

Usando o grafo do Exercício 1 (A=0, B=1, C=2, D=3), e considerando que a lista de adjacência de cada
vértice é percorrida na ordem em que as arestas foram adicionadas, trace a ordem de visita de um BFS
começando em A.

### Solução

```text
Fila inicial: [A]. Visitado: {A}

Retira A. Visita A. Vizinhos de A: C, B (na ordem em que foram adicionados, mais recentes primeiro).
  Enfileira C e B (nenhum visitado ainda). Fila: [C, B]. Visitado: {A, C, B}

Retira C. Visita C. Vizinhos de C: D, A, B.
  A e B já visitados, ignora. Enfileira D. Fila: [B, D]. Visitado: {A, C, B, D}

Retira B. Visita B. Vizinhos de B: C, A. Ambos já visitados, nada a enfileirar. Fila: [D]

Retira D. Visita D. Vizinho de D: C, já visitado. Fila: []. Fim.
```

Ordem de visita do BFS: **A, C, B, D**. Note como o BFS visita primeiro todos os vizinhos diretos de
A (C e B) antes de avançar para D, que só é alcançável através de C — exatamente o comportamento
"camada por camada" esperado.

## Exercício 3: Por que sem o array de visitados o algoritmo trava?

Considerando o mesmo grafo (que contém um ciclo: A-B-C-A), explique o que aconteceria se a função
`dfs` da aula fosse executada **sem** verificar e marcar vértices visitados.

### Solução

Sem o controle de visitados, ao explorar a partir de A, o DFS seguiria para B, de B para C, e de C
de volta para A (já que A-C é uma aresta do ciclo) — e, sem saber que A já foi visitado, chamaria
`dfs(A)` novamente, que exploraria B de novo, que exploraria C de novo, que voltaria para A de novo,
indefinidamente. Isso causaria uma **recursão infinita**, eventualmente esgotando a stack de chamadas
e provocando um stack overflow (retomando a Aula 4 do mês 2) — o programa travaria ou seria encerrado
à força pelo sistema operacional.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Grafos" do meu curso de programação. Contexto: a aula explica representação de
> grafos com lista de adjacência, os algoritmos de busca em largura (BFS, usando fila) e busca em
> profundidade (DFS, usando recursão/pilha), e por que marcar vértices visitados é essencial. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Qual é a principal diferença entre um grafo e uma árvore?

- [ ] Grafos não podem ter mais de 10 vértices
- [x] Um grafo permite qualquer conexão entre vértices, incluindo ciclos, sem a restrição hierárquica de uma árvore
- [ ] Árvores não podem ser representadas com listas de adjacência
- [ ] Não existe diferença real entre os dois

> Árvores têm uma estrutura hierárquica rígida (um pai por nó, sem ciclos). Grafos são mais gerais:
> qualquer vértice pode se conectar a qualquer outro, e ciclos são permitidos.

### 2. Qual é a vantagem de uma lista de adjacência sobre uma matriz de adjacência, para grafos esparsos?

- [ ] Listas de adjacência são sempre mais rápidas para qualquer operação
- [x] Listas de adjacência usam O(V + E) de memória, em vez de O(V²), evitando desperdício quando há poucas conexões
- [ ] Matrizes de adjacência não podem representar grafos não-direcionados
- [ ] Não existe diferença de uso de memória entre as duas

> Uma matriz de adjacência sempre reserva espaço para todas as V² conexões possíveis, mesmo que a
> maioria não exista. Uma lista de adjacência usa memória proporcional apenas às conexões que
> realmente existem.

### 3. Qual estrutura de dados a busca em largura (BFS) utiliza para controlar a ordem de visita?

- [ ] Uma pilha
- [x] Uma fila
- [ ] Uma árvore binária
- [ ] Uma hash table

> BFS usa uma fila (FIFO): vértices são processados na mesma ordem em que foram descobertos,
> garantindo a exploração "camada por camada".

### 4. A implementação recursiva de DFS depende de qual estrutura, de forma implícita?

- [ ] Uma fila
- [x] A stack de chamadas de função (pilha implícita)
- [ ] Uma hash table
- [ ] Uma matriz de adjacência

> Cada chamada recursiva de DFS empilha um novo frame na stack de chamadas, guardando o progresso
> daquele ponto de exploração antes de mergulhar mais fundo — funcionando, na prática, como uma
> pilha.

### 5. Por que é necessário manter um array (ou estrutura equivalente) de vértices "visitados" em BFS e DFS?

- [ ] Para economizar memória
- [x] Para evitar reprocessar (ou entrar em loop infinito) em grafos que contêm ciclos
- [ ] Porque isso é exigido pela sintaxe da linguagem C
- [ ] Para tornar o algoritmo mais lento de propósito

> Sem controlar quais vértices já foram visitados, um grafo com ciclos faria os algoritmos
> revisitarem os mesmos vértices indefinidamente, nunca terminando (ou causando um stack overflow, no
> caso de DFS recursivo).
