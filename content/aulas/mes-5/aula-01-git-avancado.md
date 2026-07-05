---
id: "m5-a1"
mes: 5
numero: 1
titulo: "Git avançado"
objetivo: "Ir além do básico de Git: branches, rebase e resolução de conflitos com confiança."
duracao: 30
status: "completo"
---

## Bem-vindo ao mês 5

Nos últimos quatro meses você entendeu a máquina por dentro, programou em C mexendo com memória
diretamente, estudou estruturas de dados e algoritmos, e aprendeu como computadores conversam pela
rede e como o sistema operacional gerencia processos. Este mês muda de assunto: em vez de mais
teoria de computação, vamos estudar as **práticas de engenharia de software** que separam código de
estudante de código profissional — começando pela ferramenta que todo time de desenvolvimento usa
todos os dias: o **Git**.

Se você já usa `git add`, `git commit` e `git push` no dia a dia, ótimo — esta aula assume esse
básico e vai além, para as ferramentas que fazem diferença de verdade quando você trabalha em um
código com outras pessoas.

## Branches: linhas do tempo paralelas

Um **branch** (ramo) é, essencialmente, uma linha do tempo independente de commits. Todo repositório
Git começa com um branch principal (geralmente chamado `main` ou `master`), mas você pode criar novos
branches para desenvolver uma funcionalidade, corrigir um bug, ou experimentar uma ideia — sem afetar
o branch principal até que o trabalho esteja pronto e revisado.

```bash
git branch nova-funcionalidade      # cria o branch, sem mudar para ele
git checkout nova-funcionalidade    # muda para o branch criado
git checkout -b outra-funcionalidade  # atalho: cria e já muda para o branch
```

Pense em branches como **rascunhos paralelos** de um documento: você pode editar um rascunho
livremente, sabendo que o documento "oficial" (`main`) permanece intocado até você decidir
explicitamente incorporar suas mudanças a ele. Isso permite que várias pessoas (ou você mesmo, em
tarefas diferentes) trabalhem em paralelo sem pisar no trabalho umas das outras.

## Merge: juntando as linhas do tempo

Quando o trabalho em um branch está pronto, ele precisa ser incorporado de volta ao branch principal.
A forma mais direta é o `git merge`:

```bash
git checkout main
git merge nova-funcionalidade
```

Um merge cria um novo commit que **une** o histórico dos dois branches, preservando exatamente como
as coisas aconteceram — inclusive o fato de que houve um desenvolvimento paralelo. O histórico
resultante mostra claramente os dois caminhos que existiam antes de se juntarem:

```text
main:              A---B-------M
                        \      /
nova-funcionalidade:     C----D
```

## Rebase: reescrevendo a linha do tempo

O `git rebase` resolve o mesmo problema — incorporar mudanças de um branch em outro — mas de um jeito
diferente: em vez de criar um commit de merge unindo dois caminhos, o rebase **reescreve** os commits
do seu branch como se eles tivessem sido criados **a partir do estado mais recente** do branch de
destino, resultando em um histórico **linear**, sem bifurcações:

```bash
git checkout nova-funcionalidade
git rebase main
```

```text
Antes do rebase:
main:                A---B
                          \
nova-funcionalidade:       C----D

Depois do rebase:
main:                A---B
                           \
nova-funcionalidade:        C'---D'
```

Note que os commits `C` e `D` viram `C'` e `D'` — tecnicamente **novos commits**, com o mesmo
conteúdo, mas aplicados sobre uma base diferente (por isso têm um hash diferente dos originais). Essa
é a diferença central entre merge e rebase:

| | Merge | Rebase |
|---|-------|--------|
| Histórico resultante | Preserva os dois caminhos, com um commit de merge | Linear, como se o trabalho tivesse acontecido em sequência |
| Reescreve commits existentes? | Não | Sim (cria novos commits com o mesmo conteúdo) |
| Quando usar | Branches compartilhados publicamente, onde reescrever histórico causaria problemas para outras pessoas | Branches locais/pessoais, antes de compartilhar, para manter um histórico limpo |

