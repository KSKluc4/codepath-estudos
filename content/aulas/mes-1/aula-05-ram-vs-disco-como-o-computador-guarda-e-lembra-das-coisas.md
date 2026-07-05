---
id: "m1-a5"
mes: 1
numero: 5
titulo: "RAM vs Disco — como o computador guarda e lembra das coisas"
objetivo: "Entender a diferença entre memória volátil (RAM) e armazenamento permanente (disco/SSD), e por que essa diferença molda todo o design de software."
duracao: 20
status: "completo"
---

## Duas formas bem diferentes de "lembrar"

Na aula passada vimos que a CPU usa uma hierarquia de memória para equilibrar velocidade e
capacidade. Hoje vamos focar em duas camadas específicas dessa hierarquia — **RAM** e **disco** — e
entender por que elas são tecnologias fisicamente diferentes, não apenas "a mesma coisa, só que uma
mais rápida que a outra".

Pense em duas formas de guardar uma informação: escrever em um quadro branco com pincel apagável,
ou gravar em uma placa de metal. O quadro branco é rápido de escrever e apagar — perfeito para
anotações temporárias que mudam o tempo todo. Mas se você desligar a luz da sala (ou, no caso da
RAM, desligar a energia), o quadro continua lá, intacto — só que a RAM não funciona assim, ela é mais
parecida com uma anotação feita com giz numa lousa que é apagada automaticamente assim que a energia
acaba. Já a placa de metal gravada é permanente: sobrevive sem energia nenhuma, mas gravar algo nela
é um processo mais lento e trabalhoso.

## RAM: rápida, mas volátil

RAM significa *Random Access Memory* (memória de acesso aleatório — o nome vem do fato de que
qualquer posição pode ser acessada diretamente, em vez de precisar "passar" pelas posições
anteriores). Fisicamente, a RAM mais comum (chamada DRAM) guarda cada bit usando um pequeno
capacitor — um componente que armazena carga elétrica.

O problema é que esses capacitores **vazam** carga elétrica naturalmente, muito rápido. Para o dado
não se perder, o computador precisa "recarregar" cada capacitor milhares de vezes por segundo — um
processo chamado *refresh*. Esse é o motivo técnico exato por trás da palavra **volátil**: a RAM só
mantém os dados enquanto está recebendo energia constantemente e sendo "relembrada" ativamente. No
instante em que a energia acaba (o computador desliga ou trava), esse processo de recarga para, os
capacitores perdem a carga em frações de segundo, e **todo o conteúdo da RAM desaparece**.

Em troca dessa fragilidade, a RAM é extremamente rápida: acessar um dado nela leva algo como
dezenas de nanossegundos (bilionésimos de segundo), e a taxa de transferência pode passar de dezenas
de gigabytes por segundo.

## Disco: lento, mas permanente

Já o armazenamento em disco (HD ou SSD) é projetado para o oposto: **não depender de energia
constante** para manter os dados.

- **HD (disco rígido magnético)**: grava dados alterando a orientação magnética de partículas em um
  disco físico que gira, usando um braço mecânico com uma cabeça de leitura/escrita — parecido com
  um toca-discos de vinil. Magnetismo não "vaza" como carga elétrica, então os dados permanecem
  mesmo sem energia. Mas mover uma peça mecânica é lento: leituras podem levar vários milissegundos
  (milhares de vezes mais lento que a RAM).
- **SSD (unidade de estado sólido)**: não tem partes móveis. Grava dados prendendo elétrons em
  pequenas "células" de memória flash, de um jeito que persiste mesmo sem energia. É
  significativamente mais rápido que um HD (geralmente entre 10 e 50 vezes), mas ainda
  assim é ordens de magnitude mais lento que a RAM.

## Comparando os números

Uma forma de tornar essa diferença concreta: imagine que buscar um dado na RAM leva **1 segundo**
(numa escala imaginária, só para comparar proporções). Nessa mesma escala:

```text
Registrador da CPU  ......  menos de 1 segundo (quase instantâneo)
Cache da CPU  .............  poucos segundos
RAM  .......................  ~1 segundo (nossa referência)
SSD  .......................  ~15 minutos
HD  ........................  ~2 a 5 dias
```

Esses números são proporcionais aos tempos reais de acesso (na vida real medidos em nanossegundos e
milissegundos, não segundos). A ideia central: **cada camada que descemos na hierarquia de memória é
ordens de magnitude mais lenta que a anterior** — por isso o sistema operacional se esforça tanto
para manter na RAM tudo o que está em uso ativo, e só ir ao disco quando realmente necessário.

## Memória virtual: quando a RAM não é suficiente

