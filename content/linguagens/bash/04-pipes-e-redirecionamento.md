---
numero: 4
titulo: "Pipes e redirecionamento"
nivel: "basico"
objetivo: "Encadear comandos com pipes e redirecionar entrada/saída."
duracao: 10
status: "completo"
---

## Conceito

Todo comando no terminal tem, por padrão, três "canais": entrada padrão (stdin), saída padrão
(stdout) e saída de erro (stderr). **Redirecionamento** (`>`, `>>`, `<`) muda para onde esses
canais apontam — por exemplo, gravando a saída em um arquivo em vez de exibi-la na tela. **Pipe**
(`|`) conecta a saída de um comando diretamente à entrada de outro, permitindo combinar comandos
simples em um pipeline poderoso.

## Sintaxe

```bash
comando > arquivo.txt     # grava a saída em um arquivo (sobrescreve)
comando >> arquivo.txt      # adiciona a saída ao final do arquivo
comando1 | comando2           # a saída de comando1 vira a entrada de comando2
```

## Exemplos comentados

```bash
# > redireciona stdout para um arquivo, SOBRESCREVENDO o conteúdo existente
ls -l > lista_arquivos.txt

# >> adiciona ao final do arquivo, SEM apagar o que já existia
echo "nova linha de log" >> app.log

# < redireciona a ENTRADA de um comando a partir de um arquivo
sort < nomes.txt   # ordena o conteúdo de nomes.txt

# 2> redireciona especificamente a saída de ERRO (stderr), separada de stdout
comando_que_pode_falhar 2> erros.log
comando 2>&1   # redireciona stderr para o mesmo destino de stdout

# | (pipe) conecta a saída de um comando à entrada de outro
ls -l | grep ".txt"           # lista arquivos, filtra só os que contêm ".txt"
cat arquivo.log | wc -l          # conta quantas linhas o arquivo tem
ps aux | grep node                 # lista processos, filtra os que mencionam "node"

# Encadeando vários pipes: cada comando processa a saída do anterior
cat vendas.csv | grep "2024" | wc -l
# 1. cat exibe o conteúdo do arquivo
# 2. grep filtra só as linhas com "2024"
# 3. wc -l conta quantas linhas sobraram

# sort e uniq combinados: uma dupla clássica para contar ocorrências únicas
cat acessos.log | sort | uniq -c | sort -rn
# sort: agrupa iguais lado a lado (uniq exige isso)
# uniq -c: conta ocorrências consecutivas iguais
# sort -rn: ordena numericamente, decrescente

# tee: grava a saída em um arquivo E também exibe na tela ao mesmo tempo
ls -l | tee lista.txt
```

## Exercício 1: Salve a saída de um comando em um arquivo

Escreva o comando que lista todos os arquivos do diretório atual (formato longo) e salva o
resultado em `inventario.txt`, sem exibir nada no terminal.

### Solução

```bash
ls -l > inventario.txt
```

`>` redireciona toda a saída padrão de `ls -l` para o arquivo `inventario.txt`, em vez de exibi-la
no terminal — se o arquivo já existir, seu conteúdo anterior é completamente sobrescrito.

## Exercício 2: Conte quantas linhas de um log contêm "ERROR"

Escreva um pipeline que lê o arquivo `app.log`, filtra apenas as linhas contendo `"ERROR"`, e
conta quantas linhas sobraram.

### Solução

```bash
cat app.log | grep "ERROR" | wc -l
```

Cada `|` conecta a saída de um comando à entrada do próximo: `cat` lê o arquivo, `grep "ERROR"`
mantém só as linhas que contêm esse termo, e `wc -l` conta o número de linhas restantes — o
resultado final é um único número. (Na prática, `grep "ERROR" app.log | wc -l` seria ainda mais
direto, já que `grep` pode ler o arquivo diretamente, sem precisar do `cat` antes — mas ambas as
formas funcionam.)

## Quiz

### 1. Qual a diferença entre `>` e `>>` ao redirecionar saída para um arquivo?

- [ ] Não há diferença
- [x] `>` sobrescreve o conteúdo do arquivo; `>>` adiciona ao final, preservando o que já existia
- [ ] `>>` só funciona com números
- [ ] `>` é mais rápido que `>>`

> `>` trunca o arquivo de destino (ou o cria, se não existir) e grava a nova saída do zero,
> apagando qualquer conteúdo anterior. `>>` (append) preserva o conteúdo existente e adiciona a
> nova saída ao final — o padrão usado para arquivos de log, por exemplo.

### 2. O que o operador `|` (pipe) faz entre dois comandos?

- [ ] Executa os dois comandos em paralelo, sem relação entre eles
- [x] Conecta a saída padrão do primeiro comando diretamente à entrada padrão do segundo
- [ ] Compara a saída dos dois comandos
- [ ] Só funciona com comandos que leem arquivos

> `comando1 | comando2` faz com que tudo que `comando1` imprimiria na tela seja, em vez disso,
> alimentado diretamente como entrada para `comando2` — permitindo combinar ferramentas simples
> (como `grep`, `sort`, `wc`) em pipelines poderosos, sem precisar de arquivos intermediários.

### 3. Para que serve `2>` (diferente de `>` sozinho)?

- [ ] Redireciona a saída duas vezes
- [x] Redireciona especificamente a saída de ERRO (stderr), separada da saída normal (stdout)
- [ ] É um erro de sintaxe
- [ ] Redireciona apenas as duas primeiras linhas da saída

> Todo comando tem canais separados para saída normal (stdout, descritor 1) e saída de erro
> (stderr, descritor 2). `2>` redireciona especificamente as mensagens de erro para um destino
> diferente (como um arquivo de log de erros), sem misturá-las com a saída normal do comando.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Pipes e redirecionamento" na trilha de Bash do CodePath. Contexto: o capítulo
> explica os operadores >, >>, <, 2> e o pipe (|) para encadear comandos. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
