---
id: "m4-a6"
mes: 4
numero: 6
titulo: "Threads e concorrência"
objetivo: "Entender threads como unidades de execução dentro de um processo e os desafios da concorrência."
duracao: 30
status: "completo"
---

## Um processo, vários fluxos de execução

Na aula passada vimos que cada processo tem seu próprio espaço de memória isolado, e que o sistema
operacional alterna rapidamente entre processos para dar a impressão de que tudo roda "ao mesmo
tempo". Mas às vezes você quer que **partes de um mesmo programa** rodem simultaneamente — por
exemplo, um editor de texto que precisa continuar respondendo a cliques do mouse enquanto salva um
arquivo grande em segundo plano, sem travar a interface. Criar um **processo inteiro** novo para isso
seria caro (memória duplicada, isolamento total). É para esse problema que existem as **threads**.

## Threads: irmãs que compartilham a casa

Uma **thread** é uma unidade de execução **dentro** de um processo. Um processo pode ter uma ou várias
threads, e todas elas compartilham o **mesmo espaço de memória** do processo — variáveis globais,
dados alocados no heap — mas cada thread mantém sua própria pilha de execução (*stack*) e seu próprio
contador de instruções, podendo executar um trecho de código diferente ao mesmo tempo.

Uma boa analogia: se um processo é uma **casa**, as threads são os **moradores** dessa casa. Cada
morador (thread) pode estar fazendo uma tarefa diferente ao mesmo tempo (um cozinhando, outro
assistindo TV), mas todos compartilham os **mesmos cômodos e os mesmos objetos** da casa (a memória do
processo) — se um morador move a mesa de lugar, todos os outros veem a mesa no novo lugar. Processos
diferentes, por outro lado, seriam **casas separadas**: cada uma com seus próprios móveis, sem acesso
direto aos móveis da casa vizinha.

| | Processos | Threads |
|---|-----------|---------|
| Memória | Isolada entre processos | Compartilhada entre threads do mesmo processo |
| Custo de criação | Alto (cópia de memória, isolamento completo) | Baixo (reaproveita a memória do processo) |
| Comunicação | Precisa de mecanismos explícitos entre processos | Direta, através de variáveis compartilhadas |
| Falha de uma unidade | Não afeta outros processos | Pode corromper o processo inteiro (memória compartilhada) |

## Concorrência vs. paralelismo

Dois termos que parecem sinônimos, mas têm significados técnicos distintos:

- **Concorrência**: várias tarefas **progridem** durante o mesmo período de tempo, mas não
  necessariamente no mesmo instante exato — elas podem se alternar rapidamente em um único núcleo de
  CPU (retomando o escalonamento da aula passada).
- **Paralelismo**: várias tarefas executam **literalmente ao mesmo tempo**, em núcleos de CPU
  diferentes, de verdade.

Todo paralelismo é concorrência, mas nem toda concorrência é paralelismo: um computador com um único
núcleo pode rodar múltiplas threads de forma concorrente (alternando rapidamente entre elas), sem
nenhum paralelismo real acontecendo. Já um computador com quatro núcleos pode, de fato, executar
quatro threads em paralelo, uma em cada núcleo, simultaneamente.

## O problema da memória compartilhada: race conditions

A vantagem de threads compartilharem memória (comunicação direta e barata) é também sua maior
armadilha: quando duas threads leem e escrevem a **mesma variável** ao mesmo tempo, sem nenhum
controle, o resultado final pode depender de uma ordem imprevisível de execução — um bug chamado
**condição de corrida** (*race condition*).

Considere um contador compartilhado, incrementado por duas threads, cada uma rodando este código:

```python
contador = 0

def incrementar():
    global contador
    contador = contador + 1   # parece uma operação só, mas não é!
```

A linha `contador = contador + 1` parece atômica (uma única operação indivisível), mas na verdade se
decompõe em três passos: **(1)** ler o valor atual de `contador`, **(2)** somar 1, **(3)** escrever o
resultado de volta em `contador`. Se duas threads executarem esses três passos **intercaladas**, algo
assim pode acontecer:

```text
Thread A lê contador (valor 0)
Thread B lê contador (valor 0)      <- ainda não viu a escrita de A, porque A não escreveu ainda
Thread A calcula 0 + 1 = 1
Thread A escreve contador = 1
Thread B calcula 0 + 1 = 1          <- usando o valor antigo que já leu
Thread B escreve contador = 1       <- devia ser 2!
```

Depois de duas execuções de "incrementar", o valor final de `contador` deveria ser `2` — mas, por
causa dessa intercalação exata, terminou sendo `1`. O resultado depende de uma **coincidência de
tempo** entre as duas threads, o que torna esse tipo de bug particularmente traiçoeiro: ele pode não
aparecer em 99% das execuções, e surgir só ocasionalmente, dependendo de fatores como carga do
sistema — dificultando muito reproduzir e depurar.

## Mutex: um cadeado para a seção crítica

O trecho de código que acessa um recurso compartilhado de forma insegura (como `contador = contador +
1`) é chamado de **seção crítica**. A ferramenta mais comum para protegê-la é o **mutex** (*mutual
exclusion*, exclusão mútua) — um "cadeado" que garante que **apenas uma thread por vez** execute
aquele trecho, forçando as demais a esperar a vez.

```python
import threading

contador = 0
lock = threading.Lock()

def incrementar():
    global contador
    with lock:              # adquire o cadeado; outras threads esperam aqui
        contador = contador + 1   # seção crítica: só uma thread por vez executa isso
    # cadeado liberado automaticamente ao sair do "with"
```

