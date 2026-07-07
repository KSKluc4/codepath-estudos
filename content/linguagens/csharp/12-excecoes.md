---
numero: 12
titulo: "Exceções"
nivel: "intermediario"
objetivo: "Tratar erros com try/catch/finally e lançar exceções customizadas."
duracao: 12
status: "completo"
---

## Conceito

C# usa exceções para sinalizar erros em tempo de execução, com a sintaxe familiar `try`/`catch`/
`finally` (parecida com JavaScript, Java e Python). Toda exceção herda, direta ou indiretamente, da
classe `Exception`. Criar exceções customizadas — herdando de `Exception` — permite representar
erros específicos do seu domínio de forma mais clara do que reutilizar exceções genéricas.

## Sintaxe

```csharp
try {
    int resultado = 10 / int.Parse("0");
} catch (DivideByZeroException erro) {
    Console.WriteLine($"Erro: {erro.Message}");
} finally {
    Console.WriteLine("Isso sempre roda");
}
```

## Exemplos comentados

```csharp
// Capturando exceções específicas, da mais específica para a mais genérica
try {
    string entrada = "abc";
    int numero = int.Parse(entrada);
    int resultado = 10 / numero;
} catch (FormatException) {
    Console.WriteLine("Formato inválido");
} catch (DivideByZeroException) {
    Console.WriteLine("Divisão por zero");
} catch (Exception erro) {
    // captura QUALQUER outra exceção não tratada acima — deve vir por último
    Console.WriteLine($"Erro inesperado: {erro.Message}");
} finally {
    Console.WriteLine("Bloco finally sempre executa, com ou sem erro");
}

// Lançando exceções manualmente com throw
double Dividir(double a, double b) {
    if (b == 0) {
        throw new ArgumentException("O divisor não pode ser zero");
    }
    return a / b;
}

// Criando um tipo de exceção customizado
class SaldoInsuficienteException : Exception {
    public SaldoInsuficienteException(string mensagem) : base(mensagem) { }
}

class ContaBancaria {
    public double Saldo { get; private set; }

    public void Sacar(double valor) {
        if (valor > Saldo) {
            throw new SaldoInsuficienteException($"Tentou sacar {valor}, saldo é {Saldo}");
        }
        Saldo -= valor;
    }
}

try {
    ContaBancaria conta = new ContaBancaria();
    conta.Sacar(100);
} catch (SaldoInsuficienteException erro) {
    Console.WriteLine(erro.Message);
}

// using statement: garante que recursos (como arquivos) sejam liberados
// automaticamente, mesmo se ocorrer uma exceção (parecido com "with" do Python)
using (StreamReader arquivo = new StreamReader("dados.txt")) {
    string conteudo = arquivo.ReadToEnd();
} // arquivo.Dispose() é chamado automaticamente aqui
```

## Exercício 1: Trate uma divisão segura

Escreva uma função `double DividirSeguro(double a, double b)` que retorna o resultado de `a / b`,
ou `0` (imprimindo uma mensagem de erro) se `b` for zero, capturando `DivideByZeroException`.

### Solução

```csharp
double DividirSeguro(double a, double b) {
    try {
        if (b == 0) {
            throw new DivideByZeroException();
        }
        return a / b;
    } catch (DivideByZeroException) {
        Console.WriteLine("Erro: divisão por zero");
        return 0;
    }
}

Console.WriteLine(DividirSeguro(10, 2)); // 5
Console.WriteLine(DividirSeguro(10, 0)); // Erro: divisão por zero \n 0
```

Como a divisão de `double` por `0` em C# não lança automaticamente uma exceção (retorna
`Infinity`), o código lança `DivideByZeroException` manualmente com `throw` quando detecta o caso,
para poder tratá-lo de forma consistente com `catch`.

## Exercício 2: Crie e lance uma exceção customizada

Crie uma exceção `IdadeInvalidaException` e uma função `void ValidarIdade(int idade)` que a lança
com uma mensagem apropriada se `idade` for negativa ou maior que 120.

### Solução

```csharp
class IdadeInvalidaException : Exception {
    public IdadeInvalidaException(string mensagem) : base(mensagem) { }
}

void ValidarIdade(int idade) {
    if (idade < 0 || idade > 120) {
        throw new IdadeInvalidaException($"Idade inválida: {idade}");
    }
}

try {
    ValidarIdade(-5);
} catch (IdadeInvalidaException erro) {
    Console.WriteLine(erro.Message); // "Idade inválida: -5"
}
```

`IdadeInvalidaException` herda de `Exception` e usa `: base(mensagem)` para passar a mensagem de
erro ao construtor da classe pai, que já sabe expor essa mensagem através da propriedade
`.Message` — o mesmo padrão usado por qualquer exceção customizada em C#.

## Quiz

### 1. Quando o bloco `finally` é executado?

- [ ] Só quando ocorre uma exceção
- [ ] Só quando NÃO ocorre nenhuma exceção
- [x] Sempre, com ou sem exceção
- [ ] Nunca é executado automaticamente

> `finally` roda incondicionalmente, seja o `try` bem-sucedido ou não — o lugar ideal para
> "limpeza" garantida, como fechar uma conexão ou liberar um recurso, mesmo que o código dentro do
> `try` tenha lançado uma exceção.

### 2. Como se cria um tipo de exceção customizado em C#?

- [ ] Não é possível, só as exceções embutidas podem ser lançadas
- [x] Criando uma classe que herda de `Exception` (ou de uma subclasse dela)
- [ ] Usando a palavra-chave `custom`
- [ ] Definindo um método chamado `exception()`

> Qualquer classe que herde de `Exception` (direta ou indiretamente) pode ser lançada com `throw`.
> Isso permite criar hierarquias de erro específicas do domínio da aplicação, como
> `SaldoInsuficienteException` ou `IdadeInvalidaException`.

### 3. Para que serve o bloco `using (recurso) { ... }` em C#?

- [ ] Importa um namespace, como `using System;`
- [x] Garante que o método `Dispose()` do recurso seja chamado automaticamente ao final do bloco, mesmo em caso de exceção
- [ ] Só funciona com arquivos de texto
- [ ] Substitui completamente o try/catch

> Recursos que implementam `IDisposable` (como `StreamReader`, conexões de banco de dados, etc.)
> precisam ser liberados explicitamente. O bloco `using (recurso) { ... }` garante que
> `recurso.Dispose()` seja chamado automaticamente ao sair do bloco, mesmo se uma exceção for
> lançada dentro dele — parecido com o `with` do Python.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Exceções" na trilha de C# do CodePath. Contexto: o capítulo explica try/catch/
> finally, throw, exceções customizadas e o bloco using para liberar recursos. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
