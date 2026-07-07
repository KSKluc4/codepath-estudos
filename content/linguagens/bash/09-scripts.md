---
numero: 9
titulo: "Scripts"
nivel: "intermediario"
objetivo: "Escrever e executar seus próprios scripts .sh."
duracao: 10
status: "completo"
---

## Conceito

Um script Bash é apenas um arquivo de texto com uma sequência de comandos, executado de uma vez.
A primeira linha (`shebang`) diz ao sistema qual interpretador usar para rodar o arquivo. Depois
de escrito, um script precisa de permissão de execução (visto no capítulo de permissões) para
rodar diretamente.

## Sintaxe

```bash
#!/bin/bash
echo "Olá, mundo!"
```

```bash
chmod +x script.sh
./script.sh
```

## Exemplos comentados

```bash
#!/bin/bash
# ^ shebang: indica que este arquivo deve ser interpretado por /bin/bash

# Comentários começam com # (assim como esta linha)

echo "Iniciando script..."

nome="CodePath"
echo "Rodando o script de $nome"

# set -e: encerra o script IMEDIATAMENTE se qualquer comando falhar
# (sem isso, o script continua mesmo após um erro, o que pode causar problemas em cascata)
set -e

# set -u: trata o uso de variáveis não definidas como erro (evita bugs silenciosos)
set -u

# set -euo pipefail: combinação comum no início de scripts "sérios"
# pipefail garante que um pipeline (cmd1 | cmd2) falhe se QUALQUER comando dele falhar,
# não apenas o último
set -euo pipefail

echo "Verificando dependências..."
if ! command -v git &> /dev/null; then
    echo "Erro: git não está instalado" >&2  # >&2 envia a mensagem para stderr
    exit 1                                     # código de saída != 0 sinaliza falha
fi

echo "Tudo certo!"
exit 0   # 0 = sucesso (opcional no final, mas explícito e claro)
```

```bash
# Formas de executar um script:
./script.sh          # exige permissão de execução (chmod +x)
bash script.sh          # roda com bash explicitamente, sem precisar de +x
source script.sh          # roda no MESMO shell atual (variáveis definidas persistem depois)
. script.sh                # "." é sinônimo de "source"
```

## Exercício 1: Escreva um script de backup simples

Escreva um script `backup.sh` que cria uma cópia de `dados.csv` chamada `dados_backup.csv`, e
imprime `"Backup criado com sucesso"` ao final.

### Solução

```bash
#!/bin/bash
set -e

cp dados.csv dados_backup.csv
echo "Backup criado com sucesso"
```

O shebang `#!/bin/bash` na primeira linha garante que o arquivo seja interpretado por Bash mesmo
que executado diretamente (`./backup.sh`). `set -e` faz o script parar imediatamente se `cp`
falhar (por exemplo, se `dados.csv` não existir), evitando que a mensagem de sucesso apareça
mesmo quando o backup não foi realmente criado.

## Exercício 2: Adicione verificação de dependência

Modifique o script para verificar, antes de tudo, se o arquivo `dados.csv` existe — se não
existir, imprimir um erro em stderr e sair com código `1`, sem tentar o backup.

### Solução

```bash
#!/bin/bash
set -e

if [ ! -f "dados.csv" ]; then
    echo "Erro: dados.csv não encontrado" >&2
    exit 1
fi

cp dados.csv dados_backup.csv
echo "Backup criado com sucesso"
```

A checagem `[ ! -f "dados.csv" ]` roda antes de qualquer tentativa de cópia, evitando o erro mais
confuso que `cp` produziria sozinho. `>&2` envia a mensagem de erro especificamente para stderr
(não stdout), seguindo a convenção Unix de separar mensagens de erro da saída normal do programa —
e `exit 1` sinaliza claramente, para quem chamar este script, que ele falhou.

## Quiz

### 1. Para que serve a linha `#!/bin/bash` no início de um script?

- [ ] É apenas um comentário decorativo, sem efeito
- [x] O "shebang" indica ao sistema qual interpretador usar para rodar o restante do arquivo
- [ ] Define o nome do script
- [ ] É obrigatório apenas em scripts muito longos

> A primeira linha de um script executável no Unix, começando com `#!`, indica ao sistema
> operacional qual programa deve interpretar o restante do arquivo. `#!/bin/bash` garante que o
> script rode com Bash especificamente, mesmo se o shell padrão do usuário for outro (como zsh).

### 2. O que `set -e` faz no início de um script?

- [ ] Ativa modo de depuração, imprimindo cada comando antes de executá-lo
- [x] Faz o script encerrar imediatamente se qualquer comando retornar um código de erro
- [ ] Desativa a execução de comandos
- [ ] Só afeta a última linha do script

> Sem `set -e`, um script Bash continua executando as linhas seguintes mesmo depois de um comando
> falhar — o que pode causar erros em cascata difíceis de rastrear. `set -e` interrompe a
> execução no primeiro comando que falhar, tornando falhas mais visíveis e o comportamento mais
> previsível.

### 3. Qual a diferença entre rodar `./script.sh` e `source script.sh`?

- [ ] Não há diferença nenhuma
- [x] `./script.sh` roda em um sub-processo separado; `source script.sh` roda no shell atual, preservando variáveis/mudanças de diretório depois
- [ ] `source` só funciona com scripts sem shebang
- [ ] `./script.sh` sempre falha sem permissão de root

> `./script.sh` executa o script em um novo processo filho: qualquer variável definida ou `cd`
> feito dentro dele desaparece quando o script termina. `source script.sh` (ou `. script.sh`) roda
> os comandos diretamente no shell atual, então mudanças de variáveis e diretório persistem depois
> — usado, por exemplo, para carregar configurações (`source ~/.bashrc`).

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Scripts" na trilha de Bash do CodePath. Contexto: o capítulo explica shebang,
> set -e/-u/pipefail, códigos de saída (exit) e a diferença entre executar e fazer source de um
> script. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
