---
numero: 6
titulo: "Condicionais"
nivel: "basico"
objetivo: "Controlar o fluxo do programa com if, elif e else."
duracao: 10
status: "completo"
---

## Conceito

Condicionais permitem que o programa tome decisões: executar um bloco de código só quando uma
condição é verdadeira. Python usa `if`, `elif` (contração de "else if") e `else`, e — diferente de
C ou JavaScript — usa **indentação** (geralmente 4 espaços) em vez de chaves `{}` para marcar o que
pertence a cada bloco.

## Sintaxe

```python
idade = 20

if idade < 12:
    print("Criança")
elif idade < 18:
    print("Adolescente")
else:
    print("Adulto")

# Operador ternário (expressão condicional em uma linha)
status = "adulto" if idade >= 18 else "menor"
```

## Exemplos comentados

```python
nota = 7.5

# Operadores de comparação: == != > < >= <=
aprovado = nota >= 6.0

# Operadores lógicos: and, or, not (em Python, são palavras, não símbolos)
if nota >= 6.0 and nota <= 10.0:
    print("Nota válida e aprovado")

if nota < 0 or nota > 10:
    print("Nota inválida")

if not aprovado:
    print("Reprovado")

# Python permite comparações encadeadas — bem mais legível que em outras linguagens
if 0 <= nota <= 10:
    print("Nota dentro da faixa válida")

# Valores "falsy" em Python: 0, 0.0, "", [], {}, set(), None e False
# Tudo isso é considerado False em um if, sem precisar comparar explicitamente
carrinho = []
if not carrinho:
    print("Carrinho vazio")
```

## Exercício 1: Classifique o IMC

Escreva código que, dado `imc = 23.5`, imprima a classificação: `"Abaixo do peso"` se `imc < 18.5`,
`"Peso normal"` se `18.5 <= imc < 25`, `"Sobrepeso"` se `25 <= imc < 30`, ou `"Obesidade"` se
`imc >= 30`.

### Solução

```python
imc = 23.5

if imc < 18.5:
    print("Abaixo do peso")
elif imc < 25:
    print("Peso normal")
elif imc < 30:
    print("Sobrepeso")
else:
    print("Obesidade")
```

Repare que a partir do segundo `elif` não é preciso repetir o limite inferior (`18.5 <= imc`):
como o Python só chega ali se as condições anteriores foram falsas, já sabemos que `imc >= 18.5`
nesse ponto. Isso torna a cadeia de `elif` mais limpa.

## Exercício 2: Valide um login

Escreva código que verifica login: dadas `usuario = "admin"` e `senha = "1234"`, se ambos
estiverem corretos (comparando com os valores esperados `"admin"` e `"1234"`) imprima
`"Login bem-sucedido"`; senão, imprima `"Usuário ou senha inválidos"`.

### Solução

```python
usuario = "admin"
senha = "1234"

usuario_esperado = "admin"
senha_esperada = "1234"

if usuario == usuario_esperado and senha == senha_esperada:
    print("Login bem-sucedido")
else:
    print("Usuário ou senha inválidos")
```

O operador `and` exige que **ambas** as condições sejam verdadeiras. Em Python, comparação de
igualdade usa `==` (dois sinais de igual) — usar apenas `=` faria uma atribuição, não uma
comparação, e seria um erro de sintaxe dentro de um `if`.

## Quiz

### 1. Como Python delimita o que pertence a um bloco `if`?

- [ ] Chaves `{ }`
- [ ] A palavra-chave `end`
- [x] Indentação (espaços no início da linha)
- [ ] Parênteses

> Ao contrário de C, Java ou JavaScript, Python usa indentação consistente para definir blocos de
> código — não há chaves. Misturar tabs e espaços, ou indentar de forma inconsistente, causa
> `IndentationError`.

### 2. Qual valor é considerado "falsy" (equivalente a False) em um `if`?

- [ ] `"False"` (a string)
- [ ] `1`
- [x] `[]` (lista vazia)
- [ ] `" "` (string com um espaço)

> Em Python, coleções vazias (`[]`, `{}`, `()`, `set()`), o número `0`, a string vazia `""` e
> `None` são todos considerados "falsy". Uma string com um espaço (`" "`) não está vazia, então é
> "truthy".

### 3. O que `0 <= nota <= 10` faz em Python?

- [ ] Lança um erro de sintaxe
- [x] Verifica se `nota` está entre 0 e 10 (comparação encadeada)
- [ ] Sempre retorna `True`
- [ ] Compara apenas `0 <= nota`, ignorando o resto

> Python permite encadear comparações, equivalente a escrever `0 <= nota and nota <= 10`, mas de
> forma mais legível e mais próxima da notação matemática.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Condicionais" na trilha de Python do CodePath. Contexto: o capítulo explica
> if/elif/else, operadores lógicos e valores "falsy". Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].
