---
numero: 18
titulo: "Testes com pytest"
nivel: "avancado"
objetivo: "Escrever testes automatizados para código Python usando pytest."
duracao: 15
status: "completo"
---

## Conceito

`pytest` é a biblioteca mais usada para escrever testes automatizados em Python. Um teste é uma
função que verifica se o código se comporta como esperado, usando `assert`. Rodar a suíte de
testes depois de qualquer mudança dá confiança de que você não quebrou nada que já funcionava.

## Sintaxe

```python
# arquivo: calculadora.py
def somar(a, b):
    return a + b

# arquivo: test_calculadora.py
from calculadora import somar

def test_somar_numeros_positivos():
    assert somar(2, 3) == 5

def test_somar_com_negativo():
    assert somar(-1, 1) == 0
```

```bash
pytest                      # roda todos os testes encontrados
pytest test_calculadora.py   # roda só um arquivo específico
pytest -v                    # modo detalhado (mostra cada teste individualmente)
```

`pytest` descobre testes automaticamente em arquivos que começam com `test_` (ou terminam em
`_test.py`), em funções que começam com `test_`.

## Exemplos comentados

```python
import pytest

def dividir(a, b):
    if b == 0:
        raise ValueError("Divisão por zero")
    return a / b

# Testando que uma exceção é lançada corretamente
def test_dividir_por_zero_lanca_erro():
    with pytest.raises(ValueError):
        dividir(10, 0)

# Fixture: código de preparação reutilizável entre vários testes
@pytest.fixture
def lista_exemplo():
    return [3, 1, 4, 1, 5, 9]

def test_tamanho_da_lista(lista_exemplo):
    assert len(lista_exemplo) == 6

def test_soma_da_lista(lista_exemplo):
    assert sum(lista_exemplo) == 23

# Parametrize: roda o mesmo teste várias vezes com entradas diferentes
@pytest.mark.parametrize("a, b, esperado", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
])
def test_somar_varios_casos(a, b, esperado):
    assert somar(a, b) == esperado

def somar(a, b):
    return a + b
```

## Exercício 1: Teste uma função de validação

Dada a função abaixo, escreva dois testes com `pytest`: um verificando um e-mail válido, outro
verificando um e-mail sem "@" (inválido).

```python
def eh_email_valido(email):
    return "@" in email and "." in email
```

### Solução

```python
def eh_email_valido(email):
    return "@" in email and "." in email

def test_email_valido():
    assert eh_email_valido("ana@exemplo.com") == True

def test_email_sem_arroba_e_invalido():
    assert eh_email_valido("anaexemplo.com") == False
```

Cada teste verifica um único comportamento, com um nome descritivo que explica o que está sendo
validado. Isso facilita identificar exatamente o que quebrou quando um teste falha, sem precisar
ler o corpo inteiro do teste.

## Exercício 2: Use parametrize para cobrir vários casos

Reescreva os dois testes do exercício anterior como um único teste parametrizado, cobrindo pelo
menos três casos de e-mail (válidos e inválidos).

### Solução

```python
import pytest

def eh_email_valido(email):
    return "@" in email and "." in email

@pytest.mark.parametrize("email, esperado", [
    ("ana@exemplo.com", True),
    ("anaexemplo.com", False),
    ("ana@exemplocom", False),
])
def test_eh_email_valido(email, esperado):
    assert eh_email_valido(email) == esperado
```

`@pytest.mark.parametrize` roda a mesma função de teste uma vez para cada tupla da lista, evitando
duplicar a estrutura do teste para cada caso — e ainda assim, se um caso específico falhar, o
pytest mostra exatamente qual combinação de `email`/`esperado` deu errado.

## Quiz

### 1. Como o pytest descobre automaticamente quais funções são testes?

- [ ] Todo arquivo `.py` é considerado um teste
- [x] Arquivos que começam com `test_` e funções que começam com `test_`
- [ ] É preciso listar manualmente cada teste em um arquivo de configuração
- [ ] Apenas funções decoradas com `@test`

> Por convenção, o pytest procura por arquivos `test_*.py` (ou `*_test.py`) e, dentro deles,
> funções cujo nome começa com `test_`. Não é preciso nenhum registro manual.

### 2. Para que serve uma fixture no pytest?

- [ ] Para corrigir bugs automaticamente
- [x] Para fornecer dados ou objetos de preparação reutilizáveis entre vários testes
- [ ] Para desativar testes temporariamente
- [ ] É obrigatória em todo teste, mesmo os mais simples

> Uma fixture (`@pytest.fixture`) encapsula lógica de preparação (como criar dados de exemplo ou
> configurar uma conexão) que pode ser injetada como parâmetro em quantos testes precisarem dela,
> evitando repetição.

### 3. Como se testa que uma função lança uma exceção esperada?

- [ ] `assert funcao() == Exception`
- [x] Usando `with pytest.raises(TipoDaExcecao): funcao()`
- [ ] Chamando a função duas vezes
- [ ] Não é possível testar exceções com pytest

> `pytest.raises(TipoDaExcecao)` é um gerenciador de contexto que verifica se o código dentro do
> bloco `with` lança de fato aquele tipo de exceção. Se a exceção não for lançada, o teste falha.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Testes com pytest" na trilha de Python do CodePath. Contexto: o capítulo explica
> assert, pytest.raises, fixtures e pytest.mark.parametrize. Minha dúvida/meu exercício: [descreva
> aqui exatamente onde travou].
