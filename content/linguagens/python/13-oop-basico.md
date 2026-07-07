---
numero: 13
titulo: "OOP básico"
nivel: "intermediario"
objetivo: "Criar classes, instâncias, atributos e métodos em Python."
duracao: 15
status: "completo"
---

## Conceito

Programação orientada a objetos organiza código em torno de **classes** (moldes) e **objetos**
(instâncias criadas a partir desses moldes). Uma classe define atributos (dados) e métodos
(comportamentos) que cada objeto criado a partir dela vai ter. O método especial `__init__` é o
construtor: roda automaticamente sempre que um novo objeto é criado.

## Sintaxe

```python
class Pessoa:
    def __init__(self, nome, idade):
        self.nome = nome    # atributo de instância
        self.idade = idade

    def apresentar(self):    # método de instância
        return f"Oi, eu sou {self.nome} e tenho {self.idade} anos"

ana = Pessoa("Ana", 28)   # cria uma instância (objeto)
print(ana.nome)             # "Ana"
print(ana.apresentar())     # "Oi, eu sou Ana e tenho 28 anos"
```

## Exemplos comentados

```python
class ContaBancaria:
    # Atributo de classe: compartilhado por TODAS as instâncias
    banco = "Banco CodePath"

    def __init__(self, titular, saldo=0):
        self.titular = titular   # atributo de instância: cada objeto tem o seu
        self.saldo = saldo

    def depositar(self, valor):
        self.saldo += valor

    def sacar(self, valor):
        if valor > self.saldo:
            print("Saldo insuficiente")
            return
        self.saldo -= valor

    def __str__(self):
        # __str__ define como o objeto aparece em print() — um "dunder method"
        return f"Conta de {self.titular}: R${self.saldo}"

conta = ContaBancaria("Bia", 100)
conta.depositar(50)
conta.sacar(30)
print(conta)  # usa __str__: "Conta de Bia: R$120"
print(conta.banco)  # "Banco CodePath" — acessível em qualquer instância

# self é sempre o primeiro parâmetro de métodos de instância — é como o
# Python passa "qual objeto está chamando este método" automaticamente
# (você não passa self explicitamente ao chamar: conta.depositar(50), não
# conta.depositar(conta, 50))
```

## Exercício 1: Modele um retângulo

Crie uma classe `Retangulo` com atributos `largura` e `altura`, e métodos `area()` e
`perimetro()`.

### Solução

```python
class Retangulo:
    def __init__(self, largura, altura):
        self.largura = largura
        self.altura = altura

    def area(self):
        return self.largura * self.altura

    def perimetro(self):
        return 2 * (self.largura + self.altura)

r = Retangulo(4, 5)
print(r.area())       # 20
print(r.perimetro())  # 18
```

Cada método usa `self.largura` e `self.altura` para acessar os atributos daquela instância
específica — se você criasse outro `Retangulo(10, 2)`, ele teria seus próprios valores,
independentes do primeiro.

## Exercício 2: Adicione validação ao construtor

Modifique a classe `ContaBancaria` do exemplo acima para que o construtor lance `ValueError` se o
`saldo` inicial for negativo.

### Solução

```python
class ContaBancaria:
    def __init__(self, titular, saldo=0):
        if saldo < 0:
            raise ValueError("Saldo inicial não pode ser negativo")
        self.titular = titular
        self.saldo = saldo

# conta = ContaBancaria("Carlos", -50)  -> ValueError: Saldo inicial não pode ser negativo
conta_valida = ContaBancaria("Carlos", 50)
```

Validar dentro de `__init__` garante que nenhum objeto `ContaBancaria` inválido (com saldo
negativo) chegue a existir — a validação acontece no exato momento da criação, antes que o objeto
seja usado em qualquer outro lugar do programa.

## Quiz

### 1. Para que serve o método `__init__` em uma classe Python?

- [ ] Para destruir um objeto quando ele não é mais usado
- [x] É o construtor: roda automaticamente ao criar uma nova instância da classe
- [ ] Serve para importar a classe em outro arquivo
- [ ] É opcional e nunca é chamado automaticamente

> `__init__` é chamado automaticamente sempre que você cria um objeto com `NomeDaClasse(...)`. É
> onde normalmente se define e inicializa os atributos de instância com `self.atributo = valor`.

### 2. O que `self` representa dentro de um método de instância?

- [ ] O nome da classe
- [x] O próprio objeto (instância) que está chamando o método
- [ ] Uma variável global compartilhada
- [ ] O módulo onde a classe foi definida

> `self` é a referência ao objeto específico sobre o qual o método está sendo chamado. É por isso
> que `self.saldo` de uma conta é diferente de `self.saldo` de outra conta, mesmo usando o mesmo
> código de método.

### 3. Qual a diferença entre um atributo de classe e um atributo de instância?

- [ ] Não há diferença, são sinônimos
- [x] O de classe é compartilhado por todas as instâncias; o de instância é único de cada objeto
- [ ] Atributo de classe só pode ser um número
- [ ] Atributo de instância não pode ser alterado depois de criado

> Atributos declarados diretamente no corpo da classe (fora de `__init__`) são compartilhados por
> todas as instâncias, como `banco` no exemplo. Atributos definidos com `self.algo = valor` dentro
> de `__init__` (ou outros métodos) pertencem exclusivamente àquela instância.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "OOP básico" na trilha de Python do CodePath. Contexto: o capítulo explica
> classes, `__init__`, atributos de instância vs. de classe, métodos e `self`. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
