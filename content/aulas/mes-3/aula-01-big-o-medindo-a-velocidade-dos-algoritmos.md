---
id: "m3-a1"
mes: 3
numero: 1
titulo: "Big O — medindo a velocidade dos algoritmos"
objetivo: "Aprender a notação Big O para comparar a eficiência de algoritmos independente do hardware."
duracao: 30
status: "completo"
---

## Bem-vindo ao mês 3

Nos últimos dois meses você entendeu a máquina por dentro e aprendeu a controlar memória diretamente
em C. Agora vamos usar essa base para estudar **estruturas de dados e algoritmos** — as ferramentas
que todo programador usa para organizar informação e resolver problemas de forma eficiente. Este é,
também, o assunto mais cobrado em entrevistas técnicas de programação.

Tudo começa com uma pergunta simples: como comparar se um algoritmo é "rápido" ou "lento"? A
resposta não pode depender do computador em que você testa — um algoritmo ruim rodando em um
supercomputador ainda pode perder para um algoritmo bom rodando em um celular antigo, se o tamanho do
problema for grande o suficiente. Precisamos de uma forma de medir eficiência que seja **independente
de hardware**. Essa forma se chama **Big O**.

## Encontrando um nome na lista telefônica

Imagine que você precisa encontrar o número de telefone de alguém em uma lista telefônica física,
com um milhão de nomes, organizados em ordem alfabética. Existem (pelo menos) duas estratégias:

- **Estratégia 1 — Busca linear**: começar na primeira página e ler nome por nome, até encontrar o
  que você procura (ou virar todas as páginas). No pior caso, você folheia a lista inteira.
- **Estratégia 2 — Busca binária**: abrir a lista bem no meio. Se o nome que você procura vem antes
  alfabeticamente, você sabe que só precisa olhar a metade da esquerda — e pode **descartar** a
  metade da direita inteira, sem nunca olhar para ela. Repita esse processo na metade restante, até
  sobrar apenas o nome procurado.

A busca binária é **absurdamente** mais rápida: em uma lista de 1 milhão de nomes, a busca linear
pode levar até 1 milhão de comparações no pior caso, enquanto a busca binária leva, no máximo, cerca
de **20 comparações** (porque `2²⁰ ≈ 1 milhão` — cada comparação corta o problema pela metade). Essa
diferença — entre "cresce proporcionalmente ao tamanho da lista" e "cresce muito mais devagar que o
tamanho da lista" — é exatamente o tipo de coisa que Big O descreve formalmente.

## O que Big O realmente mede

Big O descreve como o **tempo de execução** (ou o **espaço de memória** usado) de um algoritmo
**cresce** conforme o tamanho da entrada (`n`) cresce — não o tempo exato em segundos (que depende do
hardware), mas a **taxa de crescimento**. Por convenção, Big O costuma descrever o **pior caso**
(o cenário mais desfavorável possível para aquele algoritmo).

Duas simplificações importantes fazem parte da notação:

1. **Constantes são ignoradas**: um algoritmo que faz `2n` operações e outro que faz `n` operações
   são ambos classificados como `O(n)` — o que importa é que ambos crescem *linearmente* com `n`, não
   o fator exato.
2. **Termos de menor ordem são descartados**: um algoritmo que faz `n² + n` operações é classificado
   como `O(n²)`, porque, para valores grandes de `n`, o termo `n²` domina completamente o `n` (por
   exemplo, com `n = 1000`: `n² = 1.000.000` contra `n = 1000` — o `n` é praticamente irrelevante
   perto do `n²`).

## As complexidades mais comuns

| Notação | Nome | Exemplo | Analogia |
|---------|------|---------|----------|
| `O(1)` | Constante | Acessar `array[5]` diretamente | Pegar o livro de um número específico de prateleira, sem precisar procurar |
| `O(log n)` | Logarítmica | Busca binária | Adivinhar um número entre 1 e 100 sempre "cortando ao meio" |
| `O(n)` | Linear | Percorrer uma lista inteira uma vez | Ler página por página de um livro, do início ao fim |
| `O(n log n)` | Linearítmica | Algoritmos de ordenação eficientes (merge sort) | Organizar cartas dividindo em grupos menores e juntando de forma ordenada |
| `O(n²)` | Quadrática | Comparar cada elemento com todos os outros (laços aninhados) | Cada pessoa em uma sala apertando a mão de todas as outras |
| `O(2ⁿ)` | Exponencial | Calcular Fibonacci recursivamente, sem otimização | Cada decisão dobra o número de caminhos possíveis a explorar |

