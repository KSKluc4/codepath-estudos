---
numero: 15
titulo: "Decorators"
nivel: "avancado"
objetivo: "Entender e criar decorators para modificar o comportamento de funções."
duracao: 15
status: "completo"
---

## Conceito

Um decorator é uma função que recebe outra função como argumento e retorna uma nova função,
geralmente adicionando algum comportamento antes/depois da original — sem precisar alterar o
código dela. É possível porque, em Python, funções são "cidadãos de primeira classe": podem ser
passadas como argumento e retornadas por outras funções, como qualquer outro valor.

## Sintaxe

```python
def meu_decorator(funcao):
    def wrapper(*args, **kwargs):
        print("Antes de chamar a função")
        resultado = funcao(*args, **kwargs)
        print("Depois de chamar a função")
        return resultado
    return wrapper

@meu_decorator
def saudacao(nome):
    print(f"Olá, {nome}!")

saudacao("Ana")
# Antes de chamar a função
# Olá, Ana!
# Depois de chamar a função
```

`@meu_decorator` acima de `def saudacao` é só um "açúcar sintático" — equivale a escrever
`saudacao = meu_decorator(saudacao)` logo depois de definir a função.

## Exemplos comentados

```python
import time
import functools

def cronometrar(funcao):
    @functools.wraps(funcao)  # preserva o nome/docstring original da função decorada
    def wrapper(*args, **kwargs):
        inicio = time.time()
        resultado = funcao(*args, **kwargs)
        duracao = time.time() - inicio
        print(f"{funcao.__name__} levou {duracao:.4f}s")
        return resultado
    return wrapper

@cronometrar
def somar_lista(numeros):
    return sum(numeros)

somar_lista(range(1_000_000))  # imprime: somar_lista levou 0.0123s (exemplo)

# Decorator com argumentos próprios: precisa de uma camada extra de função
def repetir(vezes):
    def decorator(funcao):
        @functools.wraps(funcao)
        def wrapper(*args, **kwargs):
            for _ in range(vezes):
                funcao(*args, **kwargs)
        return wrapper
    return decorator

@repetir(3)
def dizer_oi():
    print("Oi!")

dizer_oi()  # imprime "Oi!" três vezes

# Decorators embutidos muito usados em classes: @staticmethod, @classmethod, @property
class Circulo:
    def __init__(self, raio):
        self._raio = raio

    @property
    def area(self):  # acessado como atributo, sem parênteses: circulo.area
        import math
        return math.pi * self._raio ** 2
```

## Exercício 1: Decorator de log

Escreva um decorator `logar_chamada` que imprime o nome da função e os argumentos recebidos toda
vez que ela é chamada, antes de executá-la.

### Solução

```python
import functools

def logar_chamada(funcao):
    @functools.wraps(funcao)
    def wrapper(*args, **kwargs):
        print(f"Chamando {funcao.__name__} com args={args}, kwargs={kwargs}")
        return funcao(*args, **kwargs)
    return wrapper

@logar_chamada
def somar(a, b):
    return a + b

somar(2, 3)
# Chamando somar com args=(2, 3), kwargs={}
```

O `wrapper` captura qualquer combinação de argumentos com `*args, **kwargs`, o que torna o
decorator reutilizável para funções com assinaturas diferentes, sem precisar reescrevê-lo para cada
caso.

## Exercício 2: Decorator que valida números positivos

Escreva um decorator `apenas_positivos` que lança `ValueError` se qualquer argumento posicional da
função decorada for um número negativo, antes de executar a função.

### Solução

```python
import functools

def apenas_positivos(funcao):
    @functools.wraps(funcao)
    def wrapper(*args, **kwargs):
        for arg in args:
            if isinstance(arg, (int, float)) and arg < 0:
                raise ValueError(f"Argumento negativo não permitido: {arg}")
        return funcao(*args, **kwargs)
    return wrapper

@apenas_positivos
def calcular_raiz_quadrada(numero):
    return numero ** 0.5

print(calcular_raiz_quadrada(16))   # 4.0
# calcular_raiz_quadrada(-4)  -> ValueError: Argumento negativo não permitido: -4
```

A validação acontece dentro do `wrapper`, antes de chamar `funcao(*args, **kwargs)` — se a
validação falhar, a função original nunca chega a ser executada.

## Quiz

### 1. O que `@meu_decorator` acima de uma função equivale a fazer?

- [ ] Nada, é apenas um comentário especial
- [x] `funcao = meu_decorator(funcao)`
- [ ] Cria uma cópia da função com outro nome
- [ ] Só funciona dentro de classes

> A sintaxe `@decorator` é açúcar sintático para reatribuir a função ao resultado de passá-la pelo
> decorator: `funcao = decorator(funcao)`.

### 2. Para que serve `*args, **kwargs` na assinatura do `wrapper` de um decorator?

- [ ] São obrigatórios em toda função Python
- [x] Permitem que o decorator funcione com funções de qualquer assinatura (qualquer quantidade e tipo de argumentos)
- [ ] Servem apenas para funções sem argumentos
- [ ] Aceleram a execução da função

> Sem `*args, **kwargs`, o `wrapper` só funcionaria com funções que tivessem exatamente a mesma
> assinatura fixa que ele. Usando-os, o decorator se torna genérico e reutilizável para qualquer
> função decorada.

### 3. Para que serve `@functools.wraps(funcao)` dentro de um decorator?

- [ ] É obrigatório, sem ele o decorator não funciona
- [x] Preserva metadados da função original (como `__name__`) na função decorada
- [ ] Faz a função rodar mais rápido
- [ ] Impede que a função seja chamada mais de uma vez

> Sem `@functools.wraps`, o `wrapper` "esconde" a função original: `funcao_decorada.__name__`
> passaria a ser `"wrapper"` em vez do nome real. `functools.wraps` copia esses metadados para
> manter a introspecção e as mensagens de erro/debug corretas.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Decorators" na trilha de Python do CodePath. Contexto: o capítulo explica como
> funções decoram outras funções, a sintaxe `@decorator`, `*args/**kwargs` e `functools.wraps`.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
