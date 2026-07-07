---
numero: 16
titulo: "Geradores"
nivel: "avancado"
objetivo: "Criar iteradores preguiçosos com generators e a palavra-chave yield."
duracao: 15
status: "completo"
---

## Conceito

Um gerador (generator) é uma função especial que produz valores um de cada vez, sob demanda
("lazy" ou preguiçosa), em vez de calcular e guardar todos os valores na memória de uma vez, como
uma lista faria. Isso é feito com a palavra-chave `yield` no lugar de `return`. Geradores são
ideais para trabalhar com sequências grandes (ou até infinitas) sem estourar a memória.

## Sintaxe

```python
def contador(limite):
    n = 0
    while n < limite:
        yield n   # "pausa" a função aqui e devolve o valor
        n += 1

gerador = contador(3)
next(gerador)  # 0
next(gerador)  # 1
next(gerador)  # 2
# next(gerador)  -> StopIteration (acabaram os valores)

# O jeito mais comum de consumir um gerador é com um for, que já trata o StopIteration
for numero in contador(3):
    print(numero)  # 0, 1, 2
```

## Exemplos comentados

```python
# Diferença de memória: uma lista guarda TODOS os valores de uma vez
def quadrados_lista(n):
    return [i * i for i in range(n)]   # calcula e guarda tudo já

# Um gerador calcula um valor por vez, sob demanda
def quadrados_gerador(n):
    for i in range(n):
        yield i * i   # só calcula quando alguém pede o próximo valor

# Para um milhão de itens, a versão gerador usa MUITO menos memória,
# porque nunca guarda a lista inteira ao mesmo tempo

# Expressão geradora: como uma list comprehension, mas com () em vez de []
gerador_exp = (x * x for x in range(5))  # não calcula nada ainda
lista_de_gerador = list(gerador_exp)      # [0, 1, 4, 9, 16] — só agora calcula tudo

# Geradores são úteis para ler arquivos grandes linha por linha sem
# carregar o arquivo inteiro na memória
def ler_linhas_grandes(caminho):
    with open(caminho) as arquivo:
        for linha in arquivo:
            yield linha.strip()

# Um gerador só pode ser percorrido UMA VEZ — depois de esgotado, "acabou"
g = (x for x in range(3))
list(g)  # [0, 1, 2]
list(g)  # [] — já foi consumido
```

## Exercício 1: Gerador de números pares

Escreva um gerador `numeros_pares(limite)` que produz os números pares de 0 até `limite`
(inclusive), um de cada vez.

### Solução

```python
def numeros_pares(limite):
    n = 0
    while n <= limite:
        yield n
        n += 2

for par in numeros_pares(10):
    print(par)  # 0, 2, 4, 6, 8, 10
```

Como `n` começa em `0` (já par) e é incrementado de 2 em 2, todo valor gerado é automaticamente
par — não é preciso nenhuma verificação `if n % 2 == 0` dentro do loop.

## Exercício 2: Gerador infinito com limite de consumo

Escreva um gerador infinito `fibonacci()` que produz a sequência de Fibonacci indefinidamente, e
depois use-o para imprimir apenas os 10 primeiros valores.

### Solução

```python
def fibonacci():
    a, b = 0, 1
    while True:  # gerador infinito — nunca para sozinho
        yield a
        a, b = b, a + b

gerador = fibonacci()
primeiros_dez = [next(gerador) for _ in range(10)]
print(primeiros_dez)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

Um gerador infinito só é seguro de usar porque `yield` pausa a execução a cada valor — a função
nunca tenta calcular "todos" os valores de uma vez (o que seria impossível, já que a sequência não
tem fim). É responsabilidade de quem consome o gerador decidir quando parar, como o `range(10)` faz
aqui.

## Quiz

### 1. Qual a principal diferença entre `return` e `yield` em uma função?

- [ ] Não há diferença, são sinônimos
- [x] `return` encerra a função de vez; `yield` pausa e permite retomar de onde parou
- [ ] `yield` só funciona em classes
- [ ] `return` é mais rápido que `yield` sempre

> `return` finaliza a execução da função completamente. `yield` "pausa" a execução, devolvendo um
> valor, mas preserva todo o estado interno da função (variáveis locais) para continuar de onde
> parou na próxima chamada de `next()`.

### 2. Por que geradores costumam usar menos memória do que listas para sequências grandes?

- [ ] Geradores comprimem os dados automaticamente
- [x] Geradores calculam e guardam apenas um valor de cada vez, sob demanda
- [ ] Listas sempre ocupam mais espaço em disco
- [ ] Não há diferença de memória entre os dois

> Uma lista precisa ter todos os elementos calculados e guardados na memória simultaneamente. Um
> gerador produz cada valor apenas quando solicitado (via `next()` ou em um `for`), sem nunca
> manter a sequência inteira em memória ao mesmo tempo.

### 3. O que acontece ao tentar percorrer um gerador já esgotado pela segunda vez?

- [ ] Ele reinicia do começo automaticamente
- [x] Não produz nenhum valor — o gerador já foi consumido
- [ ] Lança um erro de sintaxe
- [ ] Retorna os mesmos valores em ordem reversa

> Um gerador é um iterador de uso único: depois que todos os valores foram consumidos (ou o loop
> terminou), ele não pode ser "rebobinado". Para percorrer os mesmos valores de novo, é preciso
> criar uma nova instância do gerador chamando a função geradora novamente.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Geradores" na trilha de Python do CodePath. Contexto: o capítulo explica yield,
> a diferença entre listas e geradores, e expressões geradoras. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
