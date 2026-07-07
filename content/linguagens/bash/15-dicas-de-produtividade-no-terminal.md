---
numero: 15
titulo: "Dicas de produtividade no terminal"
nivel: "avancado"
objetivo: "Atalhos, aliases e truques para ser mais rápido no terminal."
duracao: 10
status: "completo"
---

## Conceito

Depois de conhecer os comandos individuais, produtividade no terminal vem de reduzir atrito:
atalhos de teclado que evitam retiradas, aliases que encurtam comandos repetidos, e o histórico de
comandos bem aproveitado. São pequenos hábitos que, somados, economizam bastante tempo no dia a
dia.

## Sintaxe

```bash
alias ll='ls -la'          # cria um atalho de comando
history | grep git           # busca no histórico de comandos
Ctrl+R                          # busca reversa interativa no histórico
```

## Exemplos comentados

```bash
# Atalhos de edição de linha (funcionam na maioria dos shells)
# Ctrl+A  -> vai para o início da linha
# Ctrl+E  -> vai para o final da linha
# Ctrl+U  -> apaga tudo antes do cursor
# Ctrl+K  -> apaga tudo depois do cursor
# Ctrl+W  -> apaga a última palavra
# Ctrl+L  -> limpa a tela (igual ao comando clear)
# Ctrl+C  -> interrompe o comando atual
# Ctrl+D  -> encerra o shell atual (ou fecha um input, como EOF)
# Ctrl+R  -> busca reversa interativa no histórico (digite parte de um comando antigo)

# Aliases: atalhos permanentes para comandos usados com frequência
alias ll='ls -la'
alias gs='git status'
alias gc='git commit -m'
alias ..='cd ..'
alias ...='cd ../..'
# Adicione essas linhas ao ~/.bashrc (ou ~/.zshrc) para que fiquem disponíveis sempre

# Histórico de comandos
history                # lista os últimos comandos digitados
!123                     # reexecuta o comando de número 123 no histórico
!!                        # reexecuta o ÚLTIMO comando
!!:s/antigo/novo/          # reexecuta o último comando, substituindo uma palavra
sudo !!                      # comando clássico: roda o último comando de novo, mas com sudo

# Autocompletar com TAB
cd proj<TAB>            # autocompleta para "projetos/" se for a única correspondência
cd proj<TAB><TAB>         # com correspondências múltiplas, mostra as opções

# Navegação rápida entre diretórios recentes (pushd/popd, menos comum mas útil)
pushd /var/log      # vai para /var/log, "empilhando" o diretório anterior
popd                   # volta para o diretório anterior "empilhado"

# Um prompt bem configurado (PS1) mostra informações úteis direto na linha de comando
# (branch do git, diretório atual, código de saída do último comando, etc.)

# Combine tudo: alias + histórico + autocompletar reduzem MUITO a quantidade de digitação
# necessária para tarefas repetitivas no dia a dia
```

## Exercício 1: Crie aliases úteis

Escreva três linhas de alias para adicionar ao `~/.bashrc`: um para `ls -la` chamado `ll`, um para
`git status` chamado `gs`, e um para voltar dois diretórios chamado `...`.

### Solução

```bash
alias ll='ls -la'
alias gs='git status'
alias ...='cd ../..'
```

Depois de adicionadas ao `~/.bashrc`, essas linhas precisam ser recarregadas (com `source
~/.bashrc`, ou abrindo um novo terminal) para terem efeito. A partir daí, digitar `ll` no terminal
executa `ls -la` automaticamente, economizando digitação para comandos usados com muita frequência.

## Exercício 2: Reexecute o último comando com sudo

Você digitou `apt update` e recebeu um erro de permissão negada. Escreva o comando (usando
histórico) que reexecuta o comando anterior, mas prefixado com `sudo`, sem redigitar `apt update`
por completo.

### Solução

```bash
sudo !!
```

`!!` expande para o texto exato do último comando executado — nesse caso, `apt update`. Prefixado
com `sudo`, o shell efetivamente roda `sudo apt update`, sem precisar redigitar o comando original
inteiro. É um dos atalhos de histórico mais usados no dia a dia por quem trabalha bastante no
terminal.

## Quiz

### 1. O que `Ctrl+R` faz no terminal?

- [ ] Reinicia o shell
- [x] Abre a busca reversa interativa no histórico de comandos, permitindo digitar parte de um comando antigo para encontrá-lo rapidamente
- [ ] Remove a linha atual
- [ ] Recarrega o arquivo de configuração do shell

> `Ctrl+R` inicia uma busca incremental pelo histórico: conforme você digita, o shell mostra o
> comando mais recente que contém aquele texto — pressionar `Ctrl+R` novamente avança para
> correspondências mais antigas. Muito mais rápido que rolar pelo histórico manualmente com as
> setas.

### 2. Onde aliases devem ser definidos para ficarem disponíveis permanentemente, em todo novo terminal?

- [ ] Em um arquivo temporário, que precisa ser recriado a cada sessão
- [x] No arquivo de configuração do shell (como `~/.bashrc` ou `~/.zshrc`), carregado automaticamente a cada nova sessão
- [ ] Aliases não podem ser tornados permanentes
- [ ] Diretamente no PATH do sistema

> Aliases definidos apenas no terminal (digitados diretamente) valem apenas para aquela sessão —
> ao fechar o terminal, eles desaparecem. Adicioná-los ao arquivo de configuração do shell
> (carregado automaticamente sempre que um novo terminal é aberto) os torna permanentes.

### 3. O que `!!` representa no histórico de comandos do Bash?

- [ ] O primeiro comando já executado na sessão
- [x] O último comando executado, podendo ser reutilizado (por exemplo, prefixado com `sudo !!`)
- [ ] Um comando vazio
- [ ] Limpa todo o histórico

> `!!` é uma expansão de histórico que se refere diretamente ao comando anterior — útil para
> repeti-lo com uma pequena modificação (como adicionar `sudo` na frente) sem precisar redigitar o
> comando inteiro.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Dicas de produtividade no terminal" na trilha de Bash do CodePath. Contexto: o
> capítulo explica atalhos de edição de linha, aliases, expansão de histórico (!! e !123) e
> autocompletar com TAB. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
