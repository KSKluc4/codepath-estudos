---
id: "m4-a5"
mes: 4
numero: 5
titulo: "Processos"
objetivo: "Entender o que é um processo e como o sistema operacional gerencia múltiplos processos."
duracao: 25
status: "completo"
---

## Da rede para dentro da máquina, de novo

Nas últimas quatro aulas, vimos como computadores conversam entre si pela rede. Agora vamos virar o
olhar para **dentro** de um único computador de novo — mas com uma pergunta diferente da que fizemos
no mês 1: como o sistema operacional consegue rodar o navegador, o editor de código, a música e o
antivírus **ao mesmo tempo**, mesmo que o computador tenha só alguns núcleos de CPU? A resposta
começa com o conceito de **processo**.

## Programa vs. processo

É fácil confundir esses dois termos, mas a diferença é importante:

- Um **programa** é um arquivo estático parado no disco — instruções binárias esperando para serem
  executadas, como o arquivo `chrome.exe` ou `python3` no seu disco.
- Um **processo** é esse programa **em execução**: uma instância viva, com memória própria alocada,
  variáveis com valores atuais, e uma posição específica de qual instrução está rodando agora.

A relação entre os dois é parecida com a relação entre uma **receita de bolo** (o programa, estático,
uma lista de instruções) e o **ato de fazer o bolo** (o processo, acontecendo agora, com ingredientes
específicos medidos, em um ponto específico do preparo). Você pode abrir o mesmo programa (a mesma
receita) várias vezes, criando **vários processos independentes** ao mesmo tempo — é exatamente o
que acontece quando você abre duas janelas separadas do mesmo navegador: dois processos distintos,
rodando o mesmo programa, cada um com sua própria memória e seu próprio estado, isolados um do outro.

## O que compõe um processo

Cada processo que o sistema operacional gerencia carrega consigo um conjunto de informações,
guardadas em uma estrutura chamada **PCB** (*Process Control Block*):

- **PID** (*Process ID*): um número único que identifica aquele processo entre todos os que estão
  rodando no momento.
- **Espaço de memória próprio**: cada processo enxerga seu próprio espaço de endereços de memória
  (retomando o mês 2), isolado dos demais — um processo não pode, por padrão, ler ou escrever
  diretamente na memória de outro processo.
- **Estado atual**: se está rodando, esperando, ou pronto para rodar (veja a próxima seção).
- **Contador de programa**: qual instrução exata o processo deve executar em seguida, caso ele seja
  pausado e retomado depois.
- **Arquivos abertos, prioridade, dono (usuário) do processo**, entre outras informações de
  contabilidade.

Esse isolamento de memória entre processos é uma decisão de design deliberada: se um processo travar
ou tiver um bug (por exemplo, escrever em um endereço de memória inválido, como vimos com ponteiros
soltos no mês 2), esse erro fica **contido** dentro daquele processo, sem derrubar o restante do
sistema. É por isso que uma aba do navegador pode travar sem derrubar as outras abas nem o resto do
computador.

## Estados de um processo

Em um dado momento, um processo pode estar em um de alguns estados principais:

```text
   novo → pronto ⇄ executando → terminado
                ↑        ↓
                └── esperando
```

- **Pronto** (*ready*): o processo tem tudo que precisa para rodar, só está esperando sua vez de usar
  a CPU.