Com o `lock`, mesmo que as duas threads tentem incrementar `contador` ao mesmo tempo, apenas uma
consegue "segurar o cadeado" por vez — a outra fica esperando até o cadeado ser liberado, garantindo
que a leitura, o cálculo e a escrita aconteçam como um bloco indivisível, sem intercalação. O preço
dessa segurança é que threads competindo pelo mesmo mutex não podem mais rodar aquele trecho em
paralelo — elas precisam se revezar.

## Exercício 1: Identifique a seção crítica

No código abaixo, duas threads chamam `sacar(valor)` ao mesmo tempo sobre a mesma conta bancária,
sem nenhum mutex. Identifique qual linha é a seção crítica que precisa de proteção, e explique o
cenário de bug que pode ocorrer.

```python
saldo = 100

def sacar(valor):
    global saldo
    if valor <= saldo:
        saldo = saldo - valor
```

### Solução

A seção crítica é o bloco `if valor <= saldo: saldo = saldo - valor` inteiro — a verificação e a
atualização do saldo precisam acontecer como uma unidade indivisível. O bug possível: imagine
`saldo = 100`, e duas threads chamando `sacar(80)` "ao mesmo tempo". Ambas podem **ler** `saldo = 100`
antes que qualquer uma tenha escrito o novo valor, e ambas passam na verificação `80 <= 100`. Cada
uma, então, calcula `saldo = 100 - 80 = 20` e escreve esse valor — o resultado final é `saldo = 20`,
como se apenas um saque de 80 tivesse ocorrido, quando na verdade **dois saques de 80** (totalizando
160, mais do que o saldo original) foram autorizados indevidamente. Um mutex ao redor de todo o bloco
`if`/atualização evitaria que a segunda thread lesse o saldo antes da primeira terminar de escrevê-lo.

## Exercício 2: Concorrência sem paralelismo

Um computador com um único núcleo de CPU está rodando duas threads. Elas conseguem ter uma condição
de corrida como a do contador visto na aula, mesmo sem nenhum paralelismo real acontecendo (já que
só existe um núcleo)? Explique.

### Solução

**Sim.** Condições de corrida dependem de **concorrência** (a alternância entre threads), não de
**paralelismo** real. Mesmo em um único núcleo, o sistema operacional pode pausar a Thread A no meio
da execução de `contador = contador + 1` (por exemplo, exatamente depois de ler o valor mas antes de
escrever de volta) e dar a vez para a Thread B, que executa seu próprio incremento completo antes da
Thread A ser retomada. Essa intercalação — mesmo sem duas threads literalmente executando no mesmo
instante em núcleos diferentes — já é suficiente para reproduzir exatamente o cenário de bug descrito
na aula.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Threads e concorrência" do meu curso de programação. Contexto: a aula explica a
> diferença entre threads (memória compartilhada) e processos (memória isolada), concorrência vs.
> paralelismo, condições de corrida (race conditions) e como um mutex protege uma seção crítica. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Qual é a principal diferença entre uma thread e um processo?

- [ ] Threads são mais lentas de criar do que processos
- [x] Threads do mesmo processo compartilham o mesmo espaço de memória; processos diferentes têm memória isolada
- [ ] Um processo só pode ter uma thread
- [ ] Não há diferença real entre os dois termos

> Threads dentro de um mesmo processo compartilham memória (variáveis globais, heap), enquanto cada
> processo tem seu próprio espaço de memória isolado dos demais.

### 2. Qual é a diferença entre concorrência e paralelismo?

- [ ] São sinônimos exatos
- [x] Concorrência é várias tarefas progredindo no mesmo período (podendo se alternar em um núcleo); paralelismo é execução literalmente simultânea em núcleos diferentes
- [ ] Paralelismo só existe em software, concorrência só em hardware
- [ ] Concorrência exige múltiplos núcleos; paralelismo não

> Concorrência não exige execução simultânea real — apenas que as tarefas progridam durante o mesmo
> período, possivelmente alternando-se. Paralelismo exige núcleos distintos executando ao mesmo tempo.

### 3. O que é uma condição de corrida (race condition)?

- [ ] Um erro de sintaxe comum em código concorrente
- [x] Um bug onde o resultado final depende da ordem exata e imprevisível em que threads acessam dados compartilhados
- [ ] Uma thread que trava e nunca termina
- [ ] Um tipo de otimização de desempenho

> Uma condição de corrida ocorre quando o resultado de um programa depende de uma intercalação
> específica e não determinística entre threads acessando o mesmo dado compartilhado.

### 4. Qual é a função de um mutex?

- [ ] Acelerar a execução de threads em paralelo
- [x] Garantir que apenas uma thread por vez execute uma seção crítica, evitando condições de corrida
- [ ] Criar novas threads automaticamente
- [ ] Dividir a memória entre processos diferentes

> Um mutex funciona como um cadeado: apenas a thread que o adquire pode executar a seção crítica,
> forçando as demais a esperar sua vez, e assim evitando intercalações inseguras.

### 5. Por que uma condição de corrida pode acontecer mesmo em uma CPU com um único núcleo?

- [ ] Isso é impossível, race conditions exigem múltiplos núcleos
- [x] Porque o sistema operacional pode pausar uma thread no meio de uma operação e retomar outra, criando uma intercalação insegura mesmo sem execução simultânea real
- [ ] Porque um único núcleo não pode executar mais de uma thread
- [ ] Porque mutexes não funcionam em CPUs de núcleo único

> Condições de corrida dependem de concorrência (alternância), não de paralelismo real — mesmo um
> único núcleo alternando entre threads no meio de operações não-atômicas pode reproduzir o bug.
