---
numero: 11
titulo: "Erros e exceções"
nivel: "intermediario"
objetivo: "Tratar erros com try/except e lançar exceções próprias."
duracao: 12
status: "completo"
---

## Conceito

Quando algo dá errado durante a execução, Python lança (`raise`) uma **exceção**. Se ela não for
tratada, o programa para e exibe um traceback. O bloco `try/except` permite capturar essas
exceções e decidir o que fazer, em vez de deixar o programa quebrar.

## Sintaxe

```python
try:
    resultado = 10 / 0
except ZeroDivisionError:
    print("Não é possível dividir por zero")

try:
    numero = int("abc")
except ValueError as erro:
    print(f"Erro: {erro}")
finally:
    print("Isso sempre roda, com ou sem erro")
```

## Exemplos comentados

```python
# Capturando múltiplos tipos de exceção
try:
    valor = int(input("Digite um número: "))
    resultado = 10 / valor
except ValueError:
    print("Isso não é um número válido")
except ZeroDivisionError:
    print("Não dá para dividir por zero")

# else roda só se NENHUMA exceção ocorreu no try
try:
    numero = int("42")
except ValueError:
    print("Erro na conversão")
else:
    print(f"Conversão bem-sucedida: {numero}")

# Lançando suas próprias exceções com raise
def sacar(saldo, valor):
    if valor > saldo:
        raise ValueError("Saldo insuficiente")
    return saldo - valor

# Criando um tipo de exceção customizado
class SaldoInsuficienteError(Exception):
    pass

def sacar_v2(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError(f"Tentou sacar {valor}, saldo é {saldo}")
    return saldo - valor

try:
    sacar_v2(100, 500)
except SaldoInsuficienteError as erro:
    print(erro)

# EAFP: "easier to ask forgiveness than permission" — o estilo idiomático em Python
# é tentar a operação e tratar o erro, em vez de checar tudo antes (LBYL)
dados = {"nome": "Ana"}
try:
    print(dados["idade"])
except KeyError:
    print("Chave não encontrada")
```

## Exercício 1: Trate a divisão segura

Escreva uma função `dividir_seguro(a, b)` que retorna o resultado de `a / b`, ou a string
`"Erro: divisão por zero"` se `b` for zero, sem deixar o programa quebrar.

### Solução

```python
def dividir_seguro(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Erro: divisão por zero"

print(dividir_seguro(10, 2))  # 5.0
print(dividir_seguro(10, 0))  # "Erro: divisão por zero"
```

Capturar especificamente `ZeroDivisionError` (em vez de um `except` genérico) deixa claro qual
erro está sendo tratado, e evita esconder acidentalmente outros bugs não relacionados à divisão.

## Exercício 2: Valide idade com exceção customizada

Crie uma exceção `IdadeInvalidaError` e uma função `validar_idade(idade)` que a lança com uma
mensagem apropriada se `idade` for negativa ou maior que 120. Caso contrário, a função não faz
nada.

### Solução

```python
class IdadeInvalidaError(Exception):
    pass

def validar_idade(idade):
    if idade < 0 or idade > 120:
        raise IdadeInvalidaError(f"Idade inválida: {idade}")

try:
    validar_idade(-5)
except IdadeInvalidaError as erro:
    print(erro)  # "Idade inválida: -5"
```

Criar exceções customizadas herdando de `Exception` deixa o código de tratamento de erros mais
expressivo: quem lê `except IdadeInvalidaError` entende exatamente qual regra de negócio falhou,
em vez de um genérico `except ValueError` que poderia significar várias coisas diferentes.

## Quiz

### 1. Quando o bloco `finally` é executado?

- [ ] Só quando ocorre uma exceção
- [ ] Só quando NÃO ocorre nenhuma exceção
- [x] Sempre, com ou sem exceção
- [ ] Nunca é executado automaticamente

> `finally` roda incondicionalmente, seja o `try` bem-sucedido ou não — é o lugar ideal para
> "limpeza" garantida, como fechar uma conexão de rede.

### 2. Qual é a forma correta de lançar uma exceção manualmente em Python?

- [ ] `throw ValueError("mensagem")`
- [x] `raise ValueError("mensagem")`
- [ ] `except ValueError("mensagem")`
- [ ] `error ValueError("mensagem")`

> Python usa a palavra-chave `raise` para lançar exceções manualmente (diferente de `throw`, usado
> em Java/JavaScript/C#).

### 3. Como se cria um tipo de exceção customizado em Python?

- [ ] Não é possível, só as exceções embutidas podem ser usadas
- [x] Criando uma classe que herda de `Exception` (ou de uma subclasse dela)
- [ ] Usando a palavra-chave `custom`
- [ ] Definindo uma função chamada `exception()`

> Qualquer classe que herde de `Exception` (direta ou indiretamente) pode ser lançada com `raise`.
> Isso permite criar hierarquias de erro específicas do seu domínio, como `SaldoInsuficienteError`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Erros e exceções" na trilha de Python do CodePath. Contexto: o capítulo explica
> try/except/else/finally, raise e exceções customizadas. Minha dúvida/meu exercício: [descreva
> aqui exatamente onde travou].
