---
numero: 14
titulo: "Cron"
nivel: "avancado"
objetivo: "Agendar tarefas recorrentes com crontab."
duracao: 10
status: "completo"
---

## Conceito

`cron` é um agendador de tarefas presente na maioria dos sistemas Unix, que executa comandos
automaticamente em horários/intervalos definidos — como um backup diário à meia-noite, ou uma
limpeza de logs toda semana. Cada usuário tem sua própria lista de tarefas agendadas (a
`crontab`), definida em um formato de cinco campos de tempo.

## Sintaxe

```bash
crontab -e   # abre o editor para modificar suas tarefas agendadas

# minuto hora dia-do-mês mês dia-da-semana comando
0 3 * * * /caminho/para/backup.sh
```

## Exemplos comentados

```bash
# Formato: minuto(0-59) hora(0-23) dia-do-mês(1-31) mês(1-12) dia-da-semana(0-6, 0=domingo)
# *  significa "qualquer valor" naquele campo

0 3 * * * /home/ana/backup.sh
# roda todo dia às 3:00 da manhã (minuto 0, hora 3, qualquer dia/mês/dia-da-semana)

*/15 * * * * /home/ana/verificar_status.sh
# roda a cada 15 minutos (*/15 = "a cada 15 unidades", também funciona em outros campos)

0 9 * * 1 /home/ana/relatorio_semanal.sh
# roda toda SEGUNDA-feira (1) às 9:00

0 0 1 * * /home/ana/fechamento_mensal.sh
# roda no dia 1 de todo mês, à meia-noite

30 8 * * 1-5 /home/ana/rotina_dias_uteis.sh
# roda às 8:30, de segunda a sexta (1-5 = intervalo de dias da semana)

0 */2 * * * /home/ana/checagem.sh
# roda a cada 2 horas, no minuto 0 (0h, 2h, 4h, 6h, ...)

# Comandos úteis:
crontab -l          # lista as tarefas agendadas do usuário atual
crontab -e            # edita (abre o editor configurado, como vim ou nano)
crontab -r              # remove TODAS as tarefas agendadas do usuário (cuidado!)

# Boas práticas com cron:
# 1. Sempre use CAMINHOS ABSOLUTOS nos scripts (o cron roda com um ambiente mínimo,
#    sem o PATH completo do seu shell interativo)
0 3 * * * /usr/bin/bash /home/ana/scripts/backup.sh

# 2. Redirecione a saída para um log, já que cron não mostra erros na tela
0 3 * * * /home/ana/backup.sh >> /home/ana/backup.log 2>&1

# 3. Teste o comando manualmente no terminal antes de agendá-lo
```

## Exercício 1: Agende um backup diário

Escreva a linha de crontab que executa `/home/ana/scripts/backup.sh` todo dia às 2:30 da manhã.

### Solução

```bash
30 2 * * * /home/ana/scripts/backup.sh
```

O primeiro campo (`30`) é o minuto, o segundo (`2`) é a hora — juntos, `30 2` representa
"2:30". Os três campos seguintes (`* * *`) usam o curinga, significando "qualquer dia do mês,
qualquer mês, qualquer dia da semana" — ou seja, todos os dias.

## Exercício 2: Agende uma tarefa com log de saída

Escreva a linha de crontab que roda `/home/ana/scripts/limpeza.sh` a cada 6 horas, redirecionando
toda a saída (normal e de erro) para `/home/ana/limpeza.log`.

### Solução

```bash
0 */6 * * * /home/ana/scripts/limpeza.sh >> /home/ana/limpeza.log 2>&1
```

`0 */6` significa "no minuto 0, a cada 6 horas" (0h, 6h, 12h, 18h). `>> /home/ana/limpeza.log`
adiciona a saída normal ao arquivo de log, e `2>&1` redireciona também a saída de erro para o
mesmo destino — sem isso, se o script falhar, a mensagem de erro simplesmente desapareceria, já
que `cron` não exibe nada na tela quando roda tarefas agendadas.

## Quiz

### 1. O que os cinco campos de tempo em uma linha de crontab representam, na ordem?

- [ ] Hora, minuto, mês, dia, dia-da-semana
- [x] Minuto, hora, dia-do-mês, mês, dia-da-semana
- [ ] Ano, mês, dia, hora, minuto
- [ ] Segundo, minuto, hora, dia, mês

> A ordem fixa é `minuto hora dia-do-mês mês dia-da-semana`, seguida do comando a ser executado.
> Um asterisco (`*`) em qualquer campo significa "qualquer valor" — a linha `0 3 * * *` significa
> "minuto 0, hora 3, qualquer dia/mês/dia-da-semana", ou seja, todo dia às 3:00.

### 2. Por que scripts agendados via cron devem usar caminhos absolutos?

- [ ] Caminhos relativos não são suportados pelo Bash
- [x] Cron executa tarefas com um ambiente mínimo, sem o PATH completo configurado no shell interativo do usuário
- [ ] É apenas uma convenção estética, sem efeito real
- [ ] Caminhos absolutos são mais rápidos de processar

> O ambiente em que `cron` executa tarefas é bem mais limitado que um shell interativo normal —
> variáveis como `PATH` podem não incluir os mesmos diretórios que você tem configurado no seu
> `.bashrc`. Usar caminhos absolutos (tanto para o script quanto para comandos dentro dele) evita
> falhas silenciosas por "comando não encontrado".

### 3. Por que é recomendado redirecionar a saída de um comando agendado no cron para um arquivo de log?

- [ ] cron exige explicitamente essa sintaxe, ou recusa agendar a tarefa
- [x] cron não exibe a saída (nem erros) em lugar nenhum visível por padrão — sem redirecionar, mensagens de erro seriam perdidas silenciosamente
- [ ] Torna a tarefa mais rápida
- [ ] Apenas reduz o tamanho do crontab

> Diferente de rodar um comando manualmente no terminal (onde você vê a saída e erros na tela),
> tarefas do cron rodam sem terminal associado — qualquer saída, se não for redirecionada
> explicitamente (`>> log.txt 2>&1`), é descartada ou (dependendo da configuração) enviada por
> e-mail ao usuário, tornando problemas muito mais difíceis de diagnosticar sem um log.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Cron" na trilha de Bash do CodePath. Contexto: o capítulo explica o formato de
> cinco campos do crontab, crontab -e/-l/-r, e boas práticas como caminhos absolutos e logs. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