> **Regra de ouro**: nunca faça rebase de um branch que **outras pessoas já baixaram e estão usando**.
> Como o rebase reescreve commits (trocando seus hashes), qualquer pessoa que já tinha os commits
> antigos vai ter um histórico divergente e conflitante do seu. Rebase é seguro em branches que só
> você usa, antes de compartilhá-los.

## Conflitos de merge: quando o Git não consegue decidir sozinho

Um **conflito** acontece quando duas mudanças diferentes afetam a **mesma linha** (ou linhas muito
próximas) de um arquivo, e o Git não tem como saber automaticamente qual versão manter. Quando isso
acontece, o Git marca o arquivo com marcadores especiais:

```text
<<<<<<< HEAD
saudacao = "Olá, mundo!"
=======
saudacao = "Oi, mundo!"
>>>>>>> nova-funcionalidade
```

- Tudo entre `<<<<<<< HEAD` e `=======` é a versão do branch em que você está agora.
- Tudo entre `=======` e `>>>>>>> nova-funcionalidade` é a versão vinda do outro branch.

Resolver o conflito significa **editar manualmente** o arquivo, decidindo o que ficar (uma das duas
versões, uma combinação das duas, ou algo novo), removendo os marcadores, e então marcando o arquivo
como resolvido:

```bash
# depois de editar o arquivo removendo os marcadores e decidindo o conteúdo final:
git add arquivo-com-conflito.py
git commit    # finaliza o merge (se estava em um merge) ou "git rebase --continue" (se estava em um rebase)
```

## Exercício 1: Merge ou rebase?

Você está trabalhando sozinho em um branch local `experimento`, que ainda não foi compartilhado com
ninguém, e quer atualizar esse branch com os commits mais recentes de `main` antes de continuar
trabalhando, mantendo um histórico limpo e linear. Merge ou rebase é mais adequado aqui? E se esse
mesmo branch já tivesse sido enviado ao repositório remoto e outra pessoa já tivesse baixado esses
commits?

### Solução

No primeiro cenário — branch **local**, ainda não compartilhado — **rebase** é mais adequado, já que
o objetivo é justamente manter um histórico linear, e não há ninguém mais dependendo dos commits
originais (que seriam reescritos). No segundo cenário — branch **já compartilhado**, com outra pessoa
tendo baixado os commits — **merge** é a escolha mais segura: fazer rebase reescreveria os commits
que a outra pessoa já possui localmente, criando hashes diferentes e um histórico divergente e
conflitante entre as duas cópias do branch.

## Exercício 2: Interprete o conflito

Durante um merge, o Git mostra o seguinte trecho em um arquivo:

```text
<<<<<<< HEAD
max_tentativas = 3
=======
max_tentativas = 5
>>>>>>> feature-login
```

Explique o que cada parte representa e escreva como ficaria o arquivo depois de você decidir manter
o valor `5`, vindo do branch `feature-login`.

### Solução

A parte entre `<<<<<<< HEAD` e `=======` (`max_tentativas = 3`) é o valor atual do branch em que você
está (`HEAD`). A parte entre `=======` e `>>>>>>> feature-login` (`max_tentativas = 5`) é o valor
vindo do branch que está sendo mesclado (`feature-login`). Para resolver mantendo o valor `5`, o
arquivo final, sem nenhum marcador, deve ficar assim:

```text
max_tentativas = 5
```

Depois de editar o arquivo dessa forma, o próximo passo seria `git add` no arquivo e `git commit` para
finalizar o merge.

## Exercício 3: Reescrevendo o histórico

Depois de um `git rebase main` bem-sucedido em um branch local, os commits `C` e `D` do branch viram
`C'` e `D'`. Explique por que isso acontece — ou seja, por que o rebase não consegue simplesmente
"mover" os commits originais para cima do novo ponto de partida.

