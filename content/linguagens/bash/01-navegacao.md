---
numero: 1
titulo: "Navegação"
nivel: "basico"
objetivo: "Navegar pelo sistema de arquivos com cd, pwd e ls."
duracao: 8
status: "completo"
---

## Conceito

Bash é o interpretador de comandos (shell) mais usado em sistemas Linux e macOS. Diferente de uma
interface gráfica, você navega pelo sistema de arquivos digitando comandos: `pwd` mostra onde você
está, `cd` muda de diretório, e `ls` lista o conteúdo do diretório atual. O sistema de arquivos é
organizado em uma árvore, começando da raiz `/`.

## Sintaxe

```bash
pwd            # mostra o diretório atual (print working directory)
ls             # lista arquivos e pastas do diretório atual
cd caminho     # muda para o diretório especificado
```

## Exemplos comentados

```bash
pwd
# /home/ana/projetos

ls
# documentos  fotos  projetos  README.md

ls -l          # formato longo: permissões, dono, tamanho, data
ls -a          # inclui arquivos ocultos (que começam com .)
ls -la         # combina as duas flags acima

cd documentos   # entra no diretório "documentos" (caminho RELATIVO)
cd /home/ana    # vai direto para um caminho ABSOLUTO (sempre começa com /)
cd ..            # sobe um nível (para o diretório pai)
cd ../..          # sobe dois níveis
cd ~               # vai para o diretório "home" do usuário atual
cd -                # volta para o diretório anterior (útil para alternar entre dois lugares)
cd                   # sem argumento, também vai para o home

# Caminhos relativos partem de onde você está; absolutos partem sempre da raiz /
ls ../fotos      # lista o conteúdo de uma pasta "fotos" no diretório PAI
ls /etc           # lista o conteúdo de /etc, não importa onde você esteja

# tree (se instalado) mostra a estrutura de pastas em árvore visual
# tree -L 2   # até 2 níveis de profundidade
```

## Exercício 1: Navegue até um diretório específico

Supondo que você está em `/home/ana` e quer chegar em `/home/ana/projetos/codepath`, escreva o
comando `cd` mais direto para isso, e depois o comando para confirmar onde você está.

### Solução

```bash
cd projetos/codepath
pwd
# /home/ana/projetos/codepath
```

Como `projetos/codepath` é um caminho **relativo** ao diretório atual (`/home/ana`), não é preciso
digitar o caminho absoluto completo. `pwd` confirma a localização atual depois da navegação —
sempre útil quando não se tem certeza de onde o `cd` deixou você.

## Exercício 2: Volte dois níveis e liste com detalhes

Escreva o comando que sobe dois níveis de diretório e, em seguida, lista o conteúdo em formato
detalhado, incluindo arquivos ocultos.

### Solução

```bash
cd ../..
ls -la
```

Cada `..` representa "um nível acima"; encadeados com `/`, `../..` sobe dois níveis de uma vez.
`ls -la` combina `-l` (formato longo, com permissões/dono/tamanho) e `-a` (mostra também arquivos
ocultos, que começam com `.`, como `.bashrc` ou `.git`).

## Quiz

### 1. Qual a diferença entre um caminho relativo e um caminho absoluto?

- [ ] Não há diferença, funcionam de forma idêntica
- [x] Um caminho absoluto sempre começa em `/` (a raiz); um caminho relativo parte do diretório atual
- [ ] Caminhos relativos só funcionam com `ls`, não com `cd`
- [ ] Caminhos absolutos são mais rápidos de processar

> Um caminho absoluto, como `/home/ana/documentos`, é sempre resolvido a partir da raiz do sistema
> de arquivos, não importa onde você esteja. Um caminho relativo, como `documentos` ou
> `../fotos`, é interpretado em relação ao diretório atual (`pwd`).

### 2. O que `cd ~` faz?

- [ ] Sobe um nível de diretório
- [x] Vai para o diretório home do usuário atual
- [ ] Volta para o diretório anterior
- [ ] Lista os arquivos ocultos

> `~` é um atalho para o diretório home do usuário logado (como `/home/ana`). `cd` sozinho, sem
> argumentos, tem o mesmo efeito.

### 3. O que `cd -` faz?

- [ ] Sobe um nível de diretório, igual a `cd ..`
- [x] Volta para o diretório onde você estava ANTES do último `cd`
- [ ] Vai para a raiz do sistema de arquivos
- [ ] É um erro de sintaxe

> `cd -` alterna entre os dois últimos diretórios visitados — muito útil quando você precisa ir e
> voltar repetidamente entre dois lugares, sem digitar o caminho completo de novo.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Navegação" na trilha de Bash do CodePath. Contexto: o capítulo explica pwd, ls
> (e suas flags) e cd, incluindo caminhos relativos vs. absolutos. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
