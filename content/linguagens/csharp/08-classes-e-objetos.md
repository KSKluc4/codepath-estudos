---
numero: 8
titulo: "Classes e objetos"
nivel: "intermediario"
objetivo: "Definir classes, construtores e propriedades (get/set) em C#."
duracao: 15
status: "completo"
---

## Conceito

C# é uma linguagem orientada a objetos "de raiz": todo código roda dentro de uma classe. Além de
campos e métodos, C# tem **propriedades** (properties): uma sintaxe especial que expõe acesso
controlado a um valor, parecendo um campo comum para quem usa (`objeto.Nome`), mas com lógica de
`get`/`set` por trás — dispensando, na maioria dos casos, métodos explícitos `getNome()`/`setNome()`.

## Sintaxe

```csharp
class Pessoa {
    public string Nome { get; set; }
    public int Idade { get; set; }

    public string Apresentar() {
        return $"Oi, eu sou {Nome} e tenho {Idade} anos";
    }
}

Pessoa ana = new Pessoa { Nome = "Ana", Idade = 28 };
Console.WriteLine(ana.Apresentar());
```

## Exemplos comentados

```csharp
class ContaBancaria {
    public string Titular { get; set; }
    public double Saldo { get; private set; } // só a própria classe pode alterar Saldo

    // Construtor: mesmo nome da classe, sem tipo de retorno
    public ContaBancaria(string titular, double saldoInicial = 0) {
        Titular = titular;
        Saldo = saldoInicial;
    }

    public void Depositar(double valor) {
        Saldo += valor;
    }

    public bool Sacar(double valor) {
        if (valor > Saldo) return false;
        Saldo -= valor;
        return true;
    }

    // ToString sobrescrito: usado automaticamente ao imprimir o objeto
    public override string ToString() {
        return $"Conta de {Titular}: R${Saldo:F2}";
    }
}

ContaBancaria conta = new ContaBancaria("Bia", 100);
conta.Depositar(50);
conta.Sacar(30);
Console.WriteLine(conta); // usa ToString(): "Conta de Bia: R$120.00"

// Object initializer: forma concisa de criar e configurar um objeto de uma vez
Pessoa carlos = new Pessoa { Nome = "Carlos", Idade = 40 };

// Propriedade com lógica customizada (não apenas auto-implementada como Nome acima)
class Retangulo {
    public double Largura { get; set; }
    public double Altura { get; set; }

    public double Area => Largura * Altura; // propriedade calculada (read-only), sem set

    // Propriedade com validação no set
    private int _idade;
    public int Idade {
        get => _idade;
        set {
            if (value < 0) throw new ArgumentException("Idade não pode ser negativa");
            _idade = value;
        }
    }
}

// Campos vs. propriedades: campos são variáveis "cruas"; propriedades expõem
// acesso controlado — a convenção em C# é sempre preferir propriedades públicas
```

## Exercício 1: Modele um retângulo

Crie uma classe `Retangulo` com propriedades `Largura` e `Altura`, um construtor que as recebe, e
uma propriedade calculada `Area` (`Largura * Altura`).

### Solução

```csharp
class Retangulo {
    public double Largura { get; set; }
    public double Altura { get; set; }

    public Retangulo(double largura, double altura) {
        Largura = largura;
        Altura = altura;
    }

    public double Area => Largura * Altura;
}

Retangulo r = new Retangulo(4, 5);
Console.WriteLine(r.Area); // 20
```

`Area` é uma propriedade **calculada**, sem `set`: seu valor é sempre derivado de `Largura` e
`Altura` no momento em que é lida, usando a sintaxe `=>` (expression-bodied property) — não existe
um campo `_area` guardando esse valor separadamente.

## Exercício 2: Adicione validação com uma propriedade customizada

Modifique a classe `ContaBancaria` do exemplo para que `Saldo` lance `ArgumentException` se
alguém tentar defini-lo diretamente com um valor negativo (usando um `set` customizado sobre um
campo privado).

### Solução

```csharp
class ContaBancaria {
    public string Titular { get; set; }

    private double _saldo;
    public double Saldo {
        get => _saldo;
        private set {
            if (value < 0) throw new ArgumentException("Saldo não pode ser negativo");
            _saldo = value;
        }
    }

    public ContaBancaria(string titular, double saldoInicial = 0) {
        Titular = titular;
        Saldo = saldoInicial;
    }

    public void Depositar(double valor) => Saldo += valor;
}
```

O `set` customizado intercepta qualquer tentativa de atribuição a `Saldo` (inclusive de dentro da
própria classe, como em `Saldo += valor`) e valida o novo valor antes de gravá-lo no campo privado
`_saldo` — `private set` ainda impede que código externo à classe altere `Saldo` diretamente, só
através dos métodos que a classe expõe, como `Depositar`.

## Quiz

### 1. O que uma propriedade auto-implementada como `public string Nome { get; set; }` faz?

- [ ] Declara um método chamado `get` e outro chamado `set`
- [x] Expõe um campo com acesso controlado, gerando automaticamente um campo interno oculto e a lógica trivial de leitura/escrita
- [ ] É equivalente a uma variável `public string Nome;` comum, sem diferença real
- [ ] Só pode ser usada dentro de construtores

> Uma propriedade auto-implementada cria, por baixo dos panos, um campo privado oculto e os
> métodos de acesso (`get`/`set`) triviais para ele — permitindo, mais tarde, adicionar lógica
> customizada (como validação) sem quebrar o código que já usa `objeto.Nome`.

### 2. Qual a diferença entre `public set;` e `private set;` em uma propriedade?

- [ ] Não há diferença
- [x] `private set` só permite que código DENTRO da própria classe altere o valor da propriedade
- [ ] `private set` impede totalmente qualquer alteração, mesmo de dentro da classe
- [ ] `public set` só funciona em construtores

> `private set` continua permitindo leitura pública (`get`) da propriedade de qualquer lugar, mas
> restringe quem pode atribuir um novo valor a ela apenas ao código dentro da própria classe —
> muito usado para expor um valor somente leitura externamente, mas mutável internamente (como
> `Saldo`, alterado só através de métodos como `Depositar`/`Sacar`).

### 3. Para que serve sobrescrever o método `ToString()` de uma classe?

- [ ] É obrigatório em toda classe C#
- [x] Define como o objeto é representado como texto, usado automaticamente por `Console.WriteLine` e interpolação de string
- [ ] Converte a classe inteira para minúsculas
- [ ] Remove todos os métodos da classe

> Sem sobrescrever `ToString()`, imprimir um objeto mostraria algo genérico como o nome completo
> da classe. Sobrescrevê-lo (`public override string ToString() { ... }`) permite controlar
> exatamente como o objeto aparece ao ser passado para `Console.WriteLine(objeto)` ou usado dentro
> de uma string interpolada.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Classes e objetos" na trilha de C# do CodePath. Contexto: o capítulo explica
> classes, construtores, propriedades (get/set, auto-implementadas e calculadas) e ToString. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