O que acontece se você abrir tantos programas que eles, juntos, precisam de mais RAM do que o
computador tem fisicamente instalado? O sistema operacional usa uma técnica chamada **memória
virtual**: ele pega partes da RAM que não estão sendo usadas naquele momento e as copia
temporariamente para uma área reservada do disco (chamada de *swap*, no Linux, ou *arquivo de
paginação*, no Windows), liberando espaço na RAM real para o que está sendo usado agora. Quando o
programa precisa daquela parte de volta, o sistema a busca de novo no disco.

Isso é o que explica aquela sensação de computador "engasgando" quando você tem memória RAM
insuficiente para a quantidade de programas abertos: o sistema operacional está correndo para trocar
dados entre RAM e disco o tempo todo (um processo chamado *swapping* ou *paginação*), e como o disco
é ordens de magnitude mais lento que a RAM, tudo fica visivelmente mais lento.

## Por que "salvar" existe

Aqui fechamos um ciclo que começou lá na Aula 1: quando você está editando um documento, digitando um
texto ou jogando um jogo, todo o **estado em uso naquele momento** vive na RAM — porque a RAM é
rápida o suficiente para acompanhar o ritmo em que você trabalha. Mas a RAM é volátil. Se você
desligar o computador (ou ele travar, ou faltar energia) sem antes copiar esse estado para o disco,
tudo aquilo que só existia na RAM desaparece.

É exatamente isso que o botão "Salvar" faz: ele pega os dados que estão temporariamente na RAM e os
copia para o disco, de forma organizada, para que sobrevivam mesmo com o computador desligado. É por
isso que ferramentas modernas (editores de texto, IDEs) frequentemente têm "salvamento automático":
elas reduzem a janela de tempo em que seu trabalho existe *apenas* na RAM, arriscando ser perdido.

## Uma prévia rápida: onde os arquivos ficam guardados

Quando você salva um arquivo, o sistema operacional não apenas "joga os bytes em algum lugar do
disco" — ele usa um **sistema de arquivos** (file system), uma estrutura organizada que sabe
exatamente em quais posições físicas do disco cada arquivo está gravado, e mantém isso organizado em
pastas e nomes de arquivo legíveis para humanos. Sistemas de arquivos comuns incluem NTFS (Windows),
APFS (Mac) e ext4 (Linux). Vamos voltar a esse assunto com mais profundidade lá no mês 4, quando
falarmos de sistemas operacionais e Linux na prática.

## Exercício 1: Calculando tempos de leitura

Imagine que você precisa ler um arquivo de 1 GB. Considerando (de forma simplificada) as seguintes
velocidades médias de leitura sequencial — RAM: 10 GB/s, SSD: 2 GB/s, HD: 0,15 GB/s — calcule
aproximadamente quanto tempo levaria para ler esse arquivo inteiro de cada uma dessas fontes.

### Solução

O cálculo é simplesmente `tempo = tamanho ÷ velocidade`:

- **RAM**: `1 GB ÷ 10 GB/s = 0,1 segundos` (cerca de 100 milissegundos).
- **SSD**: `1 GB ÷ 2 GB/s = 0,5 segundos`.
- **HD**: `1 GB ÷ 0,15 GB/s ≈ 6,7 segundos`.

Repare que o HD levaria cerca de **67 vezes mais tempo** que a RAM para essa mesma tarefa, e o SSD
ficaria no meio do caminho — mais rápido que o HD, mas ainda bem mais lento que a RAM. Esses números
já explicam por que jogos e programas grandes carregam muito mais rápido quando instalados em um SSD
em vez de um HD.

## Exercício 2: Por que os dados da RAM somem?

Explique, usando o conceito de capacitores e o processo de *refresh*, por que desligar o computador
sem salvar faz você perder o que estava editando — mesmo que o restante dos seus arquivos salvos
continue lá depois de ligar de novo.

### Solução

A RAM (DRAM) guarda cada bit de informação usando um capacitor minúsculo, que armazena carga
elétrica para representar um `1` (carregado) ou um `0` (descarregado). Esses capacitores vazam carga
naturalmente, então o sistema precisa "recarregá-los" (fazer o *refresh*) milhares de vezes por
segundo para os dados não se perderem. Esse processo de recarga só acontece enquanto o componente
está recebendo energia elétrica constantemente.

Quando você desliga o computador (de propósito ou por falta de energia), o processo de refresh para
instantaneamente. Sem recarga, os capacitores perdem sua carga elétrica em frações de segundo, e o
conteúdo da RAM — incluindo qualquer edição que você não tinha salvado — desaparece completamente.

Já os arquivos que você salvou anteriormente estão gravados no disco (HD ou SSD), uma tecnologia que
não depende de energia constante para manter os dados: uma vez gravados magneticamente (HD) ou como
carga presa em células flash (SSD), eles permanecem lá até serem explicitamente apagados ou
sobrescritos — com ou sem energia.

