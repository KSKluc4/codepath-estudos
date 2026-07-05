---
id: "m3-a6"
mes: 3
numero: 6
titulo: "Árvores"
objetivo: "Entender árvores binárias, árvores de busca e por que estruturas hierárquicas são úteis."
duracao: 30
status: "completo"
---

## De correntes a ramificações

A lista ligada da Aula 3 é uma **cadeia**: cada nó aponta para exatamente um próximo nó. Mas muita
informação do mundo real não é uma linha reta — é uma **hierarquia**, com ramificações. Pense em uma
árvore genealógica, na estrutura de pastas do seu computador, ou no organograma de uma empresa: cada
"item" pode ter vários "itens abaixo dele". Isso é exatamente o que uma **árvore**, como estrutura de
dados, representa.

## Terminologia básica

- **Nó (node)**: cada elemento da árvore (igual à lista ligada).
- **Raiz (root)**: o nó do topo, sem "pai" — o ponto de partida da árvore inteira.
- **Pai / filho**: se o nó A aponta para o nó B, A é o *pai* de B, e B é *filho* de A.
- **Folha (leaf)**: um nó sem nenhum filho — o "fim de um galho".
- **Subárvore**: qualquer nó, junto com todos os seus descendentes, forma uma árvore menor dentro da
  árvore maior.

Uma **árvore binária** é uma árvore em que cada nó tem **no máximo dois filhos**, geralmente
chamados de filho **esquerdo** e filho **direito**.

```c
struct No {
    int valor;
    struct No *esquerda;
    struct No *direita;
};
```

## Árvore binária de busca (BST): ordem que acelera a busca

Uma **árvore binária de busca** (*Binary Search Tree*, ou BST) adiciona uma regra de organização
poderosa: para **todo** nó da árvore, todos os valores na subárvore **esquerda** são menores que o
valor do nó, e todos os valores na subárvore **direita** são maiores.

```text
              50
            /    \
          30      70
         /  \    /  \
       20   40  60   80
```

Repare: a partir do `50`, tudo à esquerda (`30, 20, 40`) é menor que `50`, e tudo à direita (`70, 60,
80`) é maior. Essa mesma regra se aplica recursivamente em cada subárvore — por exemplo, a partir do
`30`, o `20` (esquerda) é menor e o `40` (direita) é maior.

## Buscando em uma BST

Essa organização permite buscar um valor de forma muito parecida com a busca binária da Aula 1:
compare o valor procurado com o nó atual; se for igual, encontrou; se for menor, vá para a esquerda;
se for maior, vá para a direita — descartando a outra metade da árvore a cada passo.

```c
struct No* buscar(struct No *raiz, int valor) {
    if (raiz == NULL || raiz->valor == valor) {
        return raiz; // encontrado, ou chegou ao fim sem encontrar (NULL)
    }
    if (valor < raiz->valor) {
        return buscar(raiz->esquerda, valor);
    }
    return buscar(raiz->direita, valor);
}
```

Se a árvore estiver **balanceada** (aproximadamente a mesma quantidade de nós de cada lado, em cada
nível), buscar um valor é `O(log n)` — exatamente como a busca binária, já que cada comparação
descarta metade dos nós restantes. Isso é uma vantagem enorme sobre percorrer uma lista ligada
inteira (`O(n)`), mantendo a flexibilidade de inserir e remover elementos sem precisar deslocar nada
(diferente de um array ordenado, que exigiria deslocamentos `O(n)` para manter a ordem).

## Inserindo em uma BST

Inserir segue a mesma lógica de comparação: descemos a árvore comparando o novo valor com cada nó,
indo para a esquerda ou direita, até encontrar um espaço vazio (`NULL`) onde o novo nó deve ser
colocado.

```c
struct No* inserir(struct No *raiz, int valor) {
    if (raiz == NULL) {
        struct No *novo = malloc(sizeof(struct No));
        novo->valor = valor;
        novo->esquerda = NULL;
        novo->direita = NULL;
        return novo;
    }
    if (valor < raiz->valor) {
        raiz->esquerda = inserir(raiz->esquerda, valor);
    } else {
        raiz->direita = inserir(raiz->direita, valor);
    }
    return raiz;
}
```

