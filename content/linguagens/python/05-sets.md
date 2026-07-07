---
numero: 5
titulo: "Sets"
nivel: "basico"
objetivo: "Usar conjuntos para armazenar valores únicos e operações de conjunto."
duracao: 10
status: "completo"
---

## Conceito

Um `set` (conjunto) é uma coleção **não ordenada** de itens **únicos** — duplicatas são
automaticamente descartadas. Sets são ideais para duas coisas: remover duplicatas de uma coleção e
fazer operações matemáticas de conjunto (união, interseção, diferença) de forma muito eficiente.

## Sintaxe

```python
numeros = {1, 2, 3, 2, 1}   # vira {1, 2, 3} — duplicatas somem
vazio = set()                 # atenção: {} cria um dict vazio, não um set vazio!

numeros.add(4)                # adiciona um item
numeros.remove(1)             # remove um item (lança erro se não existir)
numeros.discard(99)           # remove se existir, sem erro se não existir

3 in numeros                  # True — checagem de pertencimento é muito rápida em sets
len(numeros)                  # tamanho do conjunto
```

## Exemplos comentados

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

a | b   # união: {1, 2, 3, 4, 5, 6}
a & b   # interseção: {3, 4}
a - b   # diferença: {1, 2} — o que está em 'a' mas não em 'b'
a ^ b   # diferença simétrica: {1, 2, 5, 6} — o que não está em ambos

# Removendo duplicatas de uma lista rapidamente
nomes = ["Ana", "Bia", "Ana", "Carlos", "Bia"]
unicos = list(set(nomes))  # ordem não é garantida!

# Set comprehension (mesma ideia da list comprehension)
quadrados = {x * x for x in range(5)}  # {0, 1, 4, 9, 16}
```

## Exercício 1: Encontre os elementos em comum

Dadas as listas `turma_a = ["Ana", "Bia", "Carlos", "Duda"]` e
`turma_b = ["Bia", "Duda", "Eva", "Felipe"]`, encontre quais alunos estão em ambas as turmas.

### Solução

```python
turma_a = ["Ana", "Bia", "Carlos", "Duda"]
turma_b = ["Bia", "Duda", "Eva", "Felipe"]

em_comum = set(turma_a) & set(turma_b)
print(em_comum)  # {'Bia', 'Duda'}
```

Convertendo as duas listas em sets, o operador `&` (interseção) encontra diretamente os elementos
presentes em ambas — muito mais direto do que escrever um loop com `if aluno in turma_b`.

## Exercício 2: Verifique duplicatas

Escreva uma função `tem_duplicata(lista)` que retorna `True` se a lista contém algum valor
repetido, e `False` caso contrário.

### Solução

```python
def tem_duplicata(lista):
    return len(lista) != len(set(lista))

print(tem_duplicata([1, 2, 3, 2]))  # True
print(tem_duplicata([1, 2, 3]))     # False
```

Como um `set` nunca guarda duplicatas, se o tamanho do set for menor que o tamanho da lista
original, é porque algum elemento se repetia. É um truque comum e muito mais rápido do que
comparar cada par de elementos manualmente.

## Quiz

### 1. O que acontece ao criar `{1, 2, 2, 3}`?

- [ ] Lança um erro
- [x] Vira o conjunto `{1, 2, 3}` — a duplicata é descartada
- [ ] Vira uma lista `[1, 2, 2, 3]`
- [ ] Vira `{1, 2, 3, 3}`

> Sets armazenam apenas valores únicos. Ao inserir um valor que já existe, ele simplesmente é
> ignorado — não gera erro nem duplicata.

### 2. Como se cria um set vazio corretamente?

- [ ] `{}`
- [x] `set()`
- [ ] `[]`
- [ ] `set{}`

> `{}` cria um **dicionário** vazio, não um set — essa é uma pegadinha clássica de Python. Para
> criar um set vazio, é preciso usar explicitamente `set()`.

### 3. O que o operador `&` faz entre dois sets?

- [ ] União (todos os elementos de ambos)
- [x] Interseção (só os elementos presentes em ambos)
- [ ] Diferença (elementos só do primeiro)
- [ ] Sempre retorna um set vazio

> `&` calcula a interseção: o conjunto de elementos que aparecem em ambos os sets. Para união use
> `|`, e para diferença use `-`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Sets" na trilha de Python do CodePath. Contexto: o capítulo explica conjuntos,
> valores únicos e operações como união, interseção e diferença. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
