---
id: "m4-a7"
mes: 4
numero: 7
titulo: "Linux na prática"
objetivo: "Aplicar conhecimentos de sistema operacional usando Linux como ambiente principal de desenvolvimento."
duracao: 30
status: "completo"
---

## Colocando a teoria para rodar

Nas últimas aulas, estudamos processos, threads e como computadores se comunicam pela rede. Esta
aula é mais prática: vamos consolidar tudo isso mexendo diretamente no terminal Linux — o ambiente
onde a esmagadora maioria dos servidores do mundo roda, e onde você vai passar boa parte da sua vida
como programador profissional. Se você já usou o terminal no mês 1 para navegar entre pastas, esta
aula aprofunda esse conhecimento com foco em processos, permissões e composição de comandos.

## O sistema de arquivos como uma árvore

O Linux organiza todos os arquivos e pastas do sistema em uma única **árvore** (retomando a estrutura
de árvores do mês 3), começando na raiz `/`. Diferente do Windows, não existem "unidades" separadas
(`C:`, `D:`) — tudo, incluindo dispositivos externos, é "pendurado" em algum ponto dessa árvore
única.

| Comando | Função |
|---------|--------|
| `pwd` | Mostra o caminho da pasta atual |
| `ls -la` | Lista arquivos da pasta atual, incluindo ocultos, com detalhes |
| `cd caminho` | Muda para a pasta indicada |
| `mkdir nome` | Cria uma nova pasta |
| `cp origem destino` | Copia um arquivo |
| `mv origem destino` | Move ou renomeia um arquivo |
| `rm arquivo` | Remove um arquivo (sem passar pela lixeira!) |

## Permissões: quem pode fazer o quê

Todo arquivo e pasta no Linux carrega um conjunto de **permissões**, controlando quem pode ler,
escrever ou executar aquele item. Ao rodar `ls -la`, cada arquivo mostra uma sequência assim:

```text
-rwxr-xr--  1 lucas  staff  1024 Jul  5 10:00 script.sh
```

Os primeiros 10 caracteres codificam o tipo do item e as permissões, divididas em três grupos de três:

```text
-   rwx   r-x   r--
|    |     |     |
tipo  |     |     └── outros: apenas leitura (r--)
      |     └──────── grupo: leitura e execução (r-x)
      └────────────── dono: leitura, escrita e execução (rwx)
```

- **`r` (read)**: permissão de leitura.
- **`w` (write)**: permissão de escrita/modificação.
- **`x` (execute)**: permissão de execução (rodar como programa, ou entrar em uma pasta).

Essas permissões se aplicam a três categorias de usuário: o **dono** do arquivo, o **grupo** ao qual
ele pertence, e **outros** (todos os demais usuários do sistema).

Para alterar permissões, usa-se o comando `chmod`, geralmente com uma notação numérica onde cada
permissão vale um número (`r=4`, `w=2`, `x=1`), somados por categoria:

```bash
chmod 754 script.sh
# 7 (dono: 4+2+1=rwx) 5 (grupo: 4+1=r-x) 4 (outros: 4=r--)
```

## Processos no Linux, na prática

Retomando a aula 5, o Linux oferece ferramentas diretas para inspecionar e controlar processos:

```bash
ps aux              # lista todos os processos rodando agora, com PID, %CPU, %memória
top                 # painel interativo, atualizado em tempo real
kill 4521           # envia um sinal de término (SIGTERM) ao processo de PID 4521
kill -9 4521        # força o encerramento imediato (SIGKILL), sem chance de o processo se limpar
```

A diferença entre `kill` e `kill -9` é importante: o `kill` simples pede educadamente para o processo
encerrar (o próprio processo pode capturar esse sinal e fechar arquivos, salvar estado, etc. antes de
sair); já `kill -9` derruba o processo imediatamente, sem chance de ele fazer qualquer limpeza — deve
ser usado como último recurso, quando o processo não responde ao pedido educado.

## Redirecionamento e pipes: compondo comandos pequenos

Uma filosofia central do Unix/Linux é ter **muitos comandos pequenos**, cada um fazendo bem uma coisa
só, e combiná-los para tarefas mais complexas — o mesmo princípio de composição que você já usa ao
combinar funções pequenas em vez de escrever uma função gigante que faz tudo. Duas ferramentas tornam
essa composição possível:

- **Redirecionamento** (`>`, `>>`, `<`): direciona a entrada ou saída de um comando de/para um
  arquivo, em vez do terminal.
- **Pipe** (`|`): conecta a **saída** de um comando diretamente como **entrada** do próximo comando.

```bash
ps aux > processos.txt          # salva a saída de "ps aux" em um arquivo, em vez de mostrar na tela
ps aux | grep python             # filtra a saída de "ps aux", mostrando só linhas com "python"
ps aux | grep python | wc -l     # conta quantas linhas contêm "python"
```

Nesse último exemplo, três comandos simples (`ps`, `grep`, `wc`) são encadeados para responder a uma
pergunta específica ("quantos processos Python estão rodando?"), sem que nenhum dos três precise
saber da existência dos outros — cada um só lê de sua entrada padrão e escreve em sua saída padrão, e
o pipe conecta essas pontas.

