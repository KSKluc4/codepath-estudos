---
numero: 8
titulo: "Funções"
nivel: "basico"
objetivo: "Definir funções reutilizáveis com parâmetros, valores padrão e retorno."
duracao: 12
status: "completo"
---

## Conceito

Uma função agrupa um bloco de código sob um nome, para poder ser reutilizado sem repetir a lógica.
Em Python, funções são declaradas com `def`, podem receber parâmetros (com ou sem valor padrão) e
devolver um resultado com `return`. Uma função sem `return` explícito devolve `None`.

## Sintaxe

```python
def saudacao(nome):
    return f"Olá, {nome}!"

resultado = saudacao("Ana")  # "Olá, Ana!"

def somar(a, b=0):       # b tem valor padrão 0
    return a + b

somar(2, 3)   # 5
somar(2)      # 2 (usa o padrão de b)

def multiplos_valores():
    return 1, 2, 3  # retorna uma tupla (1, 2, 3)

x, y, z = multiplos_valores()  # desempacotamento
```

## Exemplos comentados

```python
# *args: número variável de argumentos posicionais (vira uma tupla dentro da função)
def somar_tudo(*numeros):
    return sum(numeros)

somar_tudo(1, 2, 3, 4)  # 10

# **kwargs: número variável de argumentos nomeados (vira um dict dentro da função)
def criar_perfil(**dados):
    return dados

criar_perfil(nome="Ana", idade=28)  # {'nome': 'Ana', 'idade': 28}

# Argumentos nomeados (keyword arguments) deixam a chamada mais legível
def dividir(dividendo, divisor):
    return dividendo / divisor

dividir(divisor=2, dividendo=10)  # 5.0 — ordem não importa quando nomeado

# CUIDADO: nunca use uma lista/dict mutável como valor padrão!
def adicionar_item(item, lista=None):
    if lista is None:
        lista = []  # cria uma lista NOVA a cada chamada
    lista.append(item)
    return lista

# Funções são "cidadãos de primeira classe": podem ser passadas como argumento
def aplicar(funcao, valor):
    return funcao(valor)

aplicar(len, "python")  # 6
```

## Exercício 1: Função com valor padrão

Escreva uma função `calcular_desconto(preco, percentual=10)` que retorna o preço já com o desconto
aplicado. Se nenhum percentual for informado, use 10% por padrão.

### Solução

```python
def calcular_desconto(preco, percentual=10):
    return preco - (preco * percentual / 100)

print(calcular_desconto(100))       # 90.0 (desconto padrão de 10%)
print(calcular_desconto(100, 20))   # 80.0 (desconto de 20%)
```

Como `percentual` tem um valor padrão (`10`), a função pode ser chamada com um ou dois argumentos.
Quando chamada só com `preco`, o Python usa automaticamente `percentual=10`.

## Exercício 2: Função que retorna múltiplos valores

Escreva uma função `estatisticas(numeros)` que recebe uma lista de números e retorna, de uma vez,
o menor valor, o maior valor e a média.

### Solução

```python
def estatisticas(numeros):
    menor = min(numeros)
    maior = max(numeros)
    media = sum(numeros) / len(numeros)
    return menor, maior, media

minimo, maximo, media = estatisticas([4, 8, 15, 16, 23, 42])
print(minimo, maximo, media)  # 4 42 18.0
```

Em Python, `return a, b, c` empacota os três valores em uma tupla `(a, b, c)`. Ao chamar a função
com `x, y, z = estatisticas(...)`, o Python desempacota a tupla automaticamente nas três variáveis.

## Quiz

### 1. O que uma função Python retorna se não tiver nenhum `return`?

- [ ] Uma string vazia `""`
- [ ] `0`
- [x] `None`
- [ ] Um erro é lançado

> Toda função em Python retorna algo, mesmo sem `return` explícito — nesse caso, o valor devolvido
> é sempre `None`.

### 2. O que `*args` captura dentro de uma função?

- [ ] Apenas o primeiro argumento extra
- [x] Todos os argumentos posicionais extras, como uma tupla
- [ ] Todos os argumentos nomeados, como um dicionário
- [ ] Nada, é apenas um comentário

> `*args` (o nome pode ser qualquer um, `*args` é só a convenção) captura qualquer quantidade de
> argumentos posicionais passados à função e os agrupa em uma tupla dentro do corpo da função.

### 3. Por que usar uma lista mutável como valor padrão de parâmetro é perigoso?

- [ ] Não é perigoso, é uma prática recomendada
- [ ] Porque Python não permite isso (dá erro de sintaxe)
- [x] Porque o valor padrão é criado uma única vez e compartilhado entre todas as chamadas
- [ ] Porque deixa a função mais lenta

> O valor padrão de um parâmetro é avaliado apenas uma vez, quando a função é definida — não a
> cada chamada. Se for uma lista mutável, todas as chamadas que não passarem esse argumento vão
> compartilhar e acumular alterações na MESMA lista, causando bugs sutis. O padrão seguro é usar
> `None` e criar a lista dentro do corpo da função, como no exemplo `adicionar_item` acima.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Funções" na trilha de Python do CodePath. Contexto: o capítulo explica def,
> parâmetros com valor padrão, *args, **kwargs e retorno de múltiplos valores. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