Visualizando a taxa de crescimento relativa, da mais rápida para a mais lenta, conforme `n` cresce:

```text
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)
(mais rápido)                                (mais lento)
```

## Analisando complexidade em código

Vamos analisar alguns trechos de código para praticar identificar sua complexidade. Considere `n`
como o tamanho da lista/array recebido.

**Exemplo O(1):**

```python
def primeiro_elemento(lista):
    return lista[0]
```

Não importa se a lista tem 10 ou 10 milhões de elementos — acessar a primeira posição sempre leva a
mesma quantidade de "trabalho". Por isso, `O(1)`.

**Exemplo O(n):**

```python
def somar_todos(lista):
    total = 0
    for numero in lista:
        total += numero
    return total
```

O laço percorre cada elemento da lista exatamente uma vez. Se a lista dobrar de tamanho, o tempo de
execução também dobra (aproximadamente) — uma relação linear, `O(n)`.

**Exemplo O(n²):**

```python
def tem_duplicata(lista):
    for i in range(len(lista)):
        for j in range(len(lista)):
            if i != j and lista[i] == lista[j]:
                return True
    return False
```

Para cada elemento (`n` possibilidades), o código percorre novamente a lista inteira (mais `n`
possibilidades) — um laço dentro de outro laço, ambos de tamanho `n`, resulta em `n × n = n²`
operações no total. Se a lista dobrar de tamanho, o tempo de execução **quadruplica**
(aproximadamente) — a marca registrada de `O(n²)`.

**Exemplo O(log n):**

```python
def busca_binaria(lista_ordenada, alvo):
    inicio, fim = 0, len(lista_ordenada) - 1
    while inicio <= fim:
        meio = (inicio + fim) // 2
        if lista_ordenada[meio] == alvo:
            return meio
        elif lista_ordenada[meio] < alvo:
            inicio = meio + 1
        else:
            fim = meio - 1
    return -1
```

A cada iteração do `while`, a região de busca (`fim - inicio`) é **cortada pela metade**. Isso
significa que o número de iterações necessárias cresce muito mais devagar que `n` — dobrar o tamanho
da lista adiciona apenas **uma** iteração extra no pior caso, não o dobro. Essa é a assinatura de
`O(log n)`.

## Por que isso importa na prática

Entender Big O ajuda você a prever, antes mesmo de rodar o código, se um algoritmo vai ficar
inviavelmente lento à medida que os dados crescem. Um algoritmo `O(n²)` pode parecer perfeitamente
rápido com 100 elementos (10.000 operações, quase instantâneo), mas se tornar impraticável com 1
milhão de elementos (1 trilhão de operações). Escolher a estrutura de dados e o algoritmo certos —
exatamente o que vamos estudar no restante deste mês — é frequentemente a diferença entre um sistema
que escala bem e um que trava conforme a base de usuários cresce.

## Exercício 1: Identifique a complexidade

Qual é a complexidade Big O da função abaixo, em função de `n` (o tamanho de `lista`)? Explique seu
raciocínio.

```python
def imprimir_pares(lista):
    for item in lista:
        if item % 2 == 0:
            print(item)
```

### Solução

A complexidade é `O(n)`. Mesmo que apenas alguns elementos (os pares) sejam impressos, o laço `for`
ainda **percorre todos os `n` elementos da lista** para verificar a condição `item % 2 == 0` em cada
um deles. O trabalho de verificação é constante por elemento, e é feito uma vez para cada um dos `n`
elementos, resultando em uma relação linear com o tamanho da entrada.

## Exercício 2: Encontre a complexidade em laços aninhados

Qual é a complexidade Big O da função abaixo? Explique como cada laço contribui para o resultado
final.

```python
def imprimir_pares_de_letras(palavra):
    for letra1 in palavra:
        for letra2 in palavra:
            print(letra1, letra2)
```

### Solução

