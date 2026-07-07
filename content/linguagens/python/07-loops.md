---
numero: 7
titulo: "Loops"
nivel: "basico"
objetivo: "Repetir tarefas com for e while, e controlar loops com break e continue."
duracao: 12
status: "completo"
---

## Conceito

Loops repetem um bloco de código várias vezes. Python tem dois tipos: `for`, que percorre os
itens de uma sequência (lista, string, range, etc.), e `while`, que repete enquanto uma condição
for verdadeira. Na prática, `for` é usado bem mais em Python do que em outras linguagens, porque
ele itera diretamente sobre coleções, sem precisar de um contador manual.

## Sintaxe

```python
for item in [1, 2, 3]:
    print(item)

for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 10, 2):  # 2, 4, 6, 8 (início, fim exclusivo, passo)
    print(i)

contador = 0
while contador < 3:
    print(contador)
    contador += 1
```

## Exemplos comentados

```python
# break interrompe o loop imediatamente
for numero in range(100):
    if numero == 5:
        break
    print(numero)  # imprime 0, 1, 2, 3, 4 e para

# continue pula para a próxima iteração
for numero in range(6):
    if numero % 2 == 0:
        continue  # pula números pares
    print(numero)  # imprime 1, 3, 5

# else em loops: roda se o loop terminar SEM break (recurso pouco comum, mas útil)
for n in range(2, 10):
    if n % 7 == 0:
        print("Múltiplo de 7 encontrado")
        break
else:
    print("Nenhum múltiplo de 7 encontrado")

# while True + break é o padrão para "repita até uma condição interna"
tentativas = 0
while True:
    tentativas += 1
    if tentativas >= 3:
        break

# Percorrer duas listas ao mesmo tempo com zip()
nomes = ["Ana", "Bia"]
idades = [28, 25]
for nome, idade in zip(nomes, idades):
    print(nome, idade)
```

## Exercício 1: Some os números de 1 a 100

Escreva um loop que calcule a soma de todos os números inteiros de 1 a 100 (inclusive).

### Solução

```python
soma = 0
for n in range(1, 101):  # range(1, 101) vai de 1 até 100
    soma += n

print(soma)  # 5050
```

`range(1, 101)` gera os números de 1 até 100 — lembre que o segundo argumento de `range` é sempre
exclusivo, então é preciso usar 101 para incluir o 100. `soma += n` é o mesmo que
`soma = soma + n`.

## Exercício 2: Encontre o primeiro número divisível por 7 e 5

Usando um `while`, encontre o primeiro número maior que 1 que seja divisível ao mesmo tempo por 7
e por 5.

### Solução

```python
numero = 1
while True:
    numero += 1
    if numero % 7 == 0 and numero % 5 == 0:
        break

print(numero)  # 35
```

O padrão `while True` com `break` interno é útil quando a condição de parada depende de algo
calculado dentro do próprio loop, o que tornaria a condição do `while` complicada de escrever
diretamente.

## Quiz

### 1. O que `range(2, 10, 2)` gera?

- [ ] 2, 4, 6, 8, 10
- [x] 2, 4, 6, 8
- [ ] 0, 2, 4, 6, 8
- [ ] 2, 3, 4, ..., 10

> `range(inicio, fim, passo)` gera números começando em `inicio`, pulando de `passo` em `passo`,
> sempre parando ANTES de `fim`. Por isso `range(2, 10, 2)` para em 8, não inclui o 10.

### 2. Qual a diferença entre `break` e `continue`?

- [ ] São sinônimos, fazem a mesma coisa
- [x] `break` encerra o loop inteiro; `continue` pula só para a próxima iteração
- [ ] `continue` encerra o loop; `break` pula a iteração
- [ ] Ambos encerram o programa inteiro

> `break` sai do loop imediatamente, não executando mais nenhuma iteração. `continue` interrompe
> apenas a iteração atual e volta ao topo do loop para avaliar a próxima.

### 3. Para que serve `zip()` em um loop `for`?

- [ ] Compactar arquivos
- [x] Percorrer duas (ou mais) sequências em paralelo, item a item
- [ ] Ordenar uma lista
- [ ] Remover duplicatas de uma lista

> `zip(lista1, lista2)` combina duas sequências em pares, permitindo iterar sobre ambas ao mesmo
> tempo com `for a, b in zip(lista1, lista2)`, sem precisar controlar índices manualmente.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Loops" na trilha de Python do CodePath. Contexto: o capítulo explica for, while,
> range(), break, continue e zip(). Minha dúvida/meu exercício: [descreva aqui exatamente onde
> travou].
