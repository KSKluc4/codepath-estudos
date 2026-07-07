---
numero: 5
titulo: "Variáveis"
nivel: "basico"
objetivo: "Declarar e usar variáveis em scripts Bash."
duracao: 10
status: "completo"
---

## Conceito

Variáveis em Bash guardam valores de texto que podem ser reutilizados em comandos e scripts. A
sintaxe é sensível a detalhes que surpreendem quem vem de outras linguagens: **não pode haver
espaço** ao redor do `=` na atribuição, e usar o valor da variável exige o prefixo `$`.

## Sintaxe

```bash
nome="Ana"          # atribuição: SEM espaços ao redor do =
echo "$nome"          # uso: COM o prefixo $
```

## Exemplos comentados

```bash
nome="Ana"
idade=28

echo $nome            # Ana
echo "$nome"           # Ana (aspas duplas: recomendado, evita problemas com espaços)
echo '$nome'            # $nome (aspas simples NÃO interpolam variáveis!)

# nome = "Ana"  # ERRO: Bash interpretaria como o comando "nome" com argumentos "=" e "Ana"

# Variáveis de ambiente já existentes no shell
echo $HOME              # diretório home do usuário
echo $USER               # nome do usuário atual
echo $PATH                 # lista de diretórios onde o shell procura executáveis

# Concatenar strings: basta colocar lado a lado
saudacao="Olá, ${nome}!"
echo "$saudacao"   # Olá, Ana!
# ${nome} (com chaves) evita ambiguidade quando colado a outro texto: "${nome}s" != "$names"

# Comando entre $() captura a SAÍDA do comando como valor (command substitution)
data_atual=$(date +%Y-%m-%d)
echo "Hoje é $data_atual"

arquivos=$(ls | wc -l)
echo "Existem $arquivos arquivos aqui"

# export torna a variável disponível para processos FILHOS (sub-shells, scripts chamados)
export API_KEY="abc123"

# readonly impede que a variável seja reatribuída depois
readonly VERSAO="1.0.0"
# VERSAO="2.0.0"  # erro: VERSAO: readonly variable

# Variáveis "locais" (por convenção, minúsculas) vs. de ambiente (por convenção, MAIÚSCULAS)
```

## Exercício 1: Guarde e reutilize um valor

Escreva um script de duas linhas que guarda seu nome em uma variável e imprime
`"Bem-vindo(a), <nome>!"`.

### Solução

```bash
nome="Bia"
echo "Bem-vindo(a), $nome!"
```

`$nome` dentro das aspas duplas é interpolado (substituído pelo valor da variável) antes do `echo`
exibir o texto — resultando em `"Bem-vindo(a), Bia!"`. Usar aspas duplas em vez de nenhuma aspa
é a prática recomendada, especialmente se o valor puder conter espaços.

## Exercício 2: Capture a saída de um comando

Escreva um script que guarda o número de arquivos `.txt` no diretório atual em uma variável
`total`, e imprime `"Encontrados X arquivos .txt"`.

### Solução

```bash
total=$(ls *.txt 2>/dev/null | wc -l)
echo "Encontrados $total arquivos .txt"
```

`$(comando)` executa o comando e substitui a expressão inteira pelo texto que ele produziu na
saída — aqui, `ls *.txt | wc -l` conta quantos arquivos `.txt` existem, e esse número é guardado
em `total`. `2>/dev/null` descarta a mensagem de erro que `ls` produziria caso não houvesse nenhum
arquivo `.txt` (evitando que ela apareça misturada com o resultado).

## Quiz

### 1. Por que `nome = "Ana"` (com espaços ao redor do `=`) causa erro em Bash?

- [ ] Bash não permite variáveis com esse nome
- [x] Bash interpretaria "nome" como um comando a ser executado, com "=" e "Ana" como argumentos — não como uma atribuição
- [ ] `"Ana"` precisa estar sem aspas
- [ ] Não é um erro, funciona normalmente

> Diferente da maioria das linguagens de programação, a sintaxe de atribuição em Bash não permite
> nenhum espaço ao redor do `=`. Com espaços, o shell interpreta a linha como uma tentativa de
> executar um comando chamado `nome`, passando `=` e `Ana` como argumentos separados.

### 2. Qual a diferença entre usar aspas duplas (`"$nome"`) e aspas simples (`'$nome'`)?

- [ ] Não há diferença
- [x] Aspas duplas permitem interpolação de variáveis (substituem `$nome` pelo valor); aspas simples tratam tudo literalmente, sem interpolar
- [ ] Aspas simples são mais rápidas
- [ ] Aspas duplas só funcionam com números

> Dentro de aspas duplas, `$variavel` é substituído pelo seu valor antes de o comando ser
> executado. Dentro de aspas simples, o texto é tratado 100% literalmente — `'$nome'` imprimiria
> literalmente `$nome`, sem nenhuma substituição.

### 3. Para que serve `$(comando)` (command substitution)?

- [ ] Executa o comando em segundo plano
- [x] Captura a SAÍDA do comando e a usa como um valor, geralmente atribuído a uma variável
- [ ] Comenta a linha, ignorando o comando
- [ ] Só funciona dentro de scripts, nunca no terminal interativo

> `$(comando)` roda o comando e substitui a expressão inteira pelo texto que ele imprimiu na saída
> padrão — é assim que se "guarda" o resultado de um comando em uma variável, como em
> `data=$(date +%Y-%m-%d)`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Variáveis" na trilha de Bash do CodePath. Contexto: o capítulo explica
> atribuição sem espaços, uso com $, aspas duplas vs. simples, e command substitution com $().
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