## Percorrendo uma árvore: três ordens clássicas

Diferente de uma lista ligada (que só tem uma ordem natural de percorrer), uma árvore pode ser
percorrida de várias formas. As três mais importantes, todas recursivas:

- **Pré-ordem (pre-order)**: visita o **nó**, depois a subárvore esquerda, depois a direita. Útil
  para copiar a estrutura de uma árvore.
- **Em-ordem (in-order)**: visita a subárvore esquerda, depois o **nó**, depois a direita. Em uma
  BST, isso produz os valores em **ordem crescente** — uma propriedade extremamente útil.
- **Pós-ordem (post-order)**: visita a subárvore esquerda, depois a direita, depois o **nó**. Útil
  para liberar a memória de uma árvore inteira (você só apaga um nó depois de já ter cuidado de seus
  filhos).

```c
void em_ordem(struct No *raiz) {
    if (raiz == NULL) return;
    em_ordem(raiz->esquerda);
    printf("%d ", raiz->valor);
    em_ordem(raiz->direita);
}
```

Aplicando `em_ordem` na árvore de exemplo desta aula (raiz `50`), a saída seria:

```text
20 30 40 50 60 70 80
```

Repare que a saída sai **perfeitamente ordenada** — essa é a "mágica" do percurso em-ordem sobre uma
BST, e uma das razões práticas mais usadas dessa estrutura: ela mantém dados sempre prontos para
serem lidos em ordem, sem nenhuma etapa extra de ordenação.

## O risco de uma árvore desbalanceada

O desempenho `O(log n)` depende da árvore estar razoavelmente **balanceada**. Se você inserir valores
já ordenados (por exemplo, `10, 20, 30, 40, 50`, nessa ordem, em uma BST vazia), cada novo valor é
sempre maior que o anterior, então cada um vira filho direito do anterior — a árvore degenera em,
efetivamente, **uma lista ligada disfarçada**:

```text
10
  \
   20
     \
      30
        \
         40
           \
            50
```

Nesse cenário degenerado, buscar o valor `50` exige percorrer todos os 5 nós — de volta a `O(n)`,
perdendo toda a vantagem da estrutura em árvore. Existem árvores auto-balanceadas (como AVL e
árvores rubro-negras) que resolvem esse problema automaticamente, reorganizando a árvore durante
inserções — um assunto mais avançado, além do escopo deste curso, mas importante saber que existe.

## Exercício 1: Construa a árvore

Inserindo, nessa ordem, os valores `40, 20, 60, 10, 30, 70` em uma BST vazia (usando a lógica de
`inserir` vista na aula), desenhe a árvore resultante.

### Solução

```text
Inserir 40: raiz da árvore.
Inserir 20: menor que 40 → vai para a esquerda de 40.
Inserir 60: maior que 40 → vai para a direita de 40.
Inserir 10: menor que 40 → esquerda; menor que 20 → esquerda de 20.
Inserir 30: menor que 40 → esquerda; maior que 20 → direita de 20.
Inserir 70: maior que 40 → direita; maior que 60 → direita de 60.
```

Árvore final:

```text
              40
            /    \
          20      60
         /  \        \
       10   30        70
```

## Exercício 2: Percurso em-ordem

Usando a árvore construída no Exercício 1, escreva a sequência de valores produzida por um percurso
**em-ordem** (esquerda, nó, direita).

### Solução

```text
10 20 30 40 60 70
```

Seguindo a regra recursiva (visitar toda a subárvore esquerda, depois o nó, depois toda a subárvore
direita) a partir da raiz `40`: primeiro visitamos completamente a subárvore esquerda (que produz
`10, 20, 30`, aplicando a mesma regra recursivamente), depois o próprio `40`, e por fim a subárvore
direita (que produz `60, 70`). O resultado sai perfeitamente ordenado — exatamente a propriedade útil
do percurso em-ordem sobre uma BST.