- **Executando** (*running*): o processo está, neste exato instante, usando a CPU.
- **Esperando** (*waiting*/*blocked*): o processo está parado esperando por algo externo — um dado
  chegando pela rede, a leitura de um arquivo do disco, entrada do teclado — e não pode prosseguir
  até isso acontecer, mesmo que a CPU estivesse livre para ele.
- **Terminado**: o processo concluiu sua execução (ou foi encerrado) e está sendo removido pelo
  sistema operacional.

O detalhe importante aqui: com um número limitado de núcleos de CPU (frequentemente bem menor do que
o número de processos "prontos" competindo por atenção), o sistema operacional precisa **alternar**
rapidamente qual processo está executando a cada instante, num mecanismo chamado **escalonamento**
(*scheduling*). Essa troca acontece tão rápido (dezenas ou centenas de vezes por segundo) que, para o
usuário, tudo parece rodar "ao mesmo tempo" — mesmo que, em um dado instante exato, a CPU esteja de
fato executando apenas um processo por núcleo disponível.

## Criando processos: fork e exec

Em sistemas Unix/Linux, um processo cria outro através da chamada de sistema `fork()`, que faz uma
**cópia** do processo atual — o novo processo (chamado **filho**) começa como um clone quase idêntico
do processo original (o **pai**), inclusive continuando a execução exatamente do ponto seguinte à
chamada `fork()`. Um exemplo em C:

```c
#include <stdio.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();

    if (pid == 0) {
        printf("Sou o processo filho, meu PID é %d\n", getpid());
    } else {
        printf("Sou o processo pai, o PID do meu filho é %d\n", pid);
    }
    return 0;
}
```

O valor de retorno de `fork()` é o que diferencia quem é quem: no processo **filho**, `fork()` retorna
`0`; no processo **pai**, `fork()` retorna o PID do filho recém-criado. É esse valor de retorno
diferente — mesmo com o código sendo idêntico para ambos — que permite ao programa decidir qual
caminho cada processo deve seguir depois da cópia.

Frequentemente, o processo filho não quer continuar rodando uma cópia do programa pai — ele quer
rodar um **programa diferente**. É aí que entra a chamada `exec()`, que substitui completamente o
código e a memória do processo atual por um novo programa (sem criar um processo novo). É exatamente
esse par **fork + exec** que o shell usa toda vez que você digita um comando no terminal: o shell dá
um `fork()` de si mesmo, e o processo filho resultante dá um `exec()` para se transformar no programa
que você pediu (por exemplo, `ls`).

## Inspecionando processos no terminal

Em sistemas Unix/Linux, dois comandos essenciais para observar processos em execução:

```bash
ps aux          # lista uma "foto" de todos os processos rodando agora
top             # mostra os processos em tempo real, atualizando periodicamente
```

Uma linha típica de saída do `ps aux` mostra colunas como o usuário dono do processo, o PID, o
percentual de CPU e memória em uso, e o comando que originou aquele processo — informações que vêm
diretamente do PCB mantido pelo sistema operacional para cada processo.

## Exercício 1: Programa vs. processo

Você abre três janelas do mesmo editor de texto ao mesmo tempo. Quantos **programas** estão
envolvidos, e quantos **processos**? Explique a diferença nesse cenário.

### Solução

Há **um programa** (o arquivo executável do editor de texto, parado no disco) e **três processos**
(cada janela é uma instância independente daquele programa em execução, com sua própria memória e
seu próprio PID). Se uma das janelas travar, isso não afeta necessariamente as outras duas, justamente
porque cada processo tem seu espaço de memória isolado dos demais.

## Exercício 2: Identifique o estado

Um processo está esperando o usuário digitar algo no teclado. Nesse momento, mesmo que a CPU esteja
completamente livre, ele não pode ser escolhido para executar. Qual estado esse processo está, e por
quê ele não vai diretamente para "executando" assim que a CPU fica livre?

### Solução

O processo está no estado **esperando** (*waiting*/*blocked*). Mesmo com a CPU livre, o sistema
operacional não pode colocá-lo para executar, porque ele depende de um evento externo (a entrada do
teclado) que ainda não aconteceu — executá-lo não adiantaria nada, já que ele não tem o dado de que
precisa para continuar. Somente quando o evento esperado ocorrer (o usuário digitar algo) o processo
muda para o estado **pronto**, tornando-se elegível para ser escalonado para "executando" na próxima
oportunidade.

## Exercício 3: fork() na prática

