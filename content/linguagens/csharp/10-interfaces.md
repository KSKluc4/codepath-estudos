---
numero: 10
titulo: "Interfaces"
nivel: "intermediario"
objetivo: "Definir contratos de comportamento com interfaces em C#."
duracao: 12
status: "completo"
---

## Conceito

Uma interface em C# define um **contrato**: um conjunto de métodos (e propriedades) que qualquer
classe que a implementa é obrigada a fornecer, sem ditar como esses métodos devem funcionar
internamente. Diferente de herança de classe (que só permite um pai), uma classe em C# pode
implementar **várias** interfaces ao mesmo tempo — é assim que C# resolve a necessidade de
"herança múltipla" de comportamento.

## Sintaxe

```csharp
interface IFormaGeometrica {
    double Area();
}

class Circulo : IFormaGeometrica {
    public double Raio { get; set; }
    public double Area() => Math.PI * Raio * Raio;
}
```

## Exemplos comentados

```csharp
// Convenção: nomes de interface começam com "I" (IFormaGeometrica, IComparable, etc.)
interface IFormaGeometrica {
    double Area();
    double Perimetro();
}

class Retangulo : IFormaGeometrica {
    public double Largura { get; set; }
    public double Altura { get; set; }

    public double Area() => Largura * Altura;
    public double Perimetro() => 2 * (Largura + Altura);
}

// Uma classe pode implementar VÁRIAS interfaces
interface IDesenhavel {
    void Desenhar();
}

class Quadrado : IFormaGeometrica, IDesenhavel {
    public double Lado { get; set; }
    public double Area() => Lado * Lado;
    public double Perimetro() => Lado * 4;
    public void Desenhar() => Console.WriteLine("Desenhando quadrado...");
}

// Programar contra a interface, não a implementação concreta
void ImprimirArea(IFormaGeometrica forma) {
    Console.WriteLine(forma.Area());
}
ImprimirArea(new Retangulo { Largura = 4, Altura = 5 }); // funciona
ImprimirArea(new Quadrado { Lado = 3 });                  // também funciona

// Interfaces embutidas muito usadas na biblioteca padrão
class Produto : IComparable<Produto> {
    public string Nome { get; set; }
    public double Preco { get; set; }

    // Implementar IComparable<T> permite usar List<T>.Sort() diretamente
    public int CompareTo(Produto outro) => Preco.CompareTo(outro.Preco);
}

List<Produto> produtos = new List<Produto> {
    new Produto { Nome = "Mouse", Preco = 80 },
    new Produto { Nome = "Teclado", Preco = 150 }
};
produtos.Sort(); // usa CompareTo automaticamente

// A partir do C# 8, interfaces podem ter métodos com implementação padrão
interface ILogger {
    void Log(string mensagem) => Console.WriteLine($"[LOG] {mensagem}"); // padrão, opcional sobrescrever
}
```

## Exercício 1: Defina e implemente uma interface

Defina uma interface `INotificavel` com um método `void Notificar(string mensagem)`, e implemente-a
em uma classe `Usuario`, imprimindo a mensagem recebida.

### Solução

```csharp
interface INotificavel {
    void Notificar(string mensagem);
}

class Usuario : INotificavel {
    public string Nome { get; set; }

    public void Notificar(string mensagem) {
        Console.WriteLine($"[{Nome}] {mensagem}");
    }
}

Usuario ana = new Usuario { Nome = "Ana" };
ana.Notificar("Você tem uma nova mensagem"); // [Ana] Você tem uma nova mensagem
```

A interface `INotificavel` não define COMO a notificação deve ser exibida — apenas que qualquer
classe "notificável" precisa ter um método `Notificar` com essa assinatura. `Usuario` fornece sua
própria implementação, e outra classe (como `Sistema`, por exemplo) poderia implementar a mesma
interface de forma completamente diferente (enviando um e-mail, por exemplo).

## Exercício 2: Programe contra a interface

Escreva uma função `void NotificarTodos(List<INotificavel> destinatarios, string mensagem)` que
notifica uma lista de objetos que implementam `INotificavel`, sem se importar com o tipo concreto
de cada um.

### Solução

```csharp
interface INotificavel {
    void Notificar(string mensagem);
}

class Usuario : INotificavel {
    public string Nome { get; set; }
    public void Notificar(string mensagem) => Console.WriteLine($"[Usuário {Nome}] {mensagem}");
}

class Grupo : INotificavel {
    public string NomeGrupo { get; set; }
    public void Notificar(string mensagem) => Console.WriteLine($"[Grupo {NomeGrupo}] {mensagem}");
}

void NotificarTodos(List<INotificavel> destinatarios, string mensagem) {
    foreach (INotificavel d in destinatarios) {
        d.Notificar(mensagem);
    }
}

List<INotificavel> lista = new List<INotificavel> {
    new Usuario { Nome = "Ana" },
    new Grupo { NomeGrupo = "Equipe Dev" }
};
NotificarTodos(lista, "Reunião às 15h");
```

`List<INotificavel>` pode conter objetos de classes completamente diferentes (`Usuario`, `Grupo`),
desde que todas implementem a interface — a função `NotificarTodos` não precisa saber (nem se
importar) com o tipo concreto de cada item, apenas que todos garantem ter um método `Notificar`.

## Quiz

### 1. Quantas interfaces uma única classe pode implementar em C#?

- [ ] No máximo uma
- [x] Quantas forem necessárias, ao contrário de herança de classe (que permite só uma classe base)
- [ ] Nenhuma, interfaces não existem em C#
- [ ] Exatamente duas

> Diferente de herança de classe (`class B : A`, apenas uma classe base permitida), uma classe C#
> pode implementar múltiplas interfaces ao mesmo tempo (`class C : IX, IY, IZ`), já que interfaces
> só definem contratos, sem trazer implementação ou estado próprios (com exceção de métodos
> default, um recurso mais recente).

### 2. Qual a principal diferença entre uma interface e uma classe abstrata?

- [ ] São exatamente a mesma coisa
- [x] Uma classe só pode herdar de uma única classe abstrata, mas pode implementar várias interfaces ao mesmo tempo
- [ ] Interfaces podem ter construtores, classes abstratas não
- [ ] Classes abstratas não podem ter métodos

> Ambas definem contratos que subclasses/implementações devem seguir, mas herança de classe
> (inclusive abstrata) é limitada a um único pai em C#, enquanto uma classe pode implementar
> quantas interfaces forem necessárias — interfaces são a ferramenta para combinar múltiplos
> "papéis" em uma mesma classe.

### 3. Por que "programar contra a interface" (como no exercício `NotificarTodos`) é uma boa prática?

- [ ] Porque deixa o código mais lento, mas mais seguro
- [x] Porque permite que o código funcione com qualquer implementação futura da interface, sem precisar ser alterado
- [ ] Porque interfaces são obrigatórias em todo método C#
- [ ] Não há vantagem real, é apenas estilo

> Uma função que recebe uma interface (como `IFormaGeometrica` ou `INotificavel`) em vez de uma
> classe concreta específica automaticamente funciona com qualquer classe nova que implemente
> aquela interface no futuro, sem precisar de nenhuma alteração — um princípio central de design
> orientado a objetos flexível.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Interfaces" na trilha de C# do CodePath. Contexto: o capítulo explica definição e
> implementação de interfaces, múltiplas interfaces por classe e IComparable. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
