---
id: "m3-a8"
mes: 3
numero: 8
titulo: "Padrões de entrevista técnica"
objetivo: "Aprender padrões recorrentes usados para resolver problemas de entrevistas técnicas com eficiência."
duracao: 35
status: "completo"
---

## Não é sobre decorar problemas, é sobre reconhecer padrões

Entrevistas técnicas de programação costumam testar a mesma coisa, com roupagens diferentes: você
consegue reconhecer **qual padrão de solução** se aplica a um problema novo? Esta aula (usando Python,
pela clareza para focar na lógica, sem o "ruído" de gerenciar memória manualmente como em C) cobre
três dos padrões mais recorrentes: **two pointers**, **sliding window**, e **recursão/backtracking**.

## Two pointers: dois "dedos" percorrendo os dados

O padrão **two pointers** usa dois índices (ponteiros, no sentido de "posições que apontam para
algo", não ponteiros de memória de C) percorrendo uma estrutura — frequentemente a partir de
extremidades opostas — para resolver em `O(n)` problemas que, ingenuamente, pareceriam exigir `O(n²)`.

**Problema clássico**: dado um array **ordenado**, encontre dois números cuja soma seja igual a um
valor alvo.

Uma solução ingênua compararia cada par possível (`O(n²)`, dois laços aninhados, como vimos na Aula
1). O padrão two pointers resolve em uma única passada:

```python
def par_com_soma(lista_ordenada, alvo):
    esquerda = 0
    direita = len(lista_ordenada) - 1

    while esquerda < direita:
        soma_atual = lista_ordenada[esquerda] + lista_ordenada[direita]
        if soma_atual == alvo:
            return (lista_ordenada[esquerda], lista_ordenada[direita])
        elif soma_atual < alvo:
            esquerda += 1  # soma pequena demais: precisa de um número maior
        else:
            direita -= 1   # soma grande demais: precisa de um número menor
    return None
```

A lógica funciona porque a lista está **ordenada**: se a soma atual for menor que o alvo, mover o
ponteiro `esquerda` para a direita é a única forma de aumentar a soma (já que tudo à direita é maior
ou igual). Se for maior, mover `direita` para a esquerda é a única forma de diminuir. Cada ponteiro
se move no máximo `n` vezes ao todo, resultando em `O(n)` — uma melhora enorme sobre `O(n²)`.

## Sliding window: uma "janela" que desliza sem recomeçar do zero

O padrão **sliding window** (janela deslizante) mantém uma "janela" — um trecho contíguo dos dados —
que se expande ou encolhe, **reaproveitando** cálculos já feitos em vez de recomeçar do zero a cada
posição.

**Problema clássico**: encontre a soma máxima de qualquer subarray de tamanho `k`.

Uma solução ingênua recalcularia a soma de cada janela de tamanho `k` do zero (`O(n × k)`). A janela
deslizante calcula a primeira soma uma vez, e depois **atualiza** essa soma a cada passo, subtraindo
o elemento que sai da janela e somando o que entra:

```python
def soma_maxima_subarray(lista, k):
    soma_atual = sum(lista[:k])  # soma da primeira janela
    soma_maxima = soma_atual

    for i in range(k, len(lista)):
        soma_atual += lista[i] - lista[i - k]  # desliza a janela: +1 elemento, -1 elemento
        soma_maxima = max(soma_maxima, soma_atual)

    return soma_maxima
```

Repare: em vez de recalcular a soma inteira da janela a cada posição (`O(k)` por posição, `O(n × k)`
no total), atualizamos a soma existente com apenas uma subtração e uma soma por passo — `O(1)` por
posição, `O(n)` no total, independente do tamanho de `k`.

## Recursão e backtracking: explorar, e desfazer se não der certo

Alguns problemas pedem para explorar **todas as combinações ou possibilidades** — gerar todos os
subconjuntos de um conjunto, todas as permutações de uma lista, todos os caminhos possíveis em um
labirinto. Esses problemas costumam se encaixar bem em **recursão** (retomando a Aula 4 do mês 2), e
especificamente em uma técnica chamada **backtracking**: tente uma escolha, avance recursivamente; se
não funcionar (ou depois de explorar totalmente aquele caminho), **desfaça** a escolha e tente a
próxima.

**Problema clássico**: gerar todos os subconjuntos (o "conjunto das partes") de uma lista.

```python
def gerar_subconjuntos(lista, indice=0, atual=None):
    if atual is None:
        atual = []
    if indice == len(lista):
        print(atual)
        return

    # Escolha 1: NÃO incluir o elemento atual
    gerar_subconjuntos(lista, indice + 1, atual)

    # Escolha 2: incluir o elemento atual, explorar, depois desfazer (backtrack)
    atual.append(lista[indice])
    gerar_subconjuntos(lista, indice + 1, atual)
    atual.pop()  # desfaz a escolha antes de voltar (o "back" do backtracking)
```

Para cada elemento, o algoritmo explora **duas ramificações**: uma sem incluir o elemento, outra
incluindo. O `atual.pop()` depois da segunda chamada recursiva é o coração do backtracking: ele
remove o elemento que havia sido adicionado, para que a próxima tentativa (em outro ramo da recursão)
comece de um estado limpo, sem "vazar" escolhas de um caminho para outro.

## Como reconhecer qual padrão usar

| Pista no enunciado | Padrão provável |
|---------------------|-------------------|
| Array ordenado, buscando um par ou trio com alguma soma/condição | Two pointers |
| "Subarray contíguo" ou "substring contínua" de tamanho fixo ou variável | Sliding window |
| "Todas as combinações", "todos os caminhos", "todas as formas de..." | Recursão / backtracking |
| Estrutura em árvore ou grafo, decisões em sequência com possibilidade de "voltar atrás" | Recursão / backtracking |

## Exercício 1: Aplique two pointers

Usando a função `par_com_soma` da aula, encontre (manualmente, mostrando os passos) o par de números
que soma `9` na lista ordenada `[1, 2, 4, 6, 8]`.

### Solução

```text
esquerda=0 (valor 1), direita=4 (valor 8). Soma = 1+8 = 9. Igual ao alvo!
```

O par encontrado é **(1, 8)**, já na primeira comparação. Se a soma tivesse sido menor que 9 (por
exemplo, se o primeiro valor fosse menor), `esquerda` avançaria; se fosse maior, `direita`
recuaria — sempre em busca de uma soma mais próxima do alvo, aproveitando que a lista já está
ordenada.

## Exercício 2: Aplique sliding window

Usando a lógica de `soma_maxima_subarray`, calcule manualmente a soma máxima de qualquer subarray de
tamanho `3` na lista `[2, 1, 5, 1, 3, 2]`. Mostre a soma de cada janela.

### Solução

```text
Janela inicial [2, 1, 5]: soma = 8
Desliza: -2 (sai), +1 (entra) → [1, 5, 1]: soma = 8 - 2 + 1 = 7
Desliza: -1 (sai), +3 (entra) → [5, 1, 3]: soma = 7 - 1 + 3 = 9
Desliza: -5 (sai), +2 (entra) → [1, 3, 2]: soma = 9 - 5 + 2 = 6
```

As somas calculadas foram `8, 7, 9, 6`. A soma máxima é **9**, correspondente à janela `[5, 1, 3]`.
Repare como cada nova soma foi calculada a partir da anterior (subtraindo o elemento que saiu,
somando o que entrou), sem nunca precisar somar os 3 elementos de uma janela do zero.

## Exercício 3: Trace o backtracking

Usando a lógica de `gerar_subconjuntos`, trace manualmente (listando cada subconjunto gerado, na
ordem em que apareceriam) a execução para a lista `[1, 2]`.

### Solução

```text
indice=0, atual=[]
  Escolha 1 (não incluir 1): indice=1, atual=[]
    Escolha 1 (não incluir 2): indice=2, atual=[] → imprime []
    Escolha 2 (incluir 2): atual=[2], indice=2 → imprime [2]
    (desfaz: atual volta a [])
  Escolha 2 (incluir 1): atual=[1], indice=1
    Escolha 1 (não incluir 2): indice=2, atual=[1] → imprime [1]
    Escolha 2 (incluir 2): atual=[1, 2], indice=2 → imprime [1, 2]
    (desfaz: atual volta a [1], depois a [])
```

Os subconjuntos gerados, na ordem: `[]`, `[2]`, `[1]`, `[1, 2]` — exatamente os 4 (`2²`) subconjuntos
possíveis de um conjunto com 2 elementos. Repare como o "desfazer" (`atual.pop()`) garante que, ao
voltar de uma ramificação da recursão, `atual` esteja sempre no estado correto para a próxima
tentativa, sem misturar escolhas de ramos diferentes.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Padrões de entrevista técnica" do meu curso de programação. Contexto: a aula
> explica os padrões two pointers (busca em array ordenado), sliding window (subarrays contíguos) e
> recursão/backtracking (explorar e desfazer escolhas), com exemplos em Python. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Em qual situação o padrão "two pointers" costuma ser mais útil?

- [ ] Ao processar dados completamente desordenados e sem nenhuma estrutura
- [x] Ao buscar um par (ou trio) de valores com alguma condição de soma em um array já ordenado
- [ ] Ao gerar todas as combinações possíveis de uma lista
- [ ] Ao percorrer uma árvore binária

> Two pointers aproveita a ordenação de um array para mover dois índices de forma inteligente,
> resolvendo em O(n) problemas de busca de pares/somas que, ingenuamente, seriam O(n²).

### 2. Qual é a principal vantagem da técnica "sliding window" sobre recalcular cada janela do zero?

- [ ] Ela usa menos memória para armazenar a lista
- [x] Ela reaproveita o cálculo da janela anterior, atualizando a soma com poucas operações em vez de somar tudo novamente
- [ ] Ela ordena a lista automaticamente
- [ ] Ela elimina a necessidade de laços (loops)

> A sliding window atualiza o resultado da janela anterior (subtraindo o elemento que saiu, somando
> o que entrou), evitando o custo de recalcular a soma inteira a cada nova posição.

### 3. O que caracteriza a técnica de "backtracking"?

- [ ] Executar um algoritmo duas vezes para conferir o resultado
- [x] Tentar uma escolha, explorar recursivamente, e desfazer essa escolha antes de tentar a próxima alternativa
- [ ] Usar apenas laços for, nunca recursão
- [ ] Ordenar os dados antes de processá-los

> Backtracking explora uma escolha através de recursão e, ao retornar (seja por sucesso ou
> esgotamento das possibilidades), desfaz essa escolha para que a próxima tentativa comece de um
> estado limpo.

### 4. Qual tipo de problema é mais adequado para recursão/backtracking, entre as opções abaixo?

- [ ] Encontrar a soma máxima de um subarray de tamanho fixo
- [ ] Buscar um valor em um array ordenado
- [x] Gerar todas as permutações possíveis de uma lista de elementos
- [ ] Somar todos os elementos de uma lista

> Gerar todas as permutações exige explorar sistematicamente todas as combinações possíveis de
> escolhas — o cenário clássico onde recursão com backtracking se encaixa naturalmente.

### 5. No exemplo de `gerar_subconjuntos`, qual é o propósito de `atual.pop()` logo após a segunda chamada recursiva?

- [ ] Melhorar a performance do algoritmo
- [x] Desfazer a inclusão do elemento atual, para que a próxima ramificação da recursão comece com o estado correto
- [ ] Ordenar a lista atual
- [ ] Encerrar a recursão imediatamente

> `atual.pop()` remove o elemento que havia sido adicionado antes da chamada recursiva, garantindo
> que, ao explorar a próxima alternativa (em outro ramo da árvore de recursão), o estado de `atual`
> não contenha escolhas de ramos anteriores.
