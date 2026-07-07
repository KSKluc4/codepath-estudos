---
numero: 14
titulo: "Async/await e Task"
nivel: "avancado"
objetivo: "Escrever código assíncrono em C# com async/await e o tipo Task."
duracao: 15
status: "completo"
---

## Conceito

Assim como em JavaScript, C# usa `async`/`await` para escrever código assíncrono de forma linear.
A diferença central de nomenclatura: onde JavaScript usa `Promise`, C# usa `Task` (ou `Task<T>`
quando a operação produz um resultado). Um método `async` retorna uma `Task`, e `await` "pausa" a
execução até essa `Task` terminar, sem bloquear a thread principal.

## Sintaxe

```csharp
async Task<string> BuscarDadosAsync() {
    await Task.Delay(1000); // simula uma operação demorada
    return "Dados carregados";
}

string resultado = await BuscarDadosAsync();
```

## Exemplos comentados

```csharp
using System.Threading.Tasks;

// Task (sem resultado) vs. Task<T> (com resultado) — parecido com Promise<void> vs Promise<T>
async Task ProcessarAsync() {
    await Task.Delay(1000);
    Console.WriteLine("Processamento concluído");
}

async Task<int> CalcularAsync(int numero) {
    await Task.Delay(500); // simula trabalho assíncrono
    return numero * 2;
}

async Task Principal() {
    int resultado = await CalcularAsync(21);
    Console.WriteLine(resultado); // 42
}

// Tratamento de erros: try/catch funciona normalmente com await
async Task<string> BuscarComTratamento() {
    try {
        var resposta = await Task.Run(() => {
            throw new Exception("Falha simulada");
        });
        return "sucesso";
    } catch (Exception erro) {
        return $"Erro: {erro.Message}";
    }
}

// Múltiplas tarefas em sequência (uma espera a outra terminar)
async Task EmSequencia() {
    int r1 = await CalcularAsync(1); // espera terminar...
    int r2 = await CalcularAsync(2); // ...antes de começar essa
}

// Múltiplas tarefas em PARALELO com Task.WhenAll (equivalente a Promise.all)
async Task EmParalelo() {
    Task<int> tarefa1 = CalcularAsync(1);
    Task<int> tarefa2 = CalcularAsync(2);

    int[] resultados = await Task.WhenAll(tarefa1, tarefa2); // espera AMBAS, em paralelo
    Console.WriteLine(string.Join(", ", resultados));
}

// Em aplicações reais, Main também pode ser async (a partir do C# 7.1+)
// static async Task Main(string[] args) {
//     await Principal();
// }
```

## Exercício 1: Converta uma operação síncrona para assíncrona

Escreva um método assíncrono `Task<int> DobrarAsync(int numero)` que simula uma operação demorada
com `Task.Delay(500)` e retorna o dobro do número recebido.

### Solução

```csharp
using System.Threading.Tasks;

async Task<int> DobrarAsync(int numero) {
    await Task.Delay(500);
    return numero * 2;
}

async Task Executar() {
    int resultado = await DobrarAsync(21);
    Console.WriteLine(resultado); // 42
}
```

`Task.Delay(500)` simula uma espera assíncrona (como uma requisição de rede), sem bloquear a
thread — outras tarefas podem rodar enquanto essa espera acontece. `await` pausa apenas a execução
do método atual até a `Task` terminar, retornando o resultado diretamente como se fosse uma
chamada síncrona.

## Exercício 2: Execute tarefas em paralelo

Escreva uma função assíncrona que busca três valores em paralelo usando `Task.WhenAll`, reutilizando
`DobrarAsync` do exercício anterior para os números 1, 2 e 3.

### Solução

```csharp
using System.Threading.Tasks;

async Task<int> DobrarAsync(int numero) {
    await Task.Delay(500);
    return numero * 2;
}

async Task<int[]> DobrarTresAsync() {
    Task<int> t1 = DobrarAsync(1);
    Task<int> t2 = DobrarAsync(2);
    Task<int> t3 = DobrarAsync(3);

    return await Task.WhenAll(t1, t2, t3);
}

async Task Executar() {
    int[] resultados = await DobrarTresAsync();
    Console.WriteLine(string.Join(", ", resultados)); // 2, 4, 6
}
```

As três chamadas a `DobrarAsync` começam imediatamente (sem `await` em cada uma individualmente),
criando três `Task`s "em voo" ao mesmo tempo. `Task.WhenAll` espera todas terminarem e retorna um
array com os resultados, na mesma ordem das tasks passadas — o tempo total é próximo ao da mais
lenta, não a soma de todas.

## Quiz

### 1. Qual é o equivalente C# ao `Promise` de JavaScript?

- [ ] `Async`
- [x] `Task` (ou `Task<T>` quando produz um resultado)
- [ ] `Future`
- [ ] `Deferred`

> `Task` representa uma operação assíncrona em andamento (ou já concluída), assim como `Promise`
> em JavaScript. `Task<T>` é usado quando essa operação produz um resultado do tipo `T` ao terminar,
> equivalente a `Promise<T>`.

### 2. O que `await` faz dentro de um método `async`?

- [ ] Bloqueia toda a aplicação até a Task terminar
- [x] Pausa a execução daquele método até a Task terminar, sem bloquear a thread para outras operações
- [ ] Cancela a Task imediatamente
- [ ] Só pode ser usado uma vez por método

> `await` suspende a execução do método atual até que a `Task` aguardada complete, mas libera a
> thread para fazer outro trabalho nesse meio tempo — diferente de uma espera bloqueante
> (`Thread.Sleep`), que travaria a thread inteira sem fazer nada.

### 3. Por que `Task.WhenAll` costuma ser mais rápido que várias chamadas `await` em sequência?

- [ ] Não há diferença de desempenho
- [x] Porque inicia todas as tasks ao mesmo tempo, e o tempo total é próximo ao da mais lenta, não a soma de todas
- [ ] `Task.WhenAll` só funciona com no máximo duas tasks
- [ ] Chamadas em sequência sempre falham

> Cada `await tarefa();` em sequência espera aquela tarefa terminar completamente antes de iniciar
> a próxima. Iniciando todas as tasks primeiro (sem `await` individual) e só então usando
> `Task.WhenAll`, todas rodam concorrentemente, reduzindo o tempo total de espera quando as
> operações são independentes entre si.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Async/await e Task" na trilha de C# do CodePath. Contexto: o capítulo explica
> Task/Task<T>, async/await, tratamento de erros assíncronos e Task.WhenAll. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
