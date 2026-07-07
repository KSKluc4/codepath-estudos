---
numero: 18
titulo: "Boas práticas e convenções"
nivel: "avancado"
objetivo: "Aplicar convenções de nomenclatura e boas práticas idiomáticas em C#."
duracao: 10
status: "completo"
---

## Conceito

C# tem convenções de nomenclatura bem estabelecidas e documentadas pela Microsoft, seguidas
consistentemente em toda a biblioteca padrão e na maioria dos projetos profissionais. Seguir essas
convenções (mesmo quando o compilador não obriga) deixa o código mais previsível para quem já
conhece o ecossistema .NET, e evita misturar estilos dentro do mesmo projeto.

## Sintaxe

```csharp
public class ContaBancaria {       // PascalCase para classes
    public string Titular { get; set; }  // PascalCase para propriedades e métodos públicos
    private double _saldo;                 // camelCase com _ para campos privados

    public void Depositar(double valor) {  // PascalCase para métodos
        // parâmetros e variáveis locais: camelCase
    }
}
```

## Exemplos comentados

```csharp
// PascalCase: classes, interfaces (com prefixo I), métodos, propriedades, enums, namespaces
public class Usuario { }
public interface IRepositorio { }
public enum StatusPedido { Pendente, Aprovado, Cancelado }
public void CalcularTotal() { }
public string Nome { get; set; }

// camelCase: parâmetros e variáveis locais
void Processar(int quantidadeItens) {
    int totalCalculado = quantidadeItens * 2;
}

// Campos privados: camelCase com underscore prefixado (convenção comum, não obrigatória)
public class Servico {
    private readonly ILogger _logger;
    private int _contador;
}

// Constantes: PascalCase (diferente de outras linguagens que usam MAIUSCULAS)
public const double TaxaJuros = 0.05;

// Nomes descritivos em vez de abreviações obscuras
// Ruim:
int qtd = 5;
void Calc(int x, int y) { }

// Melhor:
int quantidade = 5;
void CalcularTotal(int precoUnitario, int quantidade) { }

// Prefira propriedades auto-implementadas a campos públicos
// Ruim:
public class Pessoa { public string nome; } // campo público exposto diretamente

// Melhor:
public class Pessoa { public string Nome { get; set; } } // propriedade, permite evoluir a lógica depois

// Use var quando o tipo já é óbvio pelo contexto, tipo explícito quando não é
var lista = new List<Produto>();   // óbvio: List<Produto> já está na própria linha
double resultado = CalcularComplexo(); // tipo explícito ajuda a leitura quando o retorno não é óbvio

// Prefira LINQ/métodos de coleção a loops manuais quando deixar o código mais claro
// var pares = numeros.Where(n => n % 2 == 0).ToList(); // mais idiomático que um for com if+Add

// XML doc comments documentam a API pública para IntelliSense/ferramentas
/// <summary>Calcula o total de um pedido, incluindo impostos.</summary>
/// <param name="pedido">O pedido a ser calculado.</param>
/// <returns>O valor total com impostos aplicados.</returns>
public double CalcularTotal(Pedido pedido) { return 0; }
```

## Exercício 1: Corrija a nomenclatura

O código abaixo não segue as convenções idiomáticas de C#. Reescreva-o corrigindo os nomes.

```csharp
public class conta_bancaria {
    public string titular;
    public double Saldo_Atual;

    public void depositar_valor(double Valor) {
        Saldo_Atual += Valor;
    }
}
```

### Solução

```csharp
public class ContaBancaria {
    public string Titular { get; set; }
    public double SaldoAtual { get; private set; }

    public void Depositar(double valor) {
        SaldoAtual += valor;
    }
}
```

As correções seguem as convenções padrão: `ContaBancaria` (PascalCase, sem underscore, para
classe), `Titular` e `SaldoAtual` como propriedades PascalCase (em vez de campos públicos crus),
`Depositar` como método PascalCase (sem underscore, verbo direto em vez de
`depositar_valor`), e `valor` como parâmetro em camelCase.

## Exercício 2: Prefira LINQ a um loop manual

Reescreva o código abaixo (que filtra e transforma manualmente com um loop) usando LINQ, de forma
mais idiomática.

```csharp
List<int> resultado = new List<int>();
foreach (int n in numeros) {
    if (n > 10) {
        resultado.Add(n * 2);
    }
}
```

### Solução

```csharp
using System.Linq;

List<int> resultado = numeros
    .Where(n => n > 10)
    .Select(n => n * 2)
    .ToList();
```

A versão com LINQ expressa a mesma lógica de forma mais declarativa: "filtre os maiores que 10, e
dobre cada um" — sem precisar declarar uma lista vazia manualmente nem escrever a estrutura de
loop e `if`. Ambas as versões produzem o mesmo resultado, mas a versão LINQ costuma ser considerada
mais idiomática em C# moderno, para transformações desse tipo.

## Quiz

### 1. Qual convenção de nomenclatura C# usa para classes, métodos e propriedades públicas?

- [ ] snake_case
- [x] PascalCase (cada palavra começando com maiúscula, sem separador)
- [ ] camelCase
- [ ] kebab-case

> C# usa PascalCase consistentemente para classes (`ContaBancaria`), métodos (`Depositar`),
> propriedades (`SaldoAtual`) e namespaces — diferente de Python (que prefere snake_case para
> funções) ou JavaScript (que usa camelCase para funções e métodos).

### 2. Qual a convenção comum para nomear campos privados em C#?

- [ ] PascalCase, igual a propriedades públicas
- [x] camelCase com um underscore prefixado, como `_saldo`
- [ ] Todo em maiúsculas, como `SALDO`
- [ ] Não há convenção, qualquer nome serve

> Embora não seja imposta pelo compilador, a convenção amplamente adotada (inclusive nas
> diretrizes oficiais da Microsoft) é usar `_nomeDoCampo` para campos privados, o que os distingue
> visualmente de parâmetros e variáveis locais (camelCase sem underscore) e de propriedades
> públicas (PascalCase).

### 3. Por que preferir propriedades (`public string Nome { get; set; }`) a campos públicos (`public string nome;`)?

- [ ] Não há diferença prática nenhuma
- [x] Propriedades permitem adicionar lógica (como validação) no futuro sem quebrar o código que já usa `objeto.Nome`
- [ ] Campos públicos são mais rápidos em todos os casos
- [ ] Propriedades só podem ser usadas em classes abstratas

> Se uma classe expõe um campo público diretamente e depois precisa adicionar validação ou lógica
> ao definir aquele valor, seria necessário alterar a API pública (quebrando código existente que
> depende dela). Uma propriedade (mesmo auto-implementada no início) permite adicionar essa lógica
> depois sem alterar como a classe é usada externamente.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Boas práticas e convenções" na trilha de C# do CodePath. Contexto: o capítulo
> explica convenções de nomenclatura (PascalCase, camelCase), preferência por propriedades e uso
> idiomático de LINQ. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
