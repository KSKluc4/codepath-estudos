---
numero: 3
titulo: "Strings e interpolação"
nivel: "basico"
objetivo: "Manipular texto e interpolar valores com string interpolation ($)."
duracao: 10
status: "completo"
---

## Conceito

Strings em C# são imutáveis (como em Java, JavaScript e Python) e a forma moderna e recomendada de
combinar texto com valores é a **string interpolation**: prefixar a string com `$` e usar `{}`
para inserir expressões diretamente no texto — muito parecido com template literals de JavaScript
ou f-strings de Python.

## Sintaxe

```csharp
string nome = "Ana";
int idade = 28;

string mensagem = $"Olá, {nome}! Você tem {idade} anos.";
```

## Exemplos comentados

```csharp
string nome = "Bia";
double preco = 49.9;

// Concatenação tradicional (evitar em código novo)
string s1 = "Olá, " + nome + "!";

// String interpolation — forma recomendada
string s2 = $"Olá, {nome}!";

// Expressões dentro de {} podem ser qualquer coisa, não só variáveis
Console.WriteLine($"Preço com desconto: {preco * 0.9:F2}"); // :F2 formata com 2 casas decimais

// Métodos comuns de string
string texto = "  Programação em C#  ";
Console.WriteLine(texto.Trim());              // remove espaços das pontas
Console.WriteLine(texto.ToUpper());            // maiúsculas
Console.WriteLine(texto.ToLower());            // minúsculas
Console.WriteLine(texto.Contains("C#"));        // true
Console.WriteLine(texto.Replace("C#", "C sharp")); // substitui

// Split e Join
string csv = "a,b,c";
string[] partes = csv.Split(',');               // ["a", "b", "c"]
string junto = string.Join("-", partes);          // "a-b-c"

// Strings de múltiplas linhas com verbatim string (@) ou raw string (""")
string caminho = @"C:\Users\Ana\Documentos"; // @ evita precisar escapar \ com \\
string textoLongo = """
    Múltiplas
    linhas
    """; // raw string literal (C# 11+)

// Comparação de conteúdo: == já compara valor, não referência (diferente de Java!)
string a = "teste";
string b = "teste";
Console.WriteLine(a == b); // true
```

## Exercício 1: Monte um cartão de apresentação

Dadas as variáveis `string nome = "Bia";`, `string cargo = "Desenvolvedora";` e `int anos = 3;`, use
string interpolation para montar `"Bia é Desenvolvedora há 3 anos."`.

### Solução

```csharp
string nome = "Bia";
string cargo = "Desenvolvedora";
int anos = 3;

string apresentacao = $"{nome} é {cargo} há {anos} anos.";
Console.WriteLine(apresentacao); // "Bia é Desenvolvedora há 3 anos."
```

Cada `{}` dentro da string prefixada com `$` é substituído pelo valor da expressão correspondente,
convertida automaticamente para texto — sem precisar concatenar manualmente com `+`.

## Exercício 2: Formate um valor monetário

Escreva código que formata `double preco = 1234.5;` como `"R$ 1234.50"`, usando string
interpolation com formatação de casas decimais (`:F2`).

### Solução

```csharp
double preco = 1234.5;
string formatado = $"R$ {preco:F2}";
Console.WriteLine(formatado); // "R$ 1234.50"
```

O especificador de formato `:F2` dentro das chaves (`{preco:F2}`) formata o número com exatamente
2 casas decimais — C# tem vários especificadores de formato embutidos (`F` para ponto fixo, `C`
para moeda, `N` para separadores de milhar, entre outros) que podem ser combinados diretamente
dentro da interpolação.

## Quiz

### 1. O que o prefixo `$` faz antes de uma string literal em C#?

- [ ] Marca a string como somente leitura
- [x] Habilita string interpolation, permitindo inserir expressões entre `{}` diretamente no texto
- [ ] Converte a string para maiúsculas
- [ ] É obrigatório em toda string de C#

> `$"texto {expressao}"` é a sintaxe de string interpolation em C#: qualquer expressão dentro de
> `{}` é avaliada e seu resultado é convertido para texto e inserido naquele ponto — equivalente a
> `${}` em template literals JavaScript ou `{}` em f-strings Python.

### 2. Ao contrário de Java, o que `a == b` faz quando `a` e `b` são `string` em C#?

- [ ] Sempre retorna `false`, mesmo com conteúdo igual
- [x] Compara o CONTEÚDO das strings diretamente, não apenas a referência
- [ ] Só compara referência, exigindo `.Equals()` para conteúdo
- [ ] Lança uma exceção

> Diferente de Java (onde `==` em objetos compara referência por padrão), C# sobrecarrega `==`
> para `string` de forma que ele já compara o conteúdo textual — `"teste" == "teste"` retorna
> `true`, mesmo que sejam instâncias diferentes na memória.

### 3. O que `{preco:F2}` faz dentro de uma string interpolada?

- [ ] Converte `preco` para uma string vazia
- [x] Formata `preco` com exatamente 2 casas decimais
- [ ] Multiplica `preco` por 2
- [ ] É um erro de sintaxe

> O especificador de formato depois dos dois-pontos (`:F2`) controla como o valor é exibido como
> texto — `F2` significa "ponto fixo, 2 casas decimais". C# tem vários especificadores desse tipo
> para números, datas e moedas.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Strings e interpolação" na trilha de C# do CodePath. Contexto: o capítulo
> explica string interpolation ($), métodos comuns de string e especificadores de formato. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
