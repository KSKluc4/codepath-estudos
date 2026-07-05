---
id: "m1-a6"
mes: 1
numero: 6
titulo: "Terminal e Bash — conversando com o computador por texto"
objetivo: "Aprender a usar o terminal e comandos básicos de Bash para navegar e manipular arquivos sem interface gráfica."
duracao: 25
status: "completo"
---

## Duas formas de falar com o computador

Até aqui você conhece o computador por dentro, mas provavelmente só interagiu com ele através de uma
**interface gráfica** (GUI — *Graphical User Interface*): janelas, ícones, botões, cliques. É como
pedir um café apontando para uma foto no cardápio.

Existe uma outra forma de conversar com o computador, mais direta: **digitando comandos de texto**
para ele executar. É como falar diretamente com o garçom, em vez de apontar para fotos. Essa
interface se chama **CLI** (*Command Line Interface* — interface de linha de comando), e o programa
que interpreta o que você digita e traduz em ações reais do sistema operacional se chama **shell**.

Programadores usam o terminal o tempo todo — não porque seja "mais difícil" por esporte, mas porque
é frequentemente **mais rápido, mais preciso e mais fácil de automatizar** do que clicar em uma
sequência de menus. Esta aula é sua primeira conversa de verdade com essa interface.

## O que é um shell

Um **shell** é um programa que funciona como intérprete: ele lê o texto que você digita, entende o
que você quer fazer, e pede ao sistema operacional para executar essa ação — seja listar arquivos,
criar uma pasta, ou rodar um programa. Existem vários shells diferentes (sh, zsh, fish), mas o mais
usado no mundo Linux/Unix — e o que vamos aprender aqui — se chama **Bash** (*Bourne Again SHell*).

Quando você abre um terminal, o shell mostra um **prompt**, algo como:

```bash
usuario@computador:~$
```

Esse prompt normalmente mostra quem você é (`usuario`), em qual máquina (`computador`), e em qual
pasta você está (`~`, que é um atalho para a sua pasta pessoal/home). O `$` no final indica que o
shell está esperando você digitar um comando.

## Anatomia de um comando

Um comando em Bash geralmente segue este formato:

```bash
comando [opções] [argumentos]
```

- **comando**: o nome do programa que você quer executar (por exemplo, `ls`).
- **opções** (ou *flags*): modificam o comportamento do comando, geralmente começando com `-` ou
  `--` (por exemplo, `-l` para "formato longo").
- **argumentos**: o que o comando deve processar (por exemplo, o nome de uma pasta).

Por exemplo:

```bash
ls -l /home/usuario
```

Aqui, `ls` é o comando (listar arquivos), `-l` é a opção (formato detalhado, "long"), e
`/home/usuario` é o argumento (qual pasta listar).

## Caminhos absolutos vs. relativos

Antes dos comandos, precisamos entender como o Bash localiza arquivos e pastas. Existem dois tipos
de **caminho** (path):

- **Caminho absoluto**: começa a partir da raiz do sistema de arquivos, representada por `/`. Ele
  funciona não importa em qual pasta você esteja no momento. Exemplo: `/home/usuario/documentos`.
- **Caminho relativo**: começa a partir da pasta em que você está agora (o *diretório atual*).
  Exemplo: se você já está em `/home/usuario`, pode simplesmente digitar `documentos` para se referir
  à mesma pasta.

Dois atalhos especiais aparecem o tempo todo:

- `.` significa "a pasta atual".
- `..` significa "a pasta um nível acima" (a pasta-mãe).
- `~` significa "minha pasta pessoal" (home), um atalho para algo como `/home/usuario`.