No trecho de código C da aula, se o programa for executado e o `fork()` for bem-sucedido, quantas
linhas serão impressas no total, e por quê?

```c
pid_t pid = fork();
if (pid == 0) {
    printf("Sou o processo filho, meu PID é %d\n", getpid());
} else {
    printf("Sou o processo pai, o PID do meu filho é %d\n", pid);
}
```

### Solução

Serão impressas **duas linhas** no total — uma pelo processo pai, e outra pelo processo filho. Isso
acontece porque, depois do `fork()`, existem **dois processos** executando o restante do código
independentemente: no processo filho, `pid == 0` é verdadeiro, então ele executa o primeiro `printf`;
no processo pai, `pid` contém o PID real do filho (um valor diferente de `0`), então ele executa o
`printf` do bloco `else`. Cada processo executa apenas um dos dois blocos, mas como ambos os
processos existem e rodam esse mesmo trecho de código a partir do ponto do `fork()`, o resultado final
são as duas mensagens impressas (em uma ordem que pode variar, já que os dois processos rodam de
forma independente).

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Processos" do meu curso de programação. Contexto: a aula explica a diferença entre
> programa e processo, os estados de um processo (pronto, executando, esperando, terminado), e como
> `fork()`/`exec()` criam novos processos em sistemas Unix/Linux. Minha dúvida/meu exercício: [descreva
> aqui exatamente onde travou].

## Quiz

### 1. Qual é a principal diferença entre um programa e um processo?

- [ ] Não há diferença, os termos são sinônimos
- [x] Um programa é um arquivo estático no disco; um processo é uma instância desse programa em execução, com memória própria
- [ ] Um processo só pode rodar uma vez; um programa pode rodar várias vezes
- [ ] Processos só existem em sistemas Linux

> Um programa é código parado no disco; um processo é esse código em execução, com seu próprio
> espaço de memória, estado e contador de instruções.

### 2. Por que cada processo tem seu próprio espaço de memória isolado dos demais?

- [ ] Para economizar espaço em disco
- [x] Para que um erro ou travamento em um processo não afete diretamente outros processos rodando no sistema
- [ ] Porque a CPU só consegue acessar um endereço de memória por vez
- [ ] Isso não é verdade, todos os processos compartilham a mesma memória

> O isolamento de memória contém falhas dentro do processo onde ocorreram — se um processo travar por
> um erro de memória, os demais processos e o sistema como um todo continuam funcionando normalmente.

### 3. Um processo esperando a leitura de um arquivo do disco terminar está em qual estado?

- [ ] Executando
- [ ] Pronto
- [x] Esperando (blocked)
- [ ] Terminado

> Como o processo depende de um evento externo (a leitura do disco) para prosseguir, ele fica no
> estado de espera até esse evento se completar, mesmo que a CPU esteja disponível.

### 4. O que a chamada de sistema `fork()` faz?

- [ ] Substitui o processo atual por um programa completamente diferente
- [x] Cria uma cópia do processo atual, dando origem a um novo processo filho
- [ ] Encerra o processo atual imediatamente
- [ ] Aloca mais memória para o processo atual

> `fork()` duplica o processo atual, criando um processo filho quase idêntico ao pai, que continua a
> execução a partir do ponto seguinte à chamada.

### 5. No mecanismo de escalonamento, por que processos parecem rodar "ao mesmo tempo" mesmo em uma CPU com poucos núcleos?

- [ ] Porque cada processo usa uma CPU virtual dedicada
- [x] Porque o sistema operacional alterna rapidamente qual processo usa a CPU, dezenas ou centenas de vezes por segundo
- [ ] Porque processos modernos não precisam mais de CPU
- [ ] Isso é uma ilusão de ótica sem explicação técnica

> A troca rápida entre processos prontos para execução (escalonamento) cria a impressão de execução
> simultânea, mesmo que, em um instante exato, cada núcleo da CPU execute apenas um processo por vez.
