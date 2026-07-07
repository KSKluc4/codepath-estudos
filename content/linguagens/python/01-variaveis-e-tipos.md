---
numero: 1
titulo: "Variáveis e tipos"
nivel: "basico"
objetivo: "Declarar variáveis em Python e conhecer os tipos primitivos (int, float, str, bool)."
duracao: 12
status: "completo"
---

## Conceito

Em Python, uma variável é só um nome apontando para um valor guardado na memória. Diferente de
linguagens como C, você não declara o tipo da variável — o Python descobre o tipo sozinho, a
partir do valor atribuído. Isso é chamado de **tipagem dinâmica**.

Python é dinamicamente tipado, mas continua **fortemente tipado**: ele não converte tipos
incompatíveis por acaso (`"3" + 3` dá erro, não vira `"33"` nem `6`).

## Sintaxe

```python
nome = "Ana"            # str
idade = 28               # int
altura = 1.68             # float
esta_estudando = True      # bool

# type() mostra o tipo em tempo de execução
print(type(nome))          # <class 'str'>
print(type(idade))         # <class 'int'>

# Reatribuir muda o tipo da variável livremente
x = 10
x = "agora sou texto"
```

## Exemplos comentados

```python
# int: números inteiros, sem limite de tamanho prático
populacao = 8_000_000_000  # underscore só ajuda a leitura, não afeta o valor

# float: números com ponto decimal
pi = 3.14159

# str: texto, entre aspas simples ou duplas
saudacao = 'Olá, mundo'

# bool: True ou False (com maiúscula!)
ativo = False

# Conversões explícitas entre tipos
texto_numero = "42"
numero = int(texto_numero)      # 42 (int)
de_volta = str(numero)          # "42" (str)
como_float = float(numero)      # 42.0

# int() e float() lançam erro se o texto não for um número válido
# int("abc")  -> ValueError: invalid literal for int() with base 10: 'abc'
```

## Exercício 1: Identifique os tipos

Sem rodar o código, diga qual é o tipo de cada uma dessas variáveis:

```python
a = 10
b = 10.0
c = "10"
d = True
e = 10 / 2
```

### Solução

```python
a = 10       # int
b = 10.0     # float
c = "10"     # str (está entre aspas)
d = True     # bool
e = 10 / 2   # float — em Python 3, a divisão / SEMPRE retorna float, mesmo com resultado exato
```

A pegadinha mais comum é `e`: `10 / 2` é `5.0` (float), não `5` (int). Para divisão inteira, use o
operador `//`: `10 // 2` retorna `5` (int).

## Exercício 2: Conserte a conversão

O código abaixo quebra com um erro. Identifique o problema e conserte.

```python
idade = input("Digite sua idade: ")  # input() sempre retorna str
proximo_ano = idade + 1
print(proximo_ano)
```

### Solução

```python
idade = input("Digite sua idade: ")
proximo_ano = int(idade) + 1  # converte a string para int antes de somar
print(proximo_ano)
```

`input()` sempre devolve uma `str`, mesmo que o usuário digite números. Somar `str` com `int`
diretamente lança `TypeError: can only concatenate str (not "int") to str` — é preciso converter
explicitamente com `int()` (ou `float()`, dependendo do caso).

## Quiz

### 1. Qual é o tipo do resultado de `7 / 2` em Python 3?

- [ ] int
- [x] float
- [ ] str
- [ ] bool

> O operador `/` sempre retorna `float` em Python 3, independentemente de os operandos serem
> inteiros. Para divisão inteira (descartando o resto), use `//`.

### 2. O que acontece ao rodar `"5" + 5` em Python?

- [ ] Retorna `"55"`
- [ ] Retorna `10`
- [x] Lança um `TypeError`
- [ ] Retorna `5`

> Python não converte tipos automaticamente em operações como essa. Somar `str` com `int` lança
> `TypeError: can only concatenate str (not "int") to str`. É preciso converter um dos lados
> explicitamente com `int()` ou `str()`.

### 3. Como se descobre o tipo de uma variável em tempo de execução?

- [ ] `typeof(variavel)`
- [x] `type(variavel)`
- [ ] `variavel.type()`
- [ ] `kind(variavel)`

> A função embutida `type()` retorna o tipo de qualquer objeto Python, por exemplo
> `type(10)` retorna `<class 'int'>`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Variáveis e tipos" na trilha de Python do CodePath. Contexto: o capítulo explica
> tipagem dinâmica, os tipos primitivos (int, float, str, bool) e conversões entre eles. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
