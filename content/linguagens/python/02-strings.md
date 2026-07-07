---
numero: 2
titulo: "Strings"
nivel: "basico"
objetivo: "Manipular texto em Python: fatiamento, métodos comuns e f-strings."
duracao: 12
status: "completo"
---

## Conceito

Strings em Python são sequências imutáveis de caracteres: uma vez criada, uma string nunca é
alterada — todo método que "modifica" uma string na verdade retorna uma string **nova**. Por serem
sequências, strings suportam indexação e fatiamento (`slicing`), assim como listas.

## Sintaxe

```python
s = "Python"

s[0]          # 'P' — indexação começa em 0
s[-1]         # 'n' — índice negativo conta do fim
s[0:3]        # 'Pyt' — fatiamento [início:fim) (fim não incluído)
s[:3]         # 'Pyt' — início omitido = começa do 0
s[3:]         # 'hon' — fim omitido = vai até o final
s[::-1]       # 'nohtyP' — passo -1 inverte a string

len(s)        # 6 — número de caracteres
```

## Exemplos comentados

```python
nome = "Ana Clara"

nome.lower()          # "ana clara"
nome.upper()          # "ANA CLARA"
nome.strip()          # remove espaços do início/fim
nome.replace("Ana", "Bia")  # "Bia Clara"
nome.split(" ")        # ["Ana", "Clara"] — quebra em lista
"-".join(["a", "b", "c"])  # "a-b-c" — junta lista em string

nome.startswith("Ana")  # True
"clara" in nome.lower()  # True — operador 'in' verifica substring

# f-strings: forma moderna e recomendada de formatar texto
idade = 28
print(f"{nome} tem {idade} anos")           # "Ana Clara tem 28 anos"
print(f"{idade * 2 = }")                     # "idade * 2 = 56" (debug rápido)
pi = 3.14159
print(f"Pi arredondado: {pi:.2f}")           # "Pi arredondado: 3.14"

# Strings são imutáveis: isso cria uma string NOVA, não altera "nome"
maiusculo = nome.upper()
```

## Exercício 1: Normalize o nome de usuário

Dado o texto `"  João DA Silva  "`, escreva código que produza `"joao_da_silva"`: sem espaços nas
pontas, tudo minúsculo e espaços internos trocados por `_`. (Não se preocupe com o acento do "ã"
por enquanto.)

### Solução

```python
texto = "  João DA Silva  "
resultado = texto.strip().lower().replace(" ", "_")
print(resultado)  # "joão_da_silva"
```

A ordem importa: primeiro `strip()` remove os espaços das pontas, depois `lower()` deixa tudo
minúsculo, e por fim `replace(" ", "_")` troca os espaços internos por underscore. Métodos de
string podem ser encadeados porque cada um retorna uma nova string.

## Exercício 2: Verifique um palíndromo simples

Escreva uma expressão que verifique se a string `"arara"` é um palíndromo (lê-se igual de trás
para frente), ignorando maiúsculas/minúsculas.

### Solução

```python
palavra = "Arara"
eh_palindromo = palavra.lower() == palavra.lower()[::-1]
print(eh_palindromo)  # True
```

`palavra.lower()[::-1]` primeiro normaliza para minúsculas e depois usa fatiamento com passo `-1`
para inverter a string. Comparar o resultado com a versão normal (também em minúsculas) responde
se é um palíndromo.

## Quiz

### 1. O que `"Python"[1:4]` retorna?

- [ ] `"Pyth"`
- [x] `"yth"`
- [ ] `"ytho"`
- [ ] `"Pytho"`

> O fatiamento `[1:4]` pega os índices 1, 2 e 3 (o índice final é sempre excluído). Isso dá
> `"y"` + `"t"` + `"h"` = `"yth"`.

### 2. Qual das opções abaixo NÃO altera a string original `texto`?

- [ ] Nenhuma das opções abaixo — todas alteram
- [x] `texto.upper()` sem reatribuir o resultado
- [ ] `texto = texto.upper()`
- [ ] `texto += "!"`

> Strings são imutáveis em Python. `texto.upper()` retorna uma string nova; se você não reatribuir
> o resultado a uma variável, a string original `texto` continua igual.

### 3. O que uma f-string como `f"{nome}"` faz?

- [ ] Converte `nome` para maiúsculas automaticamente
- [x] Insere o valor da variável `nome` diretamente no texto
- [ ] Cria uma nova variável chamada `nome`
- [ ] Só funciona com números

> f-strings (`f"..."`) permitem interpolar o valor de qualquer expressão Python dentro de chaves
> `{}` diretamente no texto, sem precisar concatenar com `+` ou usar `.format()`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Strings" na trilha de Python do CodePath. Contexto: o capítulo explica
> fatiamento (slicing), métodos de string comuns e f-strings. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
