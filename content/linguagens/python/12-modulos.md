---
numero: 12
titulo: "Módulos"
nivel: "intermediario"
objetivo: "Organizar código em módulos e importar bibliotecas padrão e próprias."
duracao: 10
status: "completo"
---

## Conceito

Um módulo é simplesmente um arquivo `.py` cujo conteúdo (funções, classes, variáveis) pode ser
importado e reutilizado em outros arquivos. Python vem com uma enorme **biblioteca padrão**
("baterias inclusas") de módulos prontos, e também é possível instalar módulos de terceiros ou
criar os seus próprios.

## Sintaxe

```python
import math
math.sqrt(16)          # 4.0 — acessa com o prefixo do módulo

from math import sqrt
sqrt(16)                 # 4.0 — importa só o que precisa, sem prefixo

from math import sqrt as raiz  # apelido (alias)
raiz(16)

import math as m         # apelido para o módulo inteiro
m.pi
```

## Exemplos comentados

```python
import random
random.randint(1, 10)     # inteiro aleatório entre 1 e 10 (inclusive)
random.choice(["a", "b", "c"])  # escolhe um item aleatório

import datetime
hoje = datetime.date.today()

import os
os.getcwd()               # diretório atual de trabalho
os.listdir(".")           # lista arquivos do diretório

# Criando seu próprio módulo: se você tiver um arquivo "utilitarios.py" com
#
#   def saudacao(nome):
#       return f"Olá, {nome}!"
#
# em outro arquivo do mesmo projeto, você importa assim:
#
#   from utilitarios import saudacao
#   saudacao("Ana")

# __name__ == "__main__" é um padrão comum: só roda o bloco quando o
# arquivo é executado diretamente, não quando é importado por outro módulo
def principal():
    print("Rodando o script principal")

if __name__ == "__main__":
    principal()

# Um "pacote" é uma pasta com um arquivo __init__.py (pode estar vazio),
# agrupando vários módulos relacionados, por exemplo:
#   meu_pacote/
#     __init__.py
#     modulo_a.py
#     modulo_b.py
```

## Exercício 1: Escolha aleatoriamente entre opções

Usando o módulo `random`, escreva código que sorteia e imprime um nome de uma lista
`participantes = ["Ana", "Bia", "Carlos", "Duda"]`.

### Solução

```python
import random

participantes = ["Ana", "Bia", "Carlos", "Duda"]
sorteado = random.choice(participantes)
print(sorteado)
```

`random.choice(lista)` retorna um elemento aleatório da lista, com distribuição uniforme (todos os
itens têm a mesma chance de serem escolhidos). Cada execução do código pode dar um resultado
diferente, já que depende de aleatoriedade.

## Exercício 2: Calcule a área de um círculo

Usando o módulo `math`, escreva uma função `area_circulo(raio)` que retorna a área de um círculo
(fórmula: `π × raio²`), usando `math.pi` em vez de escrever o valor de pi manualmente.

### Solução

```python
import math

def area_circulo(raio):
    return math.pi * raio ** 2

print(area_circulo(5))  # 78.53981633974483
```

`math.pi` fornece o valor de π com muito mais precisão do que digitar `3.14` manualmente, e deixa
claro de onde o valor vem para quem lê o código. O operador `**` é usado para exponenciação em
Python (`raio ** 2` é "raio ao quadrado").

## Quiz

### 1. Qual a diferença entre `import math` e `from math import sqrt`?

- [ ] Não há diferença nenhuma
- [x] `import math` exige o prefixo `math.` para usar; `from math import sqrt` importa a função direto, sem prefixo
- [ ] `from math import sqrt` importa o módulo inteiro
- [ ] `import math` só funciona dentro de funções

> `import math` traz o módulo inteiro, e cada item dele precisa ser acessado com `math.nome`. `from
> math import sqrt` traz especificamente a função `sqrt` para o namespace atual, permitindo chamar
> `sqrt(x)` diretamente.

### 2. Para que serve o padrão `if __name__ == "__main__":`?

- [ ] É obrigatório em todo arquivo Python
- [x] Executa um bloco de código só quando o arquivo é rodado diretamente, não quando é importado
- [ ] Verifica se o Python está instalado corretamente
- [ ] Define o nome da variável principal do programa

> Quando um arquivo é executado diretamente, `__name__` vale `"__main__"`. Quando o mesmo arquivo é
> importado por outro módulo, `__name__` vale o nome do módulo. Esse padrão evita que código de
> teste/demonstração rode automaticamente sempre que o arquivo é importado.

### 3. O que caracteriza um "pacote" (package) em Python?

- [ ] Qualquer arquivo com extensão `.py`
- [x] Uma pasta contendo um arquivo `__init__.py` e outros módulos relacionados
- [ ] Um módulo instalado com pip, apenas
- [ ] Um arquivo com mais de 100 linhas

> Um pacote é uma pasta que agrupa múltiplos módulos relacionados, tradicionalmente marcada por um
> arquivo `__init__.py` (que pode estar vazio) para o Python reconhecê-la como um pacote
> importável.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Módulos" na trilha de Python do CodePath. Contexto: o capítulo explica import,
> from...import, a biblioteca padrão e o padrão `if __name__ == "__main__"`. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