## Exercício 1: Leia as permissões

Um arquivo mostra a seguinte saída em `ls -la`:

```text
-rw-r--r--  1 ana  staff  512 Jul  5 09:00 dados.csv
```

Explique, em português, exatamente o que o dono, o grupo e outros usuários podem fazer com esse
arquivo.

### Solução

O **dono** (`ana`) pode **ler e escrever** (`rw-`) no arquivo, mas não executá-lo. O **grupo**
(`staff`) pode apenas **ler** (`r--`) o arquivo, sem modificar nem executar. **Outros** usuários do
sistema também podem apenas **ler** (`r--`) o arquivo. Ninguém tem permissão de execução (`x`) sobre
esse arquivo — o que faz sentido, já que é um arquivo de dados (`.csv`), não um programa ou script.

## Exercício 2: Calcule o chmod

Você quer que o dono de um script tenha permissão total (ler, escrever, executar), o grupo tenha
apenas permissão de leitura e execução, e outros usuários não tenham nenhuma permissão. Qual comando
`chmod` numérico realiza essa configuração?

### Solução

O comando é `chmod 750 script.sh`. Calculando cada grupo: **dono** = ler(4) + escrever(2) +
executar(1) = **7**; **grupo** = ler(4) + executar(1), sem escrever = **5**; **outros** = nenhuma
permissão = **0**. Juntando os três dígitos na ordem dono-grupo-outros, obtemos `750`.

## Exercício 3: Componha um pipeline

Usando `ps aux`, `grep` e `wc -l`, escreva um único comando (encadeado com pipes) que conte quantos
processos do usuário `root` estão rodando no momento. Explique o papel de cada comando na cadeia.

### Solução

```bash
ps aux | grep '^root' | wc -l
```

- **`ps aux`** lista todos os processos do sistema, com o nome do usuário dono na primeira coluna.
- **`grep '^root'`** filtra, dentre todas essas linhas, apenas as que **começam** (`^`) com `root` —
  ou seja, processos cujo dono é o usuário `root`.
- **`wc -l`** conta quantas linhas sobraram depois do filtro, dando o total de processos de `root`.

Cada comando faz uma única coisa bem feita, e o pipe (`|`) encadeia a saída de um como entrada do
próximo, sem que nenhum precise saber como os outros funcionam por dentro.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Linux na prática" do meu curso de programação. Contexto: a aula explica o sistema
> de arquivos em árvore, permissões (`rwx` para dono/grupo/outros, `chmod`), comandos para gerenciar
> processos (`ps`, `top`, `kill`), e composição de comandos com redirecionamento e pipes. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Como o Linux organiza o sistema de arquivos?

- [ ] Em unidades separadas, como `C:` e `D:`
- [x] Em uma única árvore, começando na raiz `/`
- [ ] Sem nenhuma estrutura hierárquica
- [ ] Cada usuário tem uma árvore de arquivos completamente separada

> Diferente do Windows, o Linux organiza tudo — incluindo dispositivos externos — em uma única árvore
> hierárquica, com a raiz `/` no topo.

### 2. Na saída `-rwxr-xr--`, o que o segundo grupo de três caracteres (`r-x`) representa?

- [ ] As permissões do dono do arquivo
- [x] As permissões do grupo ao qual o arquivo pertence
- [ ] As permissões de todos os usuários do sistema (outros)
- [ ] O tipo do arquivo

> A notação de permissões é dividida em três blocos de três caracteres: dono, grupo e outros, nessa
> ordem. O segundo bloco corresponde ao grupo.

### 3. Qual é a diferença entre `kill` e `kill -9` sobre um processo?

- [ ] Não há diferença, ambos fazem exatamente a mesma coisa
- [x] `kill` pede educadamente o encerramento (o processo pode se limpar antes de sair); `kill -9` força o encerramento imediato, sem chance de limpeza
- [ ] `kill -9` é mais lento que `kill`
- [ ] `kill` só funciona em processos do usuário root

> `kill` envia um sinal que o processo pode capturar e tratar antes de encerrar; `kill -9` (SIGKILL)
> derruba o processo imediatamente, sem possibilidade de ele executar qualquer rotina de limpeza.

### 4. O que o operador pipe (`|`) faz ao conectar dois comandos?

- [ ] Executa os dois comandos em paralelo, sem relação entre eles
- [x] Direciona a saída do primeiro comando para ser a entrada do segundo comando
- [ ] Salva a saída do primeiro comando em um arquivo
- [ ] Executa o segundo comando apenas se o primeiro falhar

> O pipe conecta a saída padrão de um comando diretamente à entrada padrão do próximo, permitindo
> encadear comandos simples para resolver tarefas mais complexas.

### 5. No comando `chmod 750 arquivo`, o que o número `5` representa?

- [ ] As permissões do dono do arquivo
- [x] As permissões do grupo: leitura e execução, sem escrita
- [ ] As permissões de outros usuários
- [ ] O tamanho do arquivo em blocos

> Os três dígitos do `chmod` numérico representam, em ordem, dono, grupo e outros. `5` corresponde a
> `4 (ler) + 1 (executar) = 5`, ou seja, leitura e execução, sem permissão de escrita.
