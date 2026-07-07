---
numero: 15
titulo: "Nullable types"
nivel: "avancado"
objetivo: "Trabalhar com valores nulos de forma segura usando nullable types e o operador ?."
duracao: 12
status: "completo"
---

## Conceito

Value types (`int`, `bool`, `double`, structs) normalmente **não podem ser `null`** em C# — um
`int` sempre tem algum valor numérico. `Nullable<T>` (com o atalho `T?`) permite que um value type
também aceite `null`, representando "ausência de valor" de forma explícita, como uma nota que
ainda não foi lançada. C# moderno também tem *nullable reference types*, um recurso do compilador
que ajuda a evitar `NullReferenceException` em reference types como `string`.

## Sintaxe

```csharp
int? idade = null;         // int? é atalho para Nullable<int>
idade = 28;

if (idade.HasValue) {
    Console.WriteLine(idade.Value);
}

int idadeOuZero = idade ?? 0; // operador de coalescência nula
```

## Exemplos comentados

```csharp
int? nota = null;

Console.WriteLine(nota.HasValue);  // false
// Console.WriteLine(nota.Value);  // lançaria InvalidOperationException, pois nota é null

nota = 85;
Console.WriteLine(nota.HasValue);  // true
Console.WriteLine(nota.Value);      // 85

// ?? (coalescência nula): usa um valor padrão se a expressão à esquerda for null
int? notaOpcional = null;
int notaFinal = notaOpcional ?? 0; // 0, já que notaOpcional é null

// ??= (atribuição condicional nula): atribui SÓ se a variável ainda for null
int? contador = null;
contador ??= 10; // contador vira 10, porque era null
contador ??= 20; // não faz nada, contador já não é null

// ?. (null-conditional / "elvis operator"): acessa um membro só se o objeto não for null
string nome = null;
int? tamanho = nome?.Length; // null, em vez de lançar NullReferenceException
Console.WriteLine(tamanho ?? 0); // 0

// Encadeando null-conditional com métodos
List<string> lista = null;
int quantidade = lista?.Count ?? 0; // 0, evita checar "if (lista != null)" manualmente

// Nullable reference types (a partir do C# 8, com <Nullable>enable</Nullable> no projeto):
// o compilador AVISA quando um "string" (não anulável por padrão nessa checagem) pode ser null
// string nome2 = null;  // aviso do compilador: possível atribuição de null
string? nomeOpcional = null; // "?" comunica explicitamente que null é esperado/permitido

// Verificação clássica ainda funciona e é equivalente
if (nome != null) {
    Console.WriteLine(nome.Length);
}
```

## Exercício 1: Trate uma nota opcional

Escreva código que, dado `int? nota = null;`, imprime `"Sem nota lançada"` se `nota` for `null`, ou
`"Nota: X"` caso contrário, usando `HasValue`.

### Solução

```csharp
int? nota = null;

if (nota.HasValue) {
    Console.WriteLine($"Nota: {nota.Value}");
} else {
    Console.WriteLine("Sem nota lançada");
}
```

`HasValue` retorna `true` apenas quando a variável nullable de fato contém um valor — tentar
acessar `.Value` diretamente sem essa checagem, quando a variável é `null`, lançaria
`InvalidOperationException` em tempo de execução.

## Exercício 2: Simplifique com operadores nullable

Reescreva o código abaixo usando `?.` e `??` para evitar as checagens explícitas de `null`:

```csharp
string ObterNomeExibicao(Usuario usuario) {
    if (usuario == null) {
        return "Anônimo";
    }
    if (usuario.Nome == null) {
        return "Anônimo";
    }
    return usuario.Nome;
}
```

### Solução

```csharp
string ObterNomeExibicao(Usuario usuario) {
    return usuario?.Nome ?? "Anônimo";
}
```

`usuario?.Nome` retorna `null` automaticamente se `usuario` for `null` (sem lançar exceção,
"curto-circuitando" o acesso), e `?? "Anônimo"` fornece o valor padrão quando o resultado final
(seja porque `usuario` ou `Nome` era `null`) acaba sendo `null` — as duas checagens do código
original são condensadas em uma única expressão.

## Quiz

### 1. Por que um `int` comum não pode ser `null` em C#, exigindo `int?` para isso?

- [ ] É uma limitação temporária que será corrigida em versões futuras
- [x] `int` é um value type, que sempre ocupa um espaço fixo de memória com algum valor numérico; `null` representaria "ausência de valor", incompatível com isso
- [ ] `int?` não existe em C#
- [ ] Apenas `string` pode ser `null`

> Value types como `int` armazenam o valor diretamente (não uma referência), sempre ocupando seu
> espaço de memória com algum número. `Nullable<T>` (o `T?`) resolve isso "envolvendo" o value
> type com um indicador extra de "tem valor ou não", permitindo representar ausência de valor de
> forma explícita e seguro.

### 2. O que `usuario?.Nome` faz se `usuario` for `null`?

- [ ] Lança `NullReferenceException`
- [x] Retorna `null` diretamente, sem tentar acessar `.Nome` e sem lançar exceção
- [ ] Retorna uma string vazia `""`
- [ ] É um erro de sintaxe

> O operador `?.` (null-conditional) verifica se o objeto à esquerda é `null` antes de tentar
> acessar o membro à direita — se for `null`, toda a expressão já retorna `null` imediatamente,
> sem lançar exceção, "curto-circuitando" a cadeia de acesso.

### 3. O que `valor ?? padrao` retorna?

- [ ] Sempre `padrao`, independente de `valor`
- [x] `valor`, se ele não for `null`; caso contrário, `padrao`
- [ ] `null`, sempre
- [ ] Um erro de compilação se `valor` puder ser `null`

> `??` (coalescência nula) é um atalho para "use este valor, a menos que seja `null`, aí use este
> outro" — equivalente a `valor != null ? valor : padrao`, mas mais conciso, muito usado para
> fornecer valores padrão em cadeias que envolvem nullable types ou reference types que podem ser
> `null`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Nullable types" na trilha de C# do CodePath. Contexto: o capítulo explica
> Nullable<T> (T?), HasValue/Value, e os operadores ?? (coalescência nula) e ?. (null-conditional).
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
