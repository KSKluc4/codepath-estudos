---
numero: 14
titulo: "OOP avançado"
nivel: "avancado"
objetivo: "Aplicar herança, polimorfismo e métodos especiais (dunder methods)."
duracao: 15
status: "completo"
---

## Conceito

Herança permite que uma classe reaproveite atributos e métodos de outra, criando hierarquias
(`Cachorro` herda de `Animal`). Polimorfismo é a capacidade de classes diferentes responderem ao
mesmo método de formas diferentes. Métodos especiais (ou "dunder methods", de *double underscore*)
como `__init__`, `__str__` e `__eq__` são o que permitem que objetos customizados se comportem como
tipos nativos do Python (imprimíveis, comparáveis, somáveis, etc.).

## Sintaxe

```python
class Animal:
    def __init__(self, nome):
        self.nome = nome

    def fazer_som(self):
        return "..."

class Cachorro(Animal):        # Cachorro herda de Animal
    def fazer_som(self):        # sobrescreve (override) o método do pai
        return "Au au!"

class Gato(Animal):
    def fazer_som(self):
        return "Miau!"

animais = [Cachorro("Rex"), Gato("Mimi")]
for animal in animais:
    print(animal.nome, animal.fazer_som())  # polimorfismo: mesmo método, comportamentos diferentes
```

## Exemplos comentados

```python
class Funcionario:
    def __init__(self, nome, salario):
        self.nome = nome
        self.salario = salario

    def bonificacao(self):
        return self.salario * 0.1

class Gerente(Funcionario):
    def __init__(self, nome, salario, equipe):
        super().__init__(nome, salario)  # chama o __init__ da classe pai
        self.equipe = equipe

    def bonificacao(self):
        # sobrescreve o método do pai, mas reaproveita o valor original com super()
        return super().bonificacao() + len(self.equipe) * 100

g = Gerente("Duda", 8000, ["Ana", "Bia"])
print(g.bonificacao())  # 8000*0.1 + 2*100 = 1000.0

# isinstance() verifica o tipo respeitando a hierarquia de herança
isinstance(g, Gerente)      # True
isinstance(g, Funcionario)  # True — Gerente também É UM Funcionario

# Dunder methods deixam objetos customizados se comportarem como tipos nativos
class Ponto:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"          # usado por print() e str()

    def __eq__(self, outro):
        return self.x == outro.x and self.y == outro.y  # usado por ==

    def __add__(self, outro):
        return Ponto(self.x + outro.x, self.y + outro.y)  # usado por +

p1 = Ponto(1, 2)
p2 = Ponto(3, 4)
print(p1 + p2)          # (4, 6) — chama __add__
print(p1 == Ponto(1, 2))  # True — chama __eq__
```

## Exercício 1: Crie uma hierarquia de formas

Crie uma classe base `Forma` com um método `area()` que lança `NotImplementedError`, e duas
subclasses `Quadrado` e `Circulo` que sobrescrevem `area()` com o cálculo correto.

### Solução

```python
import math

class Forma:
    def area(self):
        raise NotImplementedError("Subclasses devem implementar area()")

class Quadrado(Forma):
    def __init__(self, lado):
        self.lado = lado

    def area(self):
        return self.lado ** 2

class Circulo(Forma):
    def __init__(self, raio):
        self.raio = raio

    def area(self):
        return math.pi * self.raio ** 2

formas = [Quadrado(4), Circulo(3)]
for forma in formas:
    print(forma.area())  # 16, 28.27...
```

Lançar `NotImplementedError` na classe base é uma forma comum de dizer "toda subclasse é obrigada
a implementar este método" — se alguém criar uma nova forma e esquecer de sobrescrever `area()`, o
erro aparece imediatamente ao tentar usá-la, em vez de silenciosamente dar um resultado errado.

## Exercício 2: Implemente __lt__ para ordenação customizada

Dada a classe `Produto` abaixo, implemente o método `__lt__` (usado pelo operador `<`) para que uma
lista de produtos possa ser ordenada por preço usando `sorted()`.

```python
class Produto:
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco
```

### Solução

```python
class Produto:
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco

    def __lt__(self, outro):
        return self.preco < outro.preco

    def __repr__(self):
        return f"Produto({self.nome}, {self.preco})"

produtos = [Produto("Mouse", 80), Produto("Teclado", 150), Produto("Cabo", 20)]
produtos_ordenados = sorted(produtos)
print(produtos_ordenados)  # [Produto(Cabo, 20), Produto(Mouse, 80), Produto(Teclado, 150)]
```

`sorted()` usa o operador `<` internamente para comparar os elementos; implementando `__lt__`, você
ensina ao Python como comparar dois objetos `Produto`, sem precisar passar uma função `key`
manualmente.

## Quiz

### 1. O que `super().__init__(...)` faz dentro do construtor de uma subclasse?

- [ ] Cria uma nova instância da classe pai, separada
- [x] Chama o construtor da classe pai, reaproveitando sua lógica de inicialização
- [ ] Remove os atributos herdados
- [ ] Só funciona se a classe pai não tiver `__init__`

> `super()` retorna uma referência à classe pai, permitindo chamar seus métodos (mais comumente o
> `__init__`) sem repetir o código deles na subclasse.

### 2. O que o método especial `__str__` controla?

- [ ] Como o objeto é comparado com `==`
- [x] Como o objeto é representado como texto por `print()` e `str()`
- [ ] Como o objeto é somado com `+`
- [ ] Se o objeto pode ser usado em um `for`

> `__str__` define a representação legível de um objeto quando você usa `print(objeto)` ou
> `str(objeto)`. Sem ele, `print()` mostraria algo genérico como `<__main__.Ponto object at
> 0x...>`.

### 3. O que caracteriza "polimorfismo" no exemplo dos animais?

- [ ] Cachorro e Gato terem o mesmo `__init__`
- [x] Chamar `animal.fazer_som()` produz um resultado diferente dependendo da classe real do objeto
- [ ] Usar `isinstance()` para checar o tipo
- [ ] Os animais compartilharem o mesmo atributo `nome`

> Polimorfismo é a capacidade de tratar objetos de classes diferentes de forma uniforme (mesmo
> nome de método), deixando cada classe decidir seu próprio comportamento — no exemplo, o mesmo
> `for animal in animais: animal.fazer_som()` produz sons diferentes para cada tipo de animal.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "OOP avançado" na trilha de Python do CodePath. Contexto: o capítulo explica
> herança, `super()`, polimorfismo e métodos especiais como `__str__`, `__eq__` e `__add__`. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