Pense em caminho absoluto como um endereço completo de correio ("Rua X, número Y, cidade Z, país
W") — funciona de qualquer lugar do mundo. Um caminho relativo é mais como "duas casas à direita da
minha" — só faz sentido se eu já souber onde "eu" estou.

## Comandos essenciais para navegar

```bash
pwd
```

`pwd` (*print working directory*) mostra o caminho completo da pasta em que você está agora. É como
perguntar "onde eu estou?".

```bash
ls
```

`ls` (*list*) mostra os arquivos e pastas dentro do diretório atual. Com a opção `-l` (formato
longo), mostra detalhes como tamanho e data de modificação; com `-a` (*all*), mostra também arquivos
"ocultos" (que começam com `.`):

```bash
ls -la
```

```bash
cd documentos
```

`cd` (*change directory*) muda o diretório atual — literalmente "anda" para outra pasta. Alguns usos
comuns:

```bash
cd ..          # sobe um nível (vai para a pasta-mãe)
cd ~           # vai direto para a pasta pessoal (home)
cd /           # vai para a raiz do sistema de arquivos
cd -           # volta para a última pasta em que você estava
```

## Comandos essenciais para manipular arquivos e pastas

```bash
mkdir projetos
```

`mkdir` (*make directory*) cria uma nova pasta.

```bash
touch notas.txt
```

`touch` cria um arquivo vazio (ou, se o arquivo já existir, apenas atualiza sua data de modificação).

```bash
cat notas.txt
```

`cat` (*concatenate*) mostra o conteúdo de um arquivo de texto diretamente no terminal.

```bash
cp notas.txt notas-backup.txt
```

`cp` (*copy*) copia um arquivo (ou, com a opção `-r`, uma pasta inteira, recursivamente).

```bash
mv notas.txt arquivo-antigo.txt
```

`mv` (*move*) move ou renomeia um arquivo ou pasta — em Bash, renomear é apenas "mover para o mesmo
lugar com outro nome".

```bash
rm arquivo-antigo.txt
```

`rm` (*remove*) apaga um arquivo. **Cuidado**: diferente da lixeira de uma interface gráfica, `rm`
no terminal normalmente apaga o arquivo direto, sem passar por lixeira. Para apagar uma pasta inteira
(com tudo dentro), usa-se `rm -r nome_da_pasta` — e aqui o cuidado deve ser redobrado, porque não há
"desfazer".

## Um passeio completo, do início ao fim

Juntando os comandos, veja uma sequência típica de uso:

```bash
pwd                       # confirma onde estou: /home/usuario
mkdir projeto-python       # cria uma pasta nova
cd projeto-python          # entra nela
touch main.py               # cria um arquivo vazio
echo "print('oi mundo')" > main.py   # escreve conteúdo dentro do arquivo
cat main.py                  # confere o conteúdo: print('oi mundo')
cd ..                        # volta para a pasta anterior
ls                            # confirma que "projeto-python" está lá
```

Repare no `echo "..." > main.py`: o `echo` imprime um texto, e o símbolo `>` **redireciona** essa
saída para dentro de um arquivo, em vez de mostrar na tela (e sobrescreve o conteúdo anterior do
arquivo, se houver). Esse é um gostinho de um recurso muito poderoso do shell — a capacidade de
conectar a saída de um comando à entrada de outro — que vamos explorar com mais profundidade no mês
4, quando falarmos sobre processos e Linux na prática.

## Por que isso importa para programar

Terminal e Bash vão acompanhar você o curso inteiro: é assim que você vai compilar código em C (mês
2), rodar testes (mês 5), usar Git (também mês 5) e navegar servidores Linux remotos (mês 4). Mais
importante: comandos de terminal podem ser **salvos em arquivos de script** e executados
automaticamente, o que é a base de praticamente toda automação em desenvolvimento de software.

## Exercício 1: Traduza para comandos

Você está na sua pasta pessoal (`~`). Escreva a sequência de comandos Bash para: (a) criar uma pasta
chamada `estudos`; (b) entrar nela; (c) criar dentro dela um arquivo chamado `resumo.txt`; (d)
confirmar que o arquivo foi criado, listando o conteúdo da pasta.

### Solução

```bash
mkdir estudos
cd estudos
touch resumo.txt
ls
```

Passo a passo: `mkdir estudos` cria a pasta a partir da pasta atual (`~`). `cd estudos` muda o
diretório atual para dentro dela (usando um caminho relativo, já que "estudos" existe dentro da
pasta onde você está). `touch resumo.txt` cria o arquivo vazio dentro da pasta atual (que agora é
`estudos`). Por fim, `ls` lista o conteúdo da pasta atual, e deve mostrar `resumo.txt` na saída.

## Exercício 2: Absoluto ou relativo?

Classifique cada caminho abaixo como **absoluto** ou **relativo**: (a) `/var/www/site`, (b)
`documentos/fotos`, (c) `../projetos`, (d) `~/downloads`, (e) `./script.sh`.

### Solução

- **(a) `/var/www/site` → Absoluto.** Começa com `/`, ou seja, parte diretamente da raiz do sistema
  de arquivos, funcionando independente de onde você esteja.
- **(b) `documentos/fotos` → Relativo.** Não começa com `/`, `~` nem `..` — é interpretado a partir
  da pasta atual.
- **(c) `../projetos` → Relativo.** Começa com `..`, que representa a pasta um nível acima da pasta
  atual — depende de onde você está.
- **(d) `~/downloads` → Absoluto (na prática).** Tecnicamente começa com `~`, mas esse til é
  imediatamente expandido pelo shell para o caminho absoluto da sua pasta pessoal (por exemplo,
  `/home/usuario/downloads`), então na prática ele se comporta como um caminho absoluto.
- **(e) `./script.sh` → Relativo.** O `.` representa explicitamente a pasta atual — o caminho muda
  de significado dependendo de onde você está quando o executa.

## Exercício 3: Encontre o erro

Um colega quer apagar uma pasta chamada `temporarios` (com arquivos dentro) e digitou apenas
`rm temporarios`, mas recebeu uma mensagem de erro dizendo que não é possível remover um diretório
dessa forma. Explique o que está errado e corrija o comando.

### Solução

O comando `rm`, sozinho, é feito para remover **arquivos**, não pastas. Ao tentar usá-lo diretamente
em uma pasta, o Bash recusa a operação e mostra um erro (algo como "is a directory"), justamente para
evitar apagar acidentalmente uma estrutura inteira de arquivos sem intenção clara.

Para remover uma pasta e tudo o que existe dentro dela, é necessário usar a opção `-r` (de
*recursive* — a operação se aplica à pasta e recursivamente a tudo dentro dela):

```bash
rm -r temporarios
```

Vale reforçar o alerta da aula: esse comando não tem "desfazer" nem lixeira por padrão, então vale
sempre conferir com `ls temporarios` antes de rodar o `rm -r`, para ter certeza de que é exatamente
aquilo que você quer apagar.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Terminal e Bash — conversando com o computador por texto" do meu curso de
> programação. Contexto: a aula explica comandos básicos de Bash (pwd, ls, cd, mkdir, rm, cat) e a
> diferença entre caminhos absolutos e relativos. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].

