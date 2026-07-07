---
numero: 3
titulo: "Listas"
nivel: "basico"
objetivo: "Criar, percorrer e modificar listas, a estrutura de dados mais usada em Python."
duracao: 12
status: "completo"
---

## Conceito

Uma lista (`list`) é uma coleção **ordenada** e **mutável** de itens, que podem ser de tipos
diferentes dentro da mesma lista. É a estrutura de dados mais usada no dia a dia de Python — pense
nela como um array dinâmico que cresce e encolhe sozinho.

## Sintaxe

```python
numeros = [1, 2, 3, 4, 5]
mista = [1, "dois", 3.0, True]
vazia = []

numeros[0]        # 1 — acesso por índice
numeros[-1]       # 5 — último elemento
numeros[1:3]      # [2, 3] — fatiamento, igual em strings

len(numeros)       # 5
3 in numeros        # True — verifica se o valor existe na lista
```

## Exemplos comentados

```python
frutas = ["maçã", "banana"]

frutas.append("uva")           # adiciona no final: ["maçã", "banana", "uva"]
frutas.insert(1, "pera")        # insere na posição 1: ["maçã", "pera", "banana", "uva"]
frutas.remove("banana")         # remove pelo valor: ["maçã", "pera", "uva"]
ultima = frutas.pop()           # remove e retorna o último item: "uva"

frutas.sort()                    # ordena a lista in-place (modifica a original)
frutas.reverse()                 # inverte a ordem in-place

# Percorrendo uma lista
for fruta in frutas:
    print(fruta)

# Percorrendo com índice
for indice, fruta in enumerate(frutas):
    print(indice, fruta)

# Copiando uma lista (cuidado: "copia = frutas" NÃO copia, só cria outro nome para a mesma lista)
copia = frutas.copy()
copia2 = frutas[:]  # outra forma comum de copiar

# Listas dentro de listas (matriz)
matriz = [[1, 2], [3, 4]]
matriz[0][1]  # 2
```

## Exercício 1: Filtre os números pares

Dada a lista `numeros = [4, 7, 10, 13, 18, 21, 24]`, crie uma nova lista `pares` contendo apenas os
números pares, usando um loop `for`.

### Solução

```python
numeros = [4, 7, 10, 13, 18, 21, 24]
pares = []

for n in numeros:
    if n % 2 == 0:
        pares.append(n)

print(pares)  # [4, 10, 18, 24]
```

O operador `%` (módulo) retorna o resto da divisão. Um número é par quando o resto da divisão por
2 é 0 (`n % 2 == 0`). O capítulo de list comprehensions vai mostrar uma forma mais concisa de
escrever esse mesmo filtro em uma linha.

## Exercício 2: Encontre o maior e o menor valor sem usar max()/min()

Dada `notas = [8.5, 6.0, 9.2, 7.8, 5.5]`, encontre a maior e a menor nota percorrendo a lista
manualmente (sem usar `max()` ou `min()`).

### Solução

```python
notas = [8.5, 6.0, 9.2, 7.8, 5.5]

maior = notas[0]
menor = notas[0]

for nota in notas:
    if nota > maior:
        maior = nota
    if nota < menor:
        menor = nota

print(maior, menor)  # 9.2 5.5
```

A técnica clássica é começar assumindo que o primeiro elemento é tanto o maior quanto o menor, e
ir atualizando essas variáveis conforme encontra valores que "batem" o recorde atual.

## Quiz

### 1. Qual é a diferença entre `lista.append(x)` e `lista.insert(0, x)`?

- [ ] Não há diferença, ambos fazem a mesma coisa
- [x] `append` adiciona no final; `insert(0, x)` adiciona no início
- [ ] `append` só funciona com números
- [ ] `insert` sempre substitui o primeiro elemento

> `append(x)` sempre adiciona `x` ao final da lista. `insert(indice, x)` insere `x` na posição
> especificada, empurrando os elementos seguintes uma posição à frente.

### 2. O que `copia = frutas` faz, diferente de `copia = frutas.copy()`?

- [ ] `copia = frutas` cria uma cópia independente
- [x] `copia = frutas` faz `copia` apontar para a MESMA lista — alterar uma altera a outra
- [ ] `copia = frutas` sempre lança um erro
- [ ] Não há diferença nenhuma

> Listas são mutáveis e passadas por referência. `copia = frutas` só cria um segundo nome para o
> mesmo objeto na memória; `.copy()` (ou `frutas[:]`) cria uma lista nova e independente.

### 3. O que `enumerate()` retorna ao percorrer uma lista com `for`?

- [ ] Apenas os valores da lista
- [ ] Apenas os índices da lista
- [x] Pares de (índice, valor) para cada item
- [ ] A lista invertida

> `enumerate(lista)` gera pares `(indice, valor)` a cada iteração, o que evita ter que controlar
> manualmente um contador para saber a posição do item atual.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Listas" na trilha de Python do CodePath. Contexto: o capítulo explica criação,
> indexação, métodos comuns (append, insert, remove, pop, sort) e como percorrer listas. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