## Exercício 3: Quantas comparações a busca faz?

Usando a árvore do Exercício 1, quantas comparações a função `buscar` precisa fazer para encontrar o
valor `30`? E para descobrir que o valor `50` **não** existe na árvore?

### Solução

**Buscando `30`:** `30` vs `40` (raiz) → menor, vai à esquerda. `30` vs `20` → maior, vai à direita.
`30` vs `30` → igual, encontrado! Total: **3 comparações**.

**Buscando `50`:** `50` vs `40` → maior, vai à direita. `50` vs `60` → menor, vai à esquerda. A
subárvore esquerda de `60` é `NULL` — a busca termina, `50` não existe na árvore. Total: **2
comparações** até concluir que o valor não está presente.

Em ambos os casos, o número de comparações corresponde exatamente à profundidade percorrida na
árvore, ilustrando por que árvores balanceadas oferecem busca em tempo proporcional à altura da
árvore (`O(log n)`, quando balanceada), em vez de examinar todos os nós.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Árvores" do meu curso de programação. Contexto: a aula explica árvores binárias
> de busca (BST), a regra de ordenação (esquerda menor, direita maior), os percursos pré-ordem,
> em-ordem e pós-ordem, e o risco de uma árvore desbalanceada degenerar para O(n). Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Em uma árvore binária de busca (BST), qual é a regra de organização dos valores?

- [ ] Todos os valores são iguais em cada nível
- [x] Para todo nó, os valores da subárvore esquerda são menores, e os da subárvore direita são maiores
- [ ] Os valores são organizados em ordem alfabética de inserção
- [ ] Não existe regra, os valores ficam em posições aleatórias

> A propriedade fundamental de uma BST é: em qualquer nó, tudo à esquerda é menor, e tudo à direita
> é maior que o valor daquele nó — regra que se aplica recursivamente em toda a árvore.

### 2. Qual percurso de árvore produz os valores em ordem crescente, em uma BST?

- [ ] Pré-ordem
- [x] Em-ordem
- [ ] Pós-ordem
- [ ] Nenhum percurso produz ordem crescente

> O percurso em-ordem (esquerda, nó, direita) visita os valores de uma BST exatamente em ordem
> crescente, graças à propriedade de organização da árvore.

### 3. O que torna uma árvore diferente de uma lista ligada?

- [ ] Árvores não podem ser percorridas
- [x] Cada nó de uma árvore pode ter múltiplos filhos (ramificações), enquanto cada nó de uma lista ligada aponta para apenas um próximo nó
- [ ] Árvores não usam ponteiros
- [ ] Listas ligadas sempre são mais rápidas que árvores

> Uma lista ligada é uma cadeia linear (um nó, um próximo). Uma árvore permite ramificações — cada
> nó pode ter mais de um filho, formando uma estrutura hierárquica.

### 4. O que acontece com o desempenho de busca de uma BST se ela ficar completamente desbalanceada (por exemplo, inserindo valores já ordenados)?

- [ ] O desempenho melhora, ficando O(1)
- [x] A árvore degenera, na prática, em uma lista ligada, e a busca volta a ser O(n)
- [ ] A árvore para de funcionar e gera um erro
- [ ] Não há impacto no desempenho

> Sem balanceamento, inserir valores já ordenados faz cada nó ter apenas um filho, formando
> efetivamente uma cadeia linear — perdendo a vantagem logarítmica de busca de uma árvore
> balanceada.

### 5. Qual percurso é mais adequado para liberar (free) toda a memória de uma árvore com segurança?

- [ ] Pré-ordem
- [ ] Em-ordem
- [x] Pós-ordem
- [ ] Não importa a ordem escolhida

> O percurso pós-ordem visita os filhos antes do próprio nó, garantindo que um nó só seja liberado
> depois que todos os seus descendentes já tenham sido processados (e liberados) primeiro.