A complexidade é `O(n²)`, onde `n` é o tamanho de `palavra`. Para cada uma das `n` letras no laço
externo, o laço interno percorre novamente todas as `n` letras — resultando em `n × n = n²` pares
impressos ao total. Esse é exatamente o padrão de dois laços aninhados, ambos dependentes do mesmo
tamanho de entrada `n`, que caracteriza a complexidade quadrática.

## Exercício 3: Por que a busca binária é O(log n)?

Considerando uma lista ordenada com 1024 elementos, calcule quantas vezes, no máximo, o espaço de
busca precisa ser cortado pela metade (como no algoritmo `busca_binaria` visto na aula) até sobrar
apenas 1 elemento. Relacione o resultado com a definição de `O(log n)`.

### Solução

Cortando 1024 pela metade repetidamente: `1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1`.
Contando os cortes: são exatamente **10 cortes** até sobrar 1 elemento.

Não é coincidência que `2¹⁰ = 1024`: o número de vezes que você precisa dividir `n` por 2 até chegar
a 1 é exatamente `log₂(n)` — nesse caso, `log₂(1024) = 10`. Essa é a própria definição de
complexidade logarítmica: o número de passos necessários cresce proporcionalmente ao **logaritmo**
do tamanho da entrada, não à entrada em si. É por isso que a busca binária permanece extremamente
rápida mesmo com listas gigantescas: dobrar o tamanho da lista (de 1024 para 2048) adiciona apenas
**mais um** corte necessário, não o dobro do trabalho.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Big O — medindo a velocidade dos algoritmos" do meu curso de programação.
> Contexto: a aula explica o que a notação Big O mede (taxa de crescimento do tempo/espaço conforme
> a entrada cresce), e as complexidades mais comuns (O(1), O(log n), O(n), O(n²)). Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que a notação Big O realmente mede?

- [ ] O tempo exato, em segundos, que um algoritmo leva para rodar
- [x] Como o tempo (ou espaço) de execução de um algoritmo cresce conforme o tamanho da entrada aumenta
- [ ] Quantas linhas de código um programa tem
- [ ] A quantidade de memória RAM instalada no computador

> Big O descreve a taxa de crescimento do tempo ou espaço de execução em função do tamanho da
> entrada, de forma independente do hardware específico usado para rodar o algoritmo.

### 2. Qual das opções abaixo representa a ordem correta, do algoritmo mais rápido para o mais lento, conforme `n` cresce?

- [x] O(1), O(log n), O(n), O(n²)
- [ ] O(n²), O(n), O(log n), O(1)
- [ ] O(n), O(1), O(n²), O(log n)
- [ ] O(log n), O(1), O(n²), O(n)

> A ordem correta, da menor para a maior taxa de crescimento, é: O(1) (constante) < O(log n)
> (logarítmica) < O(n) (linear) < O(n²) (quadrática).

### 3. Qual das opções abaixo é um exemplo típico de operação O(1)?

- [x] Acessar um elemento de um array por índice, como array[3]
- [ ] Percorrer uma lista inteira com um laço for
- [ ] Comparar cada elemento de uma lista com todos os outros
- [ ] Ordenar uma lista inteira

> Acessar um elemento por índice em um array leva sempre a mesma quantidade de trabalho,
> independente do tamanho do array — por isso é O(1), constante.

### 4. Dois laços `for` aninhados, ambos percorrendo uma lista de tamanho `n`, resultam tipicamente em qual complexidade?

- [ ] O(n)
- [ ] O(log n)
- [x] O(n²)
- [ ] O(1)

> Cada uma das `n` iterações do laço externo dispara outras `n` iterações do laço interno,
> resultando em `n × n = n²` operações no total — a assinatura da complexidade quadrática.

### 5. Por que a busca binária é muito mais rápida que a busca linear em listas grandes?

- [ ] Porque ela verifica todos os elementos ao mesmo tempo
- [x] Porque ela descarta metade do espaço de busca a cada passo, fazendo o número de passos crescer de forma logarítmica, não linear
- [ ] Porque ela só funciona em computadores mais rápidos
- [ ] Porque ela usa menos memória RAM que a busca linear

> A busca binária corta o espaço de busca pela metade a cada passo, resultando em O(log n) passos —
> uma taxa de crescimento muito mais lenta que os O(n) passos da busca linear, especialmente
> perceptível em listas grandes.