## Exercício 3: Diagnosticando lentidão

Um amigo reclama que o computador dele "trava" e fica lento sempre que ele abre muitos programas ao
mesmo tempo, mesmo que cada programa individualmente seja leve. Usando o conceito de memória
virtual/swap visto nesta aula, explique o que provavelmente está acontecendo, e sugira (em termos
gerais) uma solução de hardware.

### Solução

O que provavelmente está acontecendo: a soma da RAM que todos os programas abertos precisam está
ultrapassando a quantidade de RAM física instalada no computador. Quando isso acontece, o sistema
operacional recorre à **memória virtual**: ele move partes da RAM que não estão em uso imediato para
uma área reservada do disco (swap/arquivo de paginação), liberando espaço para o que está sendo usado
agora. Sempre que um desses programas "pausados" precisa ser usado de novo, o sistema precisa buscar
aqueles dados de volta do disco — que é ordens de magnitude mais lento que a RAM.

Como o disco (principalmente um HD) é muito mais lento que a RAM, esse vaivém constante de dados
entre RAM e disco (chamado de *thrashing* quando é excessivo) faz o computador parecer travado,
mesmo que a CPU em si não esteja sobrecarregada.

Uma solução de hardware razoável: **aumentar a quantidade de RAM física instalada**, reduzindo a
necessidade do sistema operacional recorrer à memória virtual com tanta frequência. Trocar um HD por
um SSD também ajuda bastante, já que reduz o impacto de cada vez que o swap precisa ser acessado —
mas não resolve o problema na raiz, que é RAM insuficiente para a carga de trabalho.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "RAM vs Disco — como o computador guarda e lembra das coisas" do meu curso de
> programação. Contexto: a aula explica por que a RAM é volátil (capacitores que precisam de
> refresh) e o disco é permanente (magnetismo ou memória flash), e introduz memória virtual/swap.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Por que a RAM é chamada de memória "volátil"?

- [ ] Porque ela pode explodir se usada incorretamente
- [x] Porque ela perde todo o seu conteúdo quando a energia elétrica é interrompida
- [ ] Porque ela muda de tamanho automaticamente
- [ ] Porque só pode ser usada por alguns tipos de programa

> "Volátil" significa que a memória depende de energia elétrica constante para manter seus dados.
> Os capacitores da RAM perdem carga rapidamente sem o processo de refresh, que só acontece com
> energia constante.

### 2. Qual das opções abaixo NÃO depende de energia elétrica constante para manter os dados gravados?

- [ ] RAM (DRAM)
- [ ] Cache L1 da CPU
- [ ] Registradores da CPU
- [x] SSD (memória flash)

> SSDs armazenam dados como carga elétrica presa em células de memória flash, que permanece mesmo
> sem energia — diferente da RAM, cache e registradores, que são todos voláteis.

### 3. O que é "memória virtual" (swap/paginação)?

- [ ] Uma memória RAM que existe apenas na nuvem
- [x] Uma técnica em que o sistema operacional usa espaço em disco para simular RAM extra quando ela está cheia
- [ ] Um tipo de memória usada exclusivamente por jogos
- [ ] Um vírus que consome recursos do computador

> Memória virtual é a técnica de mover partes da RAM não usadas no momento para o disco, liberando
> espaço para o que está ativo — permitindo rodar mais programas do que a RAM física comportaria
> sozinha, ao custo de mais lentidão.

### 4. Por que salvar um arquivo é uma ação necessária, e não automática?

- [ ] Porque os arquivos são salvos automaticamente na nuvem sempre
- [x] Porque, até o momento de salvar, os dados em edição existem apenas na RAM (volátil), e salvar os copia para o disco (permanente)
- [ ] Porque os discos rígidos exigem confirmação manual do usuário para funcionar
- [ ] Porque isso é apenas uma tradição de design de software, sem motivo técnico

> Enquanto você edita algo, o estado existe na RAM (rápida, mas volátil). "Salvar" copia esse
> estado para o disco (mais lento, mas permanente), garantindo que ele sobreviva mesmo se a energia
> for interrompida.

### 5. Por que um SSD costuma ser mais rápido que um HD tradicional?

- [ ] Porque o SSD tem mais capacidade de armazenamento
- [ ] Porque o SSD é sempre mais barato
- [x] Porque o SSD não tem partes mecânicas móveis, ao contrário do HD, que depende de um disco giratório e um braço de leitura
- [ ] Porque o SSD usa a mesma tecnologia da RAM, sem diferença nenhuma

> HDs dependem de partes mecânicas físicas (disco girando, braço se movendo) para ler e escrever
> dados, o que impõe um limite de velocidade. SSDs usam memória flash eletrônica, sem partes móveis,
> o que os torna significativamente mais rápidos — embora ainda mais lentos que a RAM.
