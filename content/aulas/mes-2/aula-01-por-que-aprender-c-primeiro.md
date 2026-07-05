---
id: "m2-a1"
mes: 2
numero: 1
titulo: "Por que aprender C primeiro"
objetivo: "Entender por que C é a linguagem ideal para aprender como a memória e o hardware realmente funcionam."
duracao: 20
status: "completo"
---

## De "como o computador funciona" para "como escrever código"

O mês 1 inteiro foi sobre entender a máquina por dentro: binário, portas lógicas, CPU, memória,
sistema operacional. Chegou a hora de começar a **escrever código de verdade** — e vamos começar por
C, não por acaso.

Você pode estar pensando: "ninguém usa C para criar sites ou apps hoje em dia, por que começar por
ela?" A resposta é que C não foi escolhida por ser popular no mercado (embora ainda seja muito usada
em sistemas operacionais, bancos de dados e software embarcado) — foi escolhida porque ela **não
esconde nada de você**. Diferente de Python ou JavaScript, que gerenciam memória automaticamente nos
bastidores, em C **você** decide onde e como a memória é usada. Isso é exatamente o motivo de C
existir neste curso: ela transforma tudo o que você aprendeu no mês 1 (memória, endereços, bytes) em
algo que você manipula diretamente com código.

## Um pouco de história

C foi criada em 1972 por Dennis Ritchie, nos laboratórios Bell, com um propósito bem específico:
reescrever o sistema operacional Unix (que até então era escrito diretamente em assembly, a
linguagem mais próxima possível do binário) em algo mais legível para humanos, mas ainda rápido o
suficiente para rodar um sistema operacional inteiro.

Essa origem explica muita coisa: C foi desenhada para dar ao programador controle quase total sobre
a máquina, com o mínimo de "mágica" escondida por trás. E o impacto de C foi gigantesco — praticamente
todas as linguagens populares hoje (Python, JavaScript, Java, Go, Rust, C++) foram, em algum grau,
influenciadas por sua sintaxe, ou literalmente **implementadas usando C** por baixo dos panos. Quando
você roda um programa em Python, por exemplo, é o interpretador do Python — escrito majoritariamente
em C — que está, no fundo, executando seu código.

## Linguagens de alto nível vs. baixo nível

Linguagens de programação existem em um espectro, do mais **baixo nível** (mais próximo do que a
CPU entende diretamente) ao mais **alto nível** (mais próximo de como humanos pensam e escrevem):

```text
Assembly  ────────  C  ────────  Java / Go  ────────  Python / JavaScript
(baixo nível)                                              (alto nível)
```

- **Baixo nível** (assembly): instruções quase idênticas ao que a CPU executa de verdade (Aula 4 do
  mês 1). Extremamente rápido e controlável, mas tedioso e fácil de errar — cada detalhe de memória
  precisa ser gerenciado manualmente, instrução por instrução.
- **Alto nível** (Python, JavaScript): você escreve algo como `lista.append(item)` sem nunca pensar
  em endereços de memória, alocação ou liberação — a linguagem cuida disso por trás dos panos
  (usando um mecanismo chamado *garbage collector*, que veremos com mais detalhe na Aula 4 deste
  mês). Muito mais produtivo para escrever aplicações rapidamente, mas você perde visibilidade sobre
  o que realmente acontece com a memória.
- **C fica no meio**: você escreve funções, estruturas e lógica de forma legível (bem mais alto
  nível que assembly), mas **você mesmo** decide quando alocar e liberar memória, e pode manipular
  endereços diretamente através de ponteiros (Aula 3). É essa posição intermediária que faz de C uma
  ferramenta de aprendizado tão poderosa: você escreve código de verdade, mas nada da máquina fica
  escondido de você.

## Compilado, não interpretado (uma prévia)

C é uma linguagem **compilada**: antes de rodar, todo o seu código-fonte é traduzido de uma vez,
por um programa chamado **compilador**, diretamente para instruções binárias que a CPU entende
nativamente (o mesmo binário que vimos na Aula 2 do mês 1!). O resultado é um arquivo executável que
roda diretamente, sem tradução adicional.

Python e JavaScript, por outro lado, são **interpretados**: um programa (o interpretador) lê seu
código e o executa "traduzindo sobre a hora", linha por linha, toda vez que o programa roda. Isso é
mais lento, mas mais flexível entre diferentes tipos de computador. Vamos nos aprofundar em como o
compilador funciona, passo a passo, na Aula 6 deste mês.