## Quiz

### 1. O que é um shell?

- [ ] Um tipo de arquivo de configuração do sistema operacional
- [x] Um programa que interpreta comandos de texto digitados pelo usuário e os transforma em ações do sistema
- [ ] Um componente físico da placa-mãe
- [ ] Uma linguagem de programação usada exclusivamente para criar jogos

> O shell (como o Bash) é o programa responsável por interpretar os comandos que você digita no
> terminal e traduzi-los em ações reais do sistema operacional.

### 2. Qual comando mostra o caminho completo da pasta em que você está no momento?

- [ ] ls
- [x] pwd
- [ ] cd
- [ ] cat

> `pwd` (print working directory) exibe o caminho absoluto completo do diretório atual.

### 3. Qual das opções abaixo é um exemplo de caminho relativo?

- [ ] /home/usuario/fotos
- [x] ../documentos
- [ ] /etc/config
- [ ] /var/log

> `../documentos` depende de onde você está no momento (começa a partir da pasta atual, subindo um
> nível) — por isso é relativo. Os outros exemplos começam com `/`, ou seja, partem da raiz do
> sistema de arquivos e são absolutos.

### 4. O que o comando `rm -r pasta` faz?

- [ ] Renomeia a pasta
- [ ] Move a pasta para a lixeira, de onde pode ser recuperada
- [x] Remove a pasta e todo o seu conteúdo, permanentemente
- [ ] Cria uma cópia da pasta

> A opção `-r` (recursivo) faz o `rm` remover uma pasta inteira e tudo dentro dela. Diferente de uma
> lixeira de interface gráfica, essa remoção normalmente é permanente e não pode ser desfeita.

### 5. O que o símbolo `~` representa em um caminho no Bash?

- [ ] A raiz do sistema de arquivos
- [ ] A pasta atual
- [x] A pasta pessoal (home) do usuário
- [ ] Um arquivo temporário do sistema

> `~` é um atalho que o shell expande automaticamente para o caminho absoluto da pasta pessoal do
> usuário logado (por exemplo, `/home/usuario`).
