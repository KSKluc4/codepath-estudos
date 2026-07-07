---
numero: 9
titulo: "Herança e polimorfismo"
nivel: "intermediario"
objetivo: "Reaproveitar e sobrescrever comportamento entre classes com herança e override."
duracao: 15
status: "completo"
---

## Conceito

C# suporta herança simples entre classes (`class Filha : Pai`), e exige que a intenção de
sobrescrever um método seja **explícita** dos dois lados: o método na classe base precisa ser
marcado `virtual` (ou `abstract`) para permitir ser sobrescrito, e a subclasse precisa usar
`override` — diferente de linguagens onde qualquer método pode ser sobrescrito silenciosamente.

## Sintaxe

```csharp
class Animal {
    public string Nome { get; set; }
    public virtual string FazerSom() => "...";
}

class Cachorro : Animal {
    public override string FazerSom() => "Au au!";
}
```

## Exemplos comentados

```csharp
class Funcionario {
    public string Nome { get; set; }
    public double Salario { get; set; }

    public Funcionario(string nome, double salario) {
        Nome = nome;
        Salario = salario;
    }

    public virtual double CalcularBonus() => Salario * 0.1;
}

class Gerente : Funcionario {
    public int TamanhoEquipe { get; set; }

    // base(...) chama o construtor da classe pai
    public Gerente(string nome, double salario, int tamanhoEquipe)
        : base(nome, salario) {
        TamanhoEquipe = tamanhoEquipe;
    }

    public override double CalcularBonus() {
        return base.CalcularBonus() + TamanhoEquipe * 100; // reaproveita a lógica do pai
    }
}

Gerente g = new Gerente("Duda", 8000, 3);
Console.WriteLine(g.CalcularBonus()); // 8000*0.1 + 3*100 = 1100

// Polimorfismo: uma lista de Funcionario pode conter Gerentes também
List<Funcionario> equipe = new List<Funcionario> {
    new Funcionario("Ana", 5000),
    new Gerente("Bia", 7000, 2)
};
foreach (Funcionario f in equipe) {
    Console.WriteLine(f.CalcularBonus()); // chama a versão CORRETA para cada tipo real
}

// Classe abstrata: não pode ser instanciada diretamente, só serve de base
abstract class Forma {
    public abstract double Area(); // sem corpo — subclasses SÃO OBRIGADAS a implementar
}

class Circulo : Forma {
    public double Raio { get; set; }
    public override double Area() => Math.PI * Raio * Raio;
}

// sealed: impede que uma classe (ou método) seja herdada/sobrescrita novamente
sealed class Configuracao { }
// class Estendida : Configuracao { } // erro de compilação
```

## Exercício 1: Crie uma hierarquia de animais

Crie uma classe base `Animal` com um método virtual `FazerSom()`, e duas subclasses `Gato` e
`Cachorro` que o sobrescrevem com sons diferentes.

### Solução

```csharp
class Animal {
    public string Nome { get; set; }
    public virtual string FazerSom() => "...";
}

class Cachorro : Animal {
    public override string FazerSom() => "Au au!";
}

class Gato : Animal {
    public override string FazerSom() => "Miau!";
}

List<Animal> animais = new List<Animal> {
    new Cachorro { Nome = "Rex" },
    new Gato { Nome = "Mimi" }
};

foreach (Animal a in animais) {
    Console.WriteLine($"{a.Nome}: {a.FazerSom()}");
}
// Rex: Au au!
// Mimi: Miau!
```

Mesmo percorrendo a lista como `Animal` (o tipo declarado), cada chamada a `FazerSom()` executa a
versão sobrescrita correspondente ao tipo **real** do objeto em tempo de execução — esse é o
polimorfismo em ação, possível porque o método foi declarado `virtual` na classe base.

## Exercício 2: Use uma classe abstrata

Crie uma classe abstrata `Forma` com um método abstrato `Area()`, e uma subclasse `Quadrado` que o
implementa.

### Solução

```csharp
abstract class Forma {
    public abstract double Area();
}

class Quadrado : Forma {
    public double Lado { get; set; }

    public Quadrado(double lado) {
        Lado = lado;
    }

    public override double Area() => Lado * Lado;
}

Quadrado q = new Quadrado(4);
Console.WriteLine(q.Area()); // 16
// Forma f = new Forma(); // erro: não é possível instanciar uma classe abstrata
```

`abstract class Forma` não pode ser instanciada diretamente (`new Forma()` seria um erro de
compilação) — ela só existe para servir de base, garantindo (em tempo de compilação) que toda
subclasse concreta implemente `Area()`, já que o método abstrato não tem corpo próprio.

## Quiz

### 1. O que é necessário para um método de uma classe pai poder ser sobrescrito por uma subclasse em C#?

- [ ] Nada, qualquer método pode ser sobrescrito por padrão
- [x] O método na classe pai precisa ser marcado `virtual` (ou `abstract`), e a subclasse usa `override`
- [ ] Basta declarar o método com o mesmo nome na subclasse, sem nenhuma palavra-chave
- [ ] Só é possível sobrescrever métodos `static`

> C# exige intenção explícita dos dois lados: `virtual` na classe base permite que o método seja
> sobrescrito, e `override` na subclasse confirma que está sobrescrevendo (e não apenas
> "escondendo") aquele método — sem essas palavras-chave, o compilador acusa erro ou aviso,
> evitando sobrescritas acidentais.

### 2. O que `base.CalcularBonus()` faz dentro do método sobrescrito de uma subclasse?

- [ ] Cria uma nova instância da classe pai
- [x] Chama a implementação ORIGINAL do método, definida na classe pai, permitindo reaproveitá-la
- [ ] Sempre lança uma exceção
- [ ] É equivalente a chamar `this.CalcularBonus()`

> `base.Metodo()` acessa explicitamente a versão do método definida na classe pai, mesmo estando
> dentro de uma sobrescrita (`override`) na subclasse — útil para estender o comportamento
> original em vez de substituí-lo completamente, como em `Gerente.CalcularBonus`.

### 3. Por que uma classe `abstract` não pode ser instanciada diretamente?

- [ ] Porque C# não permite classes abstratas
- [x] Porque ela pode conter métodos `abstract` sem implementação, que só fazem sentido quando fornecidos por uma subclasse concreta
- [ ] Porque classes abstratas são sempre `sealed`
- [ ] É apenas uma convenção, sem imposição do compilador

> Uma classe abstrata serve como um "molde incompleto": métodos `abstract` declarados nela não têm
> corpo, então não haveria como executar essa classe diretamente. O compilador impede `new
> ClasseAbstrata()`, exigindo que uma subclasse concreta implemente todos os métodos abstratos
> antes de poder ser instanciada.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Herança e polimorfismo" na trilha de C# do CodePath. Contexto: o capítulo
> explica herança com `:`, virtual/override, base(), classes abstratas e polimorfismo. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
