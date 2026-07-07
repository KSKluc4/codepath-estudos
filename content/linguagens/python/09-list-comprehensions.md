---
numero: 9
titulo: "List comprehensions"
nivel: "intermediario"
objetivo: "Criar listas de forma concisa com list comprehensions."
duracao: 12
status: "completo"
---

## Conceito

Uma list comprehension é uma forma concisa de criar uma lista a partir de outra sequência, em uma
única linha, combinando um `for` (e opcionalmente um `if`) dentro dos colchetes `[]`. É considerada
mais "pythônica" do que montar a lista com um loop tradicional e `append()`, e costuma ser mais
rápida também.

## Sintaxe

```python
# Forma tradicional
quadrados = []
for n in range(5):
    quadrados.append(n * n)

# Equivalente com list comprehension
quadrados = [n * n for n in range(5)]  # [0, 1, 4, 9, 16]

# Com filtro (if)
pares = [n for n in range(10) if n % 2 == 0]  # [0, 2, 4, 6, 8]

# Estrutura geral:
# [expressao for item in iteravel if condicao]
```

## Exemplos comentados

```python
palavras = ["python", "java", "c", "javascript"]

# Transformar cada item
maiusculas = [p.upper() for p in palavras]  # ['PYTHON', 'JAVA', 'C', 'JAVASCRIPT']

# Filtrar e transformar ao mesmo tempo
longas_maiusculas = [p.upper() for p in palavras if len(p) > 4]
# ['PYTHON', 'JAVASCRIPT']

# if/else dentro da expressão (não é o mesmo que o if de filtro!)
paridade = ["par" if n % 2 == 0 else "ímpar" for n in range(5)]
# ['par', 'ímpar', 'par', 'ímpar', 'par']

# Comprehensions aninhadas — cuidado para não abusar, ficam ilegíveis rápido
matriz = [[1, 2], [3, 4], [5, 6]]
achatada = [numero for linha in matriz for numero in linha]
# [1, 2, 3, 4, 5, 6]

# Dict e set comprehension seguem a mesma ideia
quadrados_dict = {n: n * n for n in range(4)}  # {0: 0, 1: 1, 2: 4, 3: 9}
letras_unicas = {c for c in "banana"}            # {'b', 'a', 'n'}
```

## Exercício 1: Converta um loop para list comprehension

Reescreva o código abaixo usando uma list comprehension:

```python
temperaturas_celsius = [0, 10, 20, 30, 40]
temperaturas_fahrenheit = []
for c in temperaturas_celsius:
    temperaturas_fahrenheit.append(c * 9 / 5 + 32)
```

### Solução

```python
temperaturas_celsius = [0, 10, 20, 30, 40]
temperaturas_fahrenheit = [c * 9 / 5 + 32 for c in temperaturas_celsius]

print(temperaturas_fahrenheit)  # [32.0, 50.0, 68.0, 86.0, 104.0]
```

A expressão `c * 9 / 5 + 32` (a fórmula de conversão) vem antes do `for`, exatamente como seria o
corpo do `append()` no loop tradicional — só que sem precisar criar a lista vazia antes nem chamar
`.append()` explicitamente.

## Exercício 2: Filtre e transforme strings

Dada `nomes = ["ana", "bIA", "Carlos", "duda", "EVA"]`, crie uma lista apenas com os nomes que têm
mais de 3 letras, todos capitalizados (primeira letra maiúscula), usando uma única list
comprehension.

### Solução

```python
nomes = ["ana", "bIA", "Carlos", "duda", "EVA"]
resultado = [nome.capitalize() for nome in nomes if len(nome) > 3]

print(resultado)  # ['Ana', 'Carlos', 'Duda']
```

`.capitalize()` transforma a string para que apenas a primeira letra seja maiúscula, e o `if len(nome) > 3` no final filtra antes de aplicar a transformação — a ordem de leitura é sempre
"transformação primeiro, filtro depois" na sintaxe, mas o filtro é avaliado antes para cada item.

## Quiz

### 1. Qual é a saída de `[n for n in range(5) if n % 2 == 0]`?

- [ ] `[0, 1, 2, 3, 4]`
- [x] `[0, 2, 4]`
- [ ] `[1, 3]`
- [ ] `[]`

> O `if` ao final da comprehension funciona como filtro: só os números de `range(5)` (0 a 4) que
> são pares (resto 0 na divisão por 2) entram na lista final: `0`, `2` e `4`.

### 2. O que `{n: n*n for n in range(3)}` cria?

- [ ] Uma lista `[0, 1, 4]`
- [ ] Um set `{0, 1, 4}`
- [x] Um dicionário `{0: 0, 1: 1, 2: 4}`
- [ ] Uma tupla

> Chaves `{}` com `chave: valor for ...` criam uma **dict comprehension**, seguindo a mesma lógica
> das list comprehensions, mas produzindo pares chave-valor em vez de itens soltos.

### 3. Por que list comprehensions costumam ser preferidas a loops com `append()` em Python?

- [ ] Porque loops com `append()` não funcionam mais nas versões recentes
- [x] Porque são mais concisas e geralmente mais rápidas de executar
- [ ] Porque não é possível usar `if` dentro de um loop tradicional
- [ ] Porque list comprehensions não permitem usar `if`

> List comprehensions são consideradas mais idiomáticas (mais "pythônicas") por serem mais
> compactas, e tendem a ser um pouco mais rápidas por serem otimizadas internamente pelo
> interpretador. Loops tradicionais continuam válidos e às vezes são mais legíveis para lógicas
> complexas.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "List comprehensions" na trilha de Python do CodePath. Contexto: o capítulo
> explica a sintaxe `[expressao for item in iteravel if condicao]` e suas variações com dict/set.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
