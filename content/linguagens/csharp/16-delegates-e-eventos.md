---
numero: 16
titulo: "Delegates e eventos"
nivel: "avancado"
objetivo: "Tratar funções como valores com delegates, e reagir a eventos em C#."
duracao: 15
status: "completo"
---

## Conceito

Um `delegate` é um tipo que representa a **assinatura** de um método: permite guardar uma
referência a um método em uma variável, passá-lo como argumento, e chamá-lo depois — o equivalente
C# a tratar funções como valores (como em JavaScript). **Eventos** são construídos sobre delegates:
um padrão especial para "publicar" que algo aconteceu e permitir que múltiplas partes do código se
inscrevam para reagir, sem acoplamento direto entre quem dispara e quem escuta.

## Sintaxe

```csharp
delegate int Operacao(int a, int b);

int Somar(int a, int b) => a + b;

Operacao op = Somar;
Console.WriteLine(op(2, 3)); // 5, chama Somar através do delegate
```

## Exemplos comentados

```csharp
// Delegate customizado
delegate int Operacao(int a, int b);

int Somar(int a, int b) => a + b;
int Multiplicar(int a, int b) => a * b;

Operacao op = Somar;
Console.WriteLine(op(2, 3)); // 5

op = Multiplicar; // o mesmo delegate pode apontar para outro método compatível
Console.WriteLine(op(2, 3)); // 6

// Delegates genéricos embutidos: Func, Action e Predicate evitam declarar delegates próprios
Func<int, int, int> somarFunc = (a, b) => a + b;        // Func<parametros..., retorno>
Action<string> imprimir = mensagem => Console.WriteLine(mensagem); // Action: sem retorno
Predicate<int> ehPar = n => n % 2 == 0;                     // Predicate<T>: retorna bool

Console.WriteLine(somarFunc(2, 3)); // 5
imprimir("Olá!");
Console.WriteLine(ehPar(4)); // true

// Passar métodos como parâmetro (equivalente a callbacks de JavaScript)
List<int> numeros = new List<int> { 1, 2, 3, 4, 5 };
List<int> pares = numeros.FindAll(ehPar); // FindAll aceita um Predicate<T>

// Eventos: construídos sobre delegates, seguem o padrão publish/subscribe
class BotaoClicavel {
    public event Action AoClicar; // evento sem parâmetros

    public void Clicar() {
        AoClicar?.Invoke(); // ?. evita erro se ninguém "se inscreveu" ainda
    }
}

BotaoClicavel botao = new BotaoClicavel();
botao.AoClicar += () => Console.WriteLine("Primeiro handler");   // += "assina" o evento
botao.AoClicar += () => Console.WriteLine("Segundo handler");     // vários handlers possíveis
botao.Clicar(); // dispara AMBOS os handlers, na ordem em que foram adicionados
```

## Exercício 1: Use Func para passar comportamento

Escreva um método `List<int> Transformar(List<int> lista, Func<int, int> operacao)` que aplica
`operacao` a cada item da lista e retorna uma nova lista com os resultados.

### Solução

```csharp
List<int> Transformar(List<int> lista, Func<int, int> operacao) {
    List<int> resultado = new List<int>();
    foreach (int item in lista) {
        resultado.Add(operacao(item));
    }
    return resultado;
}

List<int> numeros = new List<int> { 1, 2, 3, 4 };
List<int> dobrados = Transformar(numeros, n => n * 2);
Console.WriteLine(string.Join(", ", dobrados)); // 2, 4, 6, 8
```

`Func<int, int>` representa qualquer função que recebe um `int` e retorna um `int` — passar
`n => n * 2` (uma expressão lambda) como argumento é equivalente a passar uma função como valor em
JavaScript ou Python; `Transformar` não precisa saber de antemão qual operação será aplicada.

## Exercício 2: Implemente um evento simples

Crie uma classe `Termometro` com um evento `event Action<double> TemperaturaAlterada`, e um método
`DefinirTemperatura(double valor)` que dispara o evento sempre que chamado.

### Solução

```csharp
class Termometro {
    public event Action<double> TemperaturaAlterada;

    public void DefinirTemperatura(double valor) {
        TemperaturaAlterada?.Invoke(valor);
    }
}

Termometro termometro = new Termometro();
termometro.TemperaturaAlterada += (temp) => Console.WriteLine($"Nova temperatura: {temp}°C");
termometro.TemperaturaAlterada += (temp) => {
    if (temp > 38) Console.WriteLine("Alerta: febre!");
};

termometro.DefinirTemperatura(37.5); // Nova temperatura: 37.5°C
termometro.DefinirTemperatura(39.0); // Nova temperatura: 39°C \n Alerta: febre!
```

`Action<double>` é um delegate que representa um método recebendo um `double` e sem retorno,
usado como tipo do evento. Cada `+=` inscreve um novo handler independente — quando
`DefinirTemperatura` chama `TemperaturaAlterada?.Invoke(valor)`, TODOS os handlers inscritos são
executados na ordem em que foram adicionados.

## Quiz

### 1. O que um `delegate` representa em C#?

- [ ] Um tipo de coleção
- [x] Um tipo que representa a assinatura de um método, permitindo tratá-lo como um valor
- [ ] Uma classe abstrata especial
- [ ] Um sinônimo de "interface"

> Um delegate define "a forma" de um método (parâmetros e retorno) que pode ser atribuído a uma
> variável, passado como argumento, e invocado posteriormente — a base do C# para tratar
> comportamento (não apenas dados) como um valor de primeira classe.

### 2. Qual a diferença entre `Func<T, TResultado>` e `Action<T>`?

- [ ] São idênticos
- [x] `Func` representa um método que RETORNA um valor; `Action` representa um método que não retorna nada (void)
- [ ] `Action` só aceita um parâmetro
- [ ] `Func` só funciona com números

> `Func<parametros..., TResultado>` é um delegate genérico embutido para métodos com retorno (o
> último parâmetro de tipo é sempre o tipo do retorno). `Action<parametros...>` é o equivalente
> para métodos `void`, sem nenhum valor de retorno.

### 3. Por que usar `evento?.Invoke(...)` em vez de `evento.Invoke(...)` diretamente?

- [ ] Não há diferença nenhuma
- [x] Evita `NullReferenceException` caso ninguém tenha se inscrito no evento ainda (evento seria `null`)
- [ ] `?.Invoke` dispara o evento duas vezes
- [ ] É obrigatório apenas em eventos genéricos

> Um evento sem nenhum handler inscrito (`+=`) permanece `null` internamente. Chamar
> `evento.Invoke(...)` diretamente sobre um evento `null` lançaria `NullReferenceException`. O
> operador `?.` evita isso: se `evento` for `null`, a chamada inteira é ignorada silenciosamente.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Delegates e eventos" na trilha de C# do CodePath. Contexto: o capítulo explica
> delegates customizados, Func/Action/Predicate, e o padrão de eventos com event/Invoke. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
