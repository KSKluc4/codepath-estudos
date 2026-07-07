---
numero: 4
titulo: "Dicionários"
nivel: "basico"
objetivo: "Guardar dados como pares chave-valor com dicionários."
duracao: 12
status: "completo"
---

## Conceito

Um dicionário (`dict`) guarda dados como pares **chave → valor**, em vez de posições numéricas
como uma lista. É a estrutura ideal quando você quer buscar um valor pelo seu "nome" em vez de por
posição — por exemplo, os dados de uma pessoa (`"nome"`, `"idade"`, `"email"`). Desde o Python
3.7, dicionários mantêm a ordem de inserção das chaves.

## Sintaxe

```python
pessoa = {"nome": "Ana", "idade": 28}

pessoa["nome"]           # "Ana" — acesso por chave
pessoa["idade"] = 29     # atualiza o valor da chave
pessoa["email"] = "ana@exemplo.com"  # adiciona uma chave nova

"nome" in pessoa          # True — verifica se a chave existe
len(pessoa)               # 3 — número de pares chave-valor
```

## Exemplos comentados

```python
pessoa = {"nome": "Ana", "idade": 28, "cidade": "Recife"}

pessoa.get("nome")            # "Ana"
pessoa.get("telefone")         # None — não lança erro se a chave não existir
pessoa.get("telefone", "N/A")  # "N/A" — valor padrão quando a chave não existe

del pessoa["cidade"]           # remove a chave "cidade"
pessoa.pop("idade")            # remove e retorna o valor: 28

# Percorrendo um dicionário
for chave in pessoa:
    print(chave, pessoa[chave])

for chave, valor in pessoa.items():
    print(chave, valor)

pessoa.keys()      # dict_keys(['nome']) — todas as chaves
pessoa.values()    # dict_values(['Ana']) — todos os valores

# Acessar uma chave que não existe com [] lança erro:
# pessoa["telefone"]  -> KeyError: 'telefone'
# Por isso .get() costuma ser mais seguro quando a chave pode não existir.

# Dicionários aninhados são comuns para representar dados estruturados
usuario = {
    "nome": "Bia",
    "endereco": {"cidade": "Recife", "estado": "PE"},
}
usuario["endereco"]["cidade"]  # "Recife"
```

## Exercício 1: Conte a frequência de palavras

Dada a lista `palavras = ["python", "java", "python", "c", "python", "java"]`, construa um
dicionário `frequencia` onde a chave é a palavra e o valor é quantas vezes ela aparece.

### Solução

```python
palavras = ["python", "java", "python", "c", "python", "java"]
frequencia = {}

for palavra in palavras:
    frequencia[palavra] = frequencia.get(palavra, 0) + 1

print(frequencia)  # {'python': 3, 'java': 2, 'c': 1}
```

`frequencia.get(palavra, 0)` retorna o contador atual da palavra, ou `0` se ela ainda não apareceu
no dicionário. Somar `1` e reatribuir mantém a contagem sem precisar checar `if palavra in
frequencia` manualmente.

## Exercício 2: Inverta um dicionário

Dado `capitais = {"Brasil": "Brasília", "França": "Paris"}`, crie um novo dicionário onde as
chaves viram valores e os valores viram chaves.

### Solução

```python
capitais = {"Brasil": "Brasília", "França": "Paris"}
invertido = {}

for pais, capital in capitais.items():
    invertido[capital] = pais

print(invertido)  # {'Brasília': 'Brasil', 'Paris': 'França'}
```

`.items()` retorna cada par chave-valor do dicionário original, permitindo desempacotar `pais` e
`capital` diretamente no `for`. Isso só funciona bem quando os valores originais são únicos — se
houvesse valores repetidos, alguns pares se perderiam no dicionário invertido.

## Quiz

### 1. Qual a principal diferença entre `dicionario["chave"]` e `dicionario.get("chave")` quando a chave não existe?

- [ ] Não há diferença
- [x] `[]` lança `KeyError`; `.get()` retorna `None` (ou um valor padrão)
- [ ] `.get()` sempre lança erro
- [ ] `[]` retorna `None` silenciosamente

> Acessar uma chave inexistente com colchetes lança `KeyError` e interrompe o programa (se não
> tratado). `.get()` é a forma segura de acessar, retornando `None` ou um valor padrão que você
> escolher como segundo argumento.

### 2. O que `dicionario.items()` retorna ao ser usado em um `for`?

- [ ] Apenas as chaves
- [ ] Apenas os valores
- [x] Pares (chave, valor)
- [ ] Uma lista de listas

> `.items()` permite percorrer o dicionário obtendo tanto a chave quanto o valor em cada iteração,
> geralmente desempacotados como `for chave, valor in dicionario.items()`.

### 3. Desde qual versão os dicionários em Python garantem manter a ordem de inserção das chaves?

- [ ] Python 2.7
- [ ] Não garantem ordem em nenhuma versão
- [x] Python 3.7
- [ ] Python 3.0

> A partir do Python 3.7, a ordem de inserção das chaves em um dicionário é garantida pela
> linguagem (antes disso já era um efeito colateral de implementação no CPython 3.6, mas só virou
> garantia oficial na 3.7).

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Dicionários" na trilha de Python do CodePath. Contexto: o capítulo explica
> pares chave-valor, os métodos get/pop/items/keys/values e como percorrer dicionários. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