## Preparando o ambiente: gcc

Para compilar programas em C, vamos usar o **gcc** (*GNU Compiler Collection*), um dos compiladores
de C mais usados no mundo. Se você estiver no Linux, ele provavelmente já vem instalado, ou pode ser
instalado com:

```bash
sudo apt install build-essential
```

No macOS, instale as ferramentas de linha de comando do Xcode:

```bash
xcode-select --install
```

No Windows, a forma mais tranquila é usar o **WSL** (Windows Subsystem for Linux), que te dá um
ambiente Linux completo dentro do Windows, e então instalar o gcc como no Linux acima.

## Seu primeiro programa em C

Todo programa em C precisa de uma função especial chamada `main` — é por ela que a execução sempre
começa (o sistema operacional, ao carregar seu programa, chama exatamente essa função primeiro,
retomando o que vimos na Aula 1 do mês 1 sobre carregar um programa na memória). Veja o clássico
"Hello, World!":

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

Vamos por partes:

- `#include <stdio.h>`: pede ao compilador para incluir a **biblioteca padrão de entrada e saída**
  (*standard input/output*), que contém a função `printf`, usada para imprimir texto na tela.
- `int main() { ... }`: declara a função principal do programa. O `int` antes do nome indica que essa
  função devolve um número inteiro ao terminar (usado como código de saída — veremos mais sobre isso
  no mês 4, ao falar de processos).
- `printf("Hello, World!\n");`: imprime o texto na tela. O `\n` no final é um caractere especial que
  representa uma quebra de linha.
- `return 0;`: encerra a função `main`, devolvendo `0` — por convenção em C (e na maioria dos
  sistemas), `0` significa "o programa terminou sem erros".

Para compilar e rodar, salve esse código em um arquivo chamado `hello.c` e execute:

```bash
gcc hello.c -o hello
./hello
```

O primeiro comando (`gcc hello.c -o hello`) compila o arquivo `hello.c` e gera um executável chamado
`hello` (a opção `-o` define o nome do arquivo de saída). O segundo comando (`./hello`) executa esse
programa — o `./` na frente indica "executar o arquivo que está na pasta atual", usando exatamente o
conceito de caminho relativo que vimos na Aula 6 do mês 1.

## Exercício 1: Compile e modifique

Copie o programa "Hello, World!" acima para um arquivo `hello.c`, compile e rode com `gcc` no seu
terminal. Depois, modifique o programa para que ele imprima seu próprio nome em vez de "Hello,
World!".

### Solução

Supondo que seu nome seja "Ana", o programa modificado ficaria assim:

```c
#include <stdio.h>

int main() {
    printf("Ola, Ana!\n");
    return 0;
}
```

Compilando e rodando:

```bash
gcc hello.c -o hello
./hello
```

A saída esperada no terminal seria:

```text
Ola, Ana!
```

Se você recebeu algum erro do `gcc` ao compilar, confira se: (1) o arquivo tem a extensão `.c`; (2)
toda linha de comando dentro de `main` termina com ponto e vírgula `;`; (3) as chaves `{` e `}` estão
balanceadas corretamente.

## Exercício 2: Alto nível ou baixo nível?

Explique, com suas próprias palavras, por que dizemos que C está "no meio" do espectro entre
linguagens de alto e baixo nível, usando como exemplo a diferença entre escrever
`lista.append(item)` em Python e gerenciar memória manualmente em C (o que veremos em detalhe já na
próxima aula).

### Solução

Em Python, `lista.append(item)` é uma linha de altíssimo nível: você não precisa pensar em onde,
fisicamente, na memória, esse novo item vai ser armazenado, nem se há espaço suficiente alocado para
ele — o interpretador Python (que, aliás, é escrito em C por baixo dos panos) cuida de tudo isso
automaticamente, alocando mais memória se necessário e liberando memória não utilizada através do
garbage collector.

Em C, não existe essa "mágica" automática: se você quiser uma lista que cresce dinamicamente, você
mesmo precisa pedir explicitamente mais memória ao sistema operacional (usando `malloc`, que veremos
na Aula 5) quando o espaço atual não for suficiente, e é sua responsabilidade liberar essa memória
quando não precisar mais dela.