### Solução

Cada commit no Git é identificado por um **hash**, calculado a partir do próprio conteúdo do commit
**e do commit pai** ao qual ele está conectado. Quando o rebase muda a base de `C` e `D` (o commit pai
deles deixa de ser o antigo estado de `main` e passa a ser o novo estado de `main` depois do rebase),
o conteúdo usado para calcular o hash muda — mesmo que as alterações de código dentro de `C` e `D`
sejam idênticas às originais. Um hash diferente significa, tecnicamente, um **commit diferente**; por
isso o Git precisa criar `C'` e `D'` como novos commits, em vez de reaproveitar os hashes antigos.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Git avançado" do meu curso de programação. Contexto: a aula explica branches,
> merge (histórico com bifurcações preservadas) vs. rebase (histórico linear, reescrevendo commits), e
> como resolver conflitos manualmente editando os marcadores `<<<<<<<`, `=======` e `>>>>>>>`. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que é um branch no Git?

- [ ] Uma cópia completa e independente do repositório, em outro local
- [x] Uma linha do tempo independente de commits, que pode se desenvolver em paralelo ao branch principal
- [ ] Um arquivo de configuração do Git
- [ ] Um tipo de conflito de merge

> Um branch permite desenvolver mudanças de forma isolada, sem afetar o branch principal até que o
> trabalho esteja pronto para ser incorporado.

### 2. Qual é a principal diferença entre merge e rebase?

- [ ] Merge é mais rápido, rebase é mais lento
- [x] Merge preserva os dois caminhos do histórico com um commit de união; rebase reescreve os commits para criar um histórico linear
- [ ] Rebase nunca pode causar conflitos, merge sempre causa
- [ ] Não há diferença real entre os dois comandos

> Merge cria um commit que une dois históricos, preservando a bifurcação; rebase reescreve os commits
> de um branch como se tivessem sido criados a partir do estado mais recente do outro, resultando em
> um histórico linear.

### 3. Por que é arriscado fazer rebase em um branch que outras pessoas já baixaram?

- [ ] Porque o rebase apaga arquivos do repositório
- [x] Porque o rebase reescreve commits (mudando seus hashes), criando divergência entre a cópia reescrita e as cópias que outras pessoas já possuem
- [ ] Porque o rebase é uma operação exclusiva de repositórios privados
- [ ] Não há risco nenhum, rebase é sempre seguro

> Como o rebase gera novos commits com hashes diferentes para o mesmo conteúdo, qualquer pessoa que já
> tinha os commits antigos vai ter um histórico conflitante com a versão reescrita.

### 4. Quando um conflito de merge ocorre?

- [ ] Sempre que dois branches diferentes existem no mesmo repositório
- [x] Quando duas mudanças diferentes afetam a mesma linha (ou linhas muito próximas) de um arquivo, e o Git não sabe qual versão manter
- [ ] Quando um commit não tem mensagem descritiva
- [ ] Apenas quando se usa `git rebase`, nunca em `git merge`

> Conflitos surgem quando o Git não consegue combinar automaticamente mudanças concorrentes sobre o
> mesmo trecho de um arquivo, exigindo decisão manual de qual conteúdo manter.

### 5. O que os marcadores `<<<<<<<`, `=======` e `>>>>>>>` representam durante um conflito?

- [ ] Erros de sintaxe no código
- [x] A separação entre a versão atual (HEAD) e a versão vinda do outro branch, que precisa ser resolvida manualmente
- [ ] Comentários automáticos gerados pelo Git
- [ ] O fim de um arquivo

> Esses marcadores delimitam as duas versões conflitantes de um trecho — a versão atual (antes de
> `=======`) e a versão do branch sendo incorporado (depois de `=======`) — para que a pessoa
> desenvolvedora escolha ou combine manualmente o conteúdo final.
