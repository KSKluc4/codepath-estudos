---
numero: 13
titulo: "Processos"
nivel: "avancado"
objetivo: "Gerenciar processos em execução com ps, kill e jobs."
duracao: 10
status: "completo"
---

## Conceito

Todo programa em execução no sistema é um **processo**, identificado por um número único (PID).
`ps` lista processos em execução, `kill` envia sinais a eles (mais comumente para encerrá-los), e
`jobs`/`&`/`fg`/`bg` controlam processos iniciados a partir do próprio terminal, rodando em
primeiro ou segundo plano.

## Sintaxe

```bash
ps aux              # lista todos os processos em execução
kill 1234              # envia sinal de término ao processo com PID 1234
comando &                # roda um comando em segundo plano (background)
```

## Exemplos comentados

```bash
# ps: lista processos em execução
ps aux                  # a = todos os usuários, u = formato detalhado, x = inclui sem terminal
ps aux | grep node        # filtra processos que mencionam "node"

# top / htop: monitoramento em tempo real de processos (htop é mais amigável, se instalado)
top    # pressione 'q' para sair

# kill envia um SINAL a um processo — por padrão, SIGTERM (pede para encerrar graciosamente)
kill 1234              # SIGTERM: pede para o processo 1234 terminar (ele pode ignorar/limpar antes)
kill -9 1234              # SIGKILL: força o encerramento IMEDIATO, sem chance de limpeza
kill -l                     # lista todos os sinais disponíveis

# pkill mata processos pelo NOME, sem precisar descobrir o PID manualmente
pkill node                # encerra todos os processos chamados "node"
pkill -9 -f "server.js"     # -f: casa com o comando completo, não só o nome do processo

# & roda um comando em segundo plano, liberando o terminal imediatamente
sleep 100 &
# [1] 12345   <- número do job e PID

jobs                # lista os jobs em segundo plano do terminal atual
fg                   # traz o job mais recente de volta para primeiro plano
fg %1                 # traz o job número 1 especificamente
bg %1                  # continua um job pausado, mas em segundo plano

# Ctrl+Z pausa (suspende) o processo em primeiro plano atual, sem encerrá-lo
# Ctrl+C envia SIGINT, geralmente interrompendo o processo em primeiro plano

# nohup: mantém um processo rodando mesmo depois de fechar o terminal
nohup ./servidor.sh &
```

## Exercício 1: Encontre e encerre um processo por nome

Escreva os comandos para encontrar o PID de um processo chamado `"servidor_teste"` e encerrá-lo.

### Solução

```bash
ps aux | grep servidor_teste
kill 12345   # substitua 12345 pelo PID encontrado no comando anterior
```

Ou, de forma mais direta, sem precisar identificar o PID manualmente:

```bash
pkill servidor_teste
```

`ps aux | grep servidor_teste` lista os processos e filtra pelo nome, revelando o PID na segunda
coluna da saída — que então é passado para `kill`. `pkill` combina as duas etapas automaticamente,
buscando pelo nome e enviando o sinal de encerramento diretamente.

## Exercício 2: Rode um comando em segundo plano e retome depois

Escreva a sequência de comandos para iniciar `sleep 300` em segundo plano, verificar que ele está
rodando, e depois trazê-lo de volta para primeiro plano.

### Solução

```bash
sleep 300 &
jobs
fg
```

`sleep 300 &` inicia o comando em background, liberando o terminal imediatamente para outros
comandos. `jobs` lista os processos em segundo plano associados a esse terminal (mostrando o
`sleep 300` com seu número de job). `fg` traz o job mais recente de volta ao primeiro plano — a
partir daí, o terminal fica "preso" até o comando terminar (ou até pausar com Ctrl+Z novamente).

## Quiz

### 1. Qual a diferença entre `kill 1234` e `kill -9 1234`?

- [ ] Não há diferença, ambos fazem exatamente a mesma coisa
- [x] `kill 1234` pede educadamente (SIGTERM) que o processo encerre, podendo ser ignorado; `kill -9` (SIGKILL) força o encerramento imediato, sem chance de o processo reagir
- [ ] `kill -9` é mais lento
- [ ] `kill 1234` só funciona com processos do próprio usuário

> `SIGTERM` (o sinal padrão de `kill`) é um pedido educado: o processo pode capturá-lo e fazer uma
> limpeza antes de encerrar (salvar dados, fechar conexões). `SIGKILL` (`kill -9`) não pode ser
> capturado nem ignorado — o sistema operacional encerra o processo imediatamente, sem dar chance
> de reação, por isso deve ser usado como último recurso.

### 2. O que `&` ao final de um comando faz?

- [ ] Executa o comando duas vezes
- [x] Roda o comando em segundo plano (background), liberando o terminal imediatamente para outros comandos
- [ ] Cancela o comando
- [ ] Redireciona a saída para um arquivo

> `comando &` inicia o processo, mas não espera ele terminar para devolver o controle do terminal
> — útil para processos de longa duração (como um servidor) que você quer manter rodando enquanto
> continua usando o terminal para outras coisas.

### 3. O que `jobs` e `fg` fazem juntos?

- [ ] `jobs` mata processos; `fg` os reinicia
- [x] `jobs` lista os processos em segundo plano do terminal atual; `fg` traz um deles de volta para primeiro plano
- [ ] Ambos são sinônimos de `ps`
- [ ] `fg` só funciona depois de `kill`

> `jobs` mostra quais comandos foram iniciados com `&` (ou pausados com Ctrl+Z) e ainda estão
> associados àquele terminal específico. `fg` (foreground) retoma um desses jobs, trazendo-o de
> volta ao controle direto do terminal — útil quando você quer voltar a interagir com um processo
> que estava rodando em background.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Processos" na trilha de Bash do CodePath. Contexto: o capítulo explica ps, kill
> (SIGTERM vs SIGKILL), pkill e o controle de jobs com &/jobs/fg/bg. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