Isso mostra por que C fica "no meio" do espectro: você ainda escreve código estruturado, legível,
com funções e variáveis nomeadas (bem mais alto nível que escrever instruções de assembly uma a
uma), mas você tem controle e responsabilidade direta sobre a memória — algo que linguagens de mais
alto nível escondem de você por completo.

## Exercício 3: Encontre o erro

O programa abaixo tem dois erros que impedem a compilação. Identifique-os e corrija:

```c
#include <stdio.h>

int main() {
    printf("Aprendendo C!\n")
    return 0
}
```

### Solução

O programa tem dois erros de sintaxe: faltam pontos e vírgula `;` no final das linhas
`printf("Aprendendo C!\n")` e `return 0`. Em C, praticamente toda instrução dentro de uma função
precisa terminar com `;` — é assim que o compilador sabe onde uma instrução termina e a próxima
começa. A versão corrigida:

```c
#include <stdio.h>

int main() {
    printf("Aprendendo C!\n");
    return 0;
}
```

Esse é um dos erros mais comuns para quem está começando em C (e também em linguagens como Java e
C++, que herdaram essa mesma exigência de sintaxe) — vale sempre conferir os pontos e vírgulas
quando o compilador reclamar de um erro que parece não fazer sentido.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Por que aprender C primeiro" do meu curso de programação. Contexto: a aula
> explica por que C é uma linguagem de nível intermediário (nem tão baixo nível quanto assembly, nem
> tão alto nível quanto Python), compilada com gcc, e mostra a estrutura de um programa mínimo com
> `main`. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Quem criou a linguagem C, e com qual propósito original?

- [ ] Guido van Rossum, para ensinar programação a iniciantes
- [x] Dennis Ritchie, para reescrever o sistema operacional Unix de forma mais legível que assembly
- [ ] Um grupo de universidades, para criar a primeira linguagem de programação da história
- [ ] A Microsoft, para competir com o Java

> C foi criada por Dennis Ritchie em 1972, nos laboratórios Bell, com o objetivo de reescrever o
> Unix de forma mais legível e portável do que escrever diretamente em assembly.

### 2. Por que dizemos que C está "no meio" do espectro entre linguagens de alto e baixo nível?

- [ ] Porque ela é usada apenas por programadores intermediários, nunca iniciantes
- [x] Porque ela permite escrever código estruturado e legível, mas ainda exige controle manual explícito sobre a memória
- [ ] Porque o código em C precisa ser traduzido duas vezes para funcionar
- [ ] Porque C só funciona em computadores com processadores intermediários

> C oferece uma sintaxe estruturada (mais alto nível que assembly), mas exige que o programador
> gerencie memória manualmente (diferente de linguagens de mais alto nível, como Python, que fazem
> isso automaticamente).

### 3. O que significa dizer que C é uma linguagem "compilada"?

- [ ] Que o código é executado linha por linha, sendo traduzido durante a execução
- [x] Que todo o código-fonte é traduzido de uma vez, antes da execução, diretamente para instruções binárias que a CPU entende
- [ ] Que o código só roda dentro de um navegador
- [ ] Que C não pode ser usada para criar programas executáveis

> Em uma linguagem compilada, um programa (o compilador) traduz todo o código-fonte de uma vez para
> instruções binárias nativas, gerando um executável que roda diretamente, sem tradução adicional
> durante a execução.

### 4. Qual é a função de `#include <stdio.h>` em um programa C?

- [ ] Define o nome do programa
- [x] Inclui a biblioteca padrão de entrada e saída, que contém funções como printf
- [ ] Compila o programa automaticamente
- [ ] Cria uma nova variável chamada stdio

> `#include <stdio.h>` diz ao compilador para incluir a biblioteca padrão de entrada/saída, que
> disponibiliza funções como `printf` (usada para imprimir texto na tela).

### 5. O que o comando `gcc hello.c -o hello` faz?

- [ ] Executa o programa hello.c diretamente
- [ ] Apaga o arquivo hello.c
- [x] Compila o arquivo hello.c e gera um executável chamado hello
- [ ] Cria uma cópia de segurança do arquivo hello.c

> O gcc é o compilador que traduz o código-fonte (`hello.c`) para um executável binário. A opção
> `-o hello` define o nome do arquivo executável gerado como "hello".
