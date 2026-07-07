---
numero: 11
titulo: "grep, sed e awk básico"
nivel: "avancado"
objetivo: "Buscar e transformar texto com grep, sed e awk."
duracao: 15
status: "completo"
---

## Conceito

`grep`, `sed` e `awk` são três ferramentas clássicas de processamento de texto que aparecem em
praticamente todo pipeline sério de shell: `grep` **busca** linhas que casam com um padrão, `sed`
**substitui** texto (stream editor), e `awk` **processa dados estruturados** em colunas, sendo
quase uma pequena linguagem de programação própria.

## Sintaxe

```bash
grep "padrao" arquivo.txt
sed 's/antigo/novo/' arquivo.txt
awk '{ print $1 }' arquivo.txt
```

## Exemplos comentados

```bash
# grep: busca linhas que casam com um padrão
grep "ERROR" app.log             # linhas contendo "ERROR"
grep -i "error" app.log            # -i: ignora maiúsculas/minúsculas
grep -v "DEBUG" app.log             # -v: inverte, mostra linhas que NÃO casam
grep -n "ERROR" app.log              # -n: mostra o número da linha
grep -r "TODO" ./src                  # -r: busca recursivamente em diretórios
grep -c "ERROR" app.log                # -c: conta quantas linhas casam (não mostra as linhas)
grep -E "erro|falha" app.log             # -E: regex estendida (ou usar egrep)

# sed: substitui texto (stream editor)
sed 's/gato/cachorro/' arquivo.txt        # substitui a PRIMEIRA ocorrência por linha
sed 's/gato/cachorro/g' arquivo.txt         # g: substitui TODAS as ocorrências por linha
sed -i 's/http:/https:/g' config.txt          # -i: edita o arquivo IN PLACE (modifica de verdade)
sed -n '5,10p' arquivo.txt                      # -n + p: imprime só as linhas de 5 a 10
sed '/^#/d' arquivo.conf                          # d: apaga linhas que casam (aqui, comentários)

# awk: processa texto estruturado em colunas (campos separados por espaço, por padrão)
echo "Ana 28 Engenharia" | awk '{ print $1 }'      # Ana (primeiro campo)
echo "Ana 28 Engenharia" | awk '{ print $2, $3 }'  # 28 Engenharia

# awk com um arquivo CSV (mudando o separador de campo com -F)
awk -F',' '{ print $1 }' dados.csv    # imprime a primeira coluna de um CSV

# awk com condição: processa só linhas que satisfazem um padrão
awk -F',' '$3 > 5000 { print $1 }' funcionarios.csv  # nomes com salário (3ª coluna) > 5000

# awk com variáveis embutidas: NR (número da linha), NF (número de campos)
awk '{ print NR, $0 }' arquivo.txt    # numera cada linha
awk -F',' '{ print NF }' dados.csv     # quantos campos cada linha tem

# Combinando os três em um pipeline real
cat access.log | grep "404" | awk '{ print $1 }' | sort | uniq -c | sort -rn
# filtra erros 404, extrai o IP (primeira coluna), conta ocorrências por IP, ordena
```

## Exercício 1: Encontre e conte erros em um log

Escreva um comando que conta quantas linhas de `app.log` contêm a palavra `"ERROR"`, ignorando
maiúsculas/minúsculas.

### Solução

```bash
grep -ic "error" app.log
```

`-i` faz a busca ignorar diferenças entre maiúsculas e minúsculas (casando `"ERROR"`, `"Error"`,
`"error"`), e `-c` faz `grep` retornar apenas a contagem de linhas correspondentes, em vez de
exibir cada linha encontrada.

## Exercício 2: Substitua um valor em um arquivo de configuração

Escreva um comando `sed` que substitui todas as ocorrências de `"localhost"` por
`"producao.exemplo.com"` no arquivo `config.env`, alterando o arquivo diretamente.

### Solução

```bash
sed -i 's/localhost/producao.exemplo.com/g' config.env
```

`s/localhost/producao.exemplo.com/g` é o comando de substituição do `sed`: troca `localhost` por
`producao.exemplo.com`, com `g` garantindo que TODAS as ocorrências em cada linha sejam
substituídas (sem `g`, apenas a primeira de cada linha seria trocada). `-i` faz a edição
diretamente no arquivo, em vez de apenas imprimir o resultado no terminal — use com cuidado, e
considere testar sem `-i` primeiro para conferir o resultado.

## Quiz

### 1. Qual a principal diferença entre `grep` e `sed`?

- [ ] Não há diferença, são sinônimos
- [x] `grep` busca e exibe linhas que casam com um padrão; `sed` pode buscar E substituir/transformar o texto
- [ ] `sed` só funciona com arquivos CSV
- [ ] `grep` sempre modifica o arquivo original

> `grep` é uma ferramenta de busca: ele filtra e mostra linhas correspondentes, sem alterar o
> conteúdo original. `sed` (stream editor) vai além, permitindo transformar o texto — mais
> comumente usado para substituições (`s/antigo/novo/`), mas também suporta apagar linhas,
> inserir texto, entre outras operações.

### 2. Por que usar `sed -i` exige cuidado especial?

- [ ] `-i` não tem efeito nenhum
- [x] `-i` edita o arquivo diretamente (in place), substituindo o conteúdo original — sem backup, a mudança é irreversível
- [ ] `-i` só funciona em arquivos vazios
- [ ] `-i` sempre pede confirmação antes de alterar

> Sem `-i`, `sed` apenas imprime o resultado da transformação no terminal, sem alterar o arquivo
> original — permitindo conferir o resultado antes de aplicá-lo de fato. Com `-i`, a alteração é
> gravada diretamente no arquivo, sem confirmação e (em muitos sistemas) sem backup automático.

### 3. O que `$1`, `$2` representam dentro de um comando `awk`?

- [ ] Argumentos passados ao script, como em Bash comum
- [x] O primeiro, segundo (etc.) CAMPO de cada linha, separados pelo delimitador configurado (espaço por padrão)
- [ ] O nome e o caminho do arquivo processado
- [ ] O número da linha atual

> Dentro de `awk`, `$0` é a linha inteira, e `$1`, `$2`, etc. são os campos individuais daquela
> linha, divididos pelo separador de campo (`FS`, espaço por padrão, ou configurável com `-F`) —
> muito diferente do significado de `$1` em um script Bash comum (que seria um argumento de linha
> de comando).

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "grep, sed e awk básico" na trilha de Bash do CodePath. Contexto: o capítulo
> explica busca com grep, substituição com sed e processamento de colunas com awk. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
