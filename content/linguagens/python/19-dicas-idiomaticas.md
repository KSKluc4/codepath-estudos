---
numero: 19
titulo: "Dicas idiomáticas"
nivel: "avancado"
objetivo: "Escrever Python mais 'pythônico': idiomas e boas práticas da comunidade."
duracao: 12
status: "completo"
---

## Conceito

"Pythônico" é o termo usado para código que segue as convenções e o estilo idiomático da
comunidade Python, aproveitando os recursos da linguagem em vez de "traduzir" hábitos de outras
linguagens diretamente. O Zen do Python (`import this`) resume boa parte dessa filosofia:
simplicidade explícita é melhor do que implícita, legibilidade conta.

## Sintaxe

```python
import this  # imprime o "Zen do Python" no terminal

# PEP 8 é o guia de estilo oficial: nomes de variáveis/funções em snake_case,
# classes em PascalCase, 4 espaços de indentação, linhas com até ~79-99 caracteres
def calcular_media(numeros):  # snake_case
    ...

class ContaBancaria:  # PascalCase
    ...
```

## Exemplos comentados

```python
numeros = [1, 2, 3, 4, 5]

# Nada pythônico: usar range(len(...)) para percorrer índices desnecessariamente
for i in range(len(numeros)):
    print(numeros[i])

# Pythônico: iterar diretamente sobre os itens
for numero in numeros:
    print(numero)

# Nada pythônico: checar existência de chave e depois acessar
if "nome" in dicionario:
    valor = dicionario["nome"]
else:
    valor = "desconhecido"

# Pythônico: usar .get() com valor padrão
valor = dicionario.get("nome", "desconhecido")

# Nada pythônico: comparar explicitamente com True/False
if esta_ativo == True:
    ...

# Pythônico: usar o valor booleano diretamente
if esta_ativo:
    ...

# Nada pythônico: construir string com +
mensagem = "Olá, " + nome + "! Você tem " + str(idade) + " anos."

# Pythônico: f-string
mensagem = f"Olá, {nome}! Você tem {idade} anos."

# Desempacotamento em vez de acessar por índice
ponto = (10, 20)
x, y = ponto  # em vez de x = ponto[0]; y = ponto[1]

# Troca de valores sem variável temporária
a, b = 1, 2
a, b = b, a  # a=2, b=1

# EAFP ("easier to ask forgiveness than permission") é o estilo preferido
# em vez de checar tudo antes (LBYL, "look before you leap")
try:
    valor = dicionario["chave"]
except KeyError:
    valor = None

# Usar 'with' para qualquer recurso que precise ser liberado (arquivos, conexões, locks)
with open("arquivo.txt") as f:
    conteudo = f.read()
```

## Exercício 1: Torne o código mais pythônico

Reescreva o trecho abaixo de forma mais idiomática:

```python
resultado = []
for i in range(len(precos)):
    if precos[i] > 100:
        resultado.append(precos[i])
```

### Solução

```python
resultado = [preco for preco in precos if preco > 100]
```

A versão pythônica combina dois idiomas do capítulo: iterar diretamente sobre os itens (em vez de
`range(len(...))`) e usar uma list comprehension em vez de um loop com `append()` manual — o
resultado é uma única linha, mais legível e mais direta.

## Exercício 2: Substitua a checagem manual por EAFP

Reescreva o trecho abaixo seguindo o estilo EAFP (tentar e tratar o erro, em vez de checar antes):

```python
if chave in configuracoes:
    valor = configuracoes[chave]
else:
    valor = valor_padrao
```

### Solução

```python
# Opção 1: EAFP com try/except
try:
    valor = configuracoes[chave]
except KeyError:
    valor = valor_padrao

# Opção 2 (ainda mais direta, específica para dicionários): .get()
valor = configuracoes.get(chave, valor_padrao)
```

Para dicionários especificamente, `.get(chave, padrao)` já resolve o caso mais comum em uma linha
só. O padrão `try/except` (EAFP) é mais geral e vale para outras situações, como acessar um
atributo que pode não existir em um objeto.

## Quiz

### 1. O que significa "código pythônico"?

- [ ] Código que roda mais rápido que em qualquer outra linguagem
- [x] Código que segue as convenções e o estilo idiomático da comunidade Python
- [ ] Código escrito apenas com list comprehensions
- [ ] Código sem nenhum comentário

> "Pythônico" descreve código que aproveita os recursos e convenções próprios do Python (PEP 8,
> desempacotamento, comprehensions, EAFP, etc.) em vez de replicar padrões de outras linguagens
> sem adaptação.

### 2. Qual das opções abaixo é considerada mais pythônica para acessar uma chave de dicionário que pode não existir?

- [ ] `if chave in dicionario: valor = dicionario[chave]` seguido de `else`
- [x] `valor = dicionario.get(chave, padrao)`
- [ ] `valor = dicionario[chave] or padrao`
- [ ] Acessar diretamente com `dicionario[chave]` e ignorar o erro

> `.get(chave, padrao)` resolve em uma única expressão o que levaria várias linhas com `if/else`,
> e é a forma idiomática recomendada pela comunidade Python para esse caso.

### 3. O que o estilo "EAFP" propõe?

- [ ] Testar exaustivamente todas as condições antes de qualquer operação
- [x] Tentar executar a operação diretamente e tratar a exceção se ela falhar
- [ ] Evitar o uso de try/except sempre que possível
- [ ] Escrever apenas em inglês

> EAFP ("easier to ask forgiveness than permission") é o estilo idiomático em Python de tentar a
> operação diretamente dentro de um `try`, tratando o erro no `except` se ele ocorrer — em vez de
> checar antecipadamente todas as pré-condições (estilo LBYL, mais comum em outras linguagens).

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Dicas idiomáticas" na trilha de Python do CodePath. Contexto: o capítulo explica
> convenções pythônicas como PEP 8, EAFP, desempacotamento e o uso de .get() e comprehensions.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
