---
numero: 10
titulo: "Arquivos"
nivel: "intermediario"
objetivo: "Ler e escrever arquivos de texto com open() e o gerenciador de contexto with."
duracao: 12
status: "completo"
---

## Conceito

Python lê e escreve arquivos com a função embutida `open()`. A forma recomendada é sempre usar o
bloco `with`, que garante que o arquivo será fechado automaticamente ao final — mesmo se ocorrer um
erro no meio do processo. Sem `with`, é fácil esquecer de chamar `arquivo.close()` e deixar o
arquivo "preso" (ou perder dados que ainda estavam no buffer de escrita).

## Sintaxe

```python
# Leitura
with open("dados.txt", "r") as arquivo:
    conteudo = arquivo.read()

# Escrita (sobrescreve o arquivo inteiro)
with open("saida.txt", "w") as arquivo:
    arquivo.write("Olá, arquivo!")

# Anexar ao final do arquivo, sem apagar o que já existia
with open("log.txt", "a") as arquivo:
    arquivo.write("Nova linha de log\n")
```

## Exemplos comentados

```python
# "r" = leitura (padrão), "w" = escrita (sobrescreve), "a" = append, "x" = criar (erro se já existir)

# Ler linha por linha, sem carregar o arquivo inteiro na memória de uma vez
with open("dados.txt", "r") as arquivo:
    for linha in arquivo:
        print(linha.strip())  # .strip() remove o \n do final de cada linha

# Ler todas as linhas como uma lista
with open("dados.txt", "r") as arquivo:
    linhas = arquivo.readlines()  # ['linha 1\n', 'linha 2\n', ...]

# Escrever múltiplas linhas
linhas_para_salvar = ["primeira linha", "segunda linha", "terceira linha"]
with open("saida.txt", "w") as arquivo:
    for linha in linhas_para_salvar:
        arquivo.write(linha + "\n")

# Lidar com arquivo que pode não existir
try:
    with open("nao_existe.txt", "r") as arquivo:
        conteudo = arquivo.read()
except FileNotFoundError:
    print("Arquivo não encontrado")

# Trabalhar com CSV usa o módulo csv da biblioteca padrão, em vez de split(",") manual
import csv
with open("dados.csv", "r") as arquivo:
    leitor = csv.reader(arquivo)
    for linha in leitor:
        print(linha)  # cada linha já vem como uma lista de valores
```

## Exercício 1: Conte as linhas de um arquivo

Escreva uma função `contar_linhas(caminho)` que abre um arquivo de texto e retorna quantas linhas
ele tem.

### Solução

```python
def contar_linhas(caminho):
    with open(caminho, "r") as arquivo:
        return len(arquivo.readlines())

# total = contar_linhas("dados.txt")
```

`readlines()` retorna uma lista onde cada elemento é uma linha do arquivo, então `len()` sobre essa
lista dá o total de linhas diretamente. Para arquivos muito grandes, seria mais eficiente contar
com um loop (`for linha in arquivo: contador += 1`) para não carregar tudo na memória de uma vez —
mas para arquivos pequenos, `readlines()` é simples e direto.

## Exercício 2: Grave um relatório

Escreva código que recebe um dicionário de vendas `vendas = {"janeiro": 1500, "fevereiro": 2300}` e
grava um arquivo `relatorio.txt` com uma linha por item, no formato `"mês: valor"`.

### Solução

```python
vendas = {"janeiro": 1500, "fevereiro": 2300}

with open("relatorio.txt", "w") as arquivo:
    for mes, valor in vendas.items():
        arquivo.write(f"{mes}: {valor}\n")
```

Cada chamada a `.write()` grava exatamente o texto passado, sem adicionar quebra de linha
automaticamente — por isso é preciso incluir o `\n` manualmente no final de cada linha, como no
`print()` implícito de outras linguagens.

## Quiz

### 1. Por que usar `with open(...)` em vez de `arquivo = open(...)` seguido de `.close()` manual?

- [ ] `with` é mais rápido para ler arquivos grandes
- [x] `with` garante que o arquivo será fechado mesmo se ocorrer um erro no meio do código
- [ ] `open()` sem `with` não funciona em Python 3
- [ ] Não há diferença nenhuma

> O bloco `with` usa um "gerenciador de contexto" que fecha o arquivo automaticamente ao sair do
> bloco — inclusive se uma exceção for lançada no meio da leitura/escrita. Fechar manualmente exige
> lembrar de chamar `.close()` em todo caminho possível do código, inclusive nos de erro.

### 2. O que o modo `"w"` faz ao abrir um arquivo que já existe?

- [ ] Adiciona o novo conteúdo ao final, preservando o que já existia
- [x] Apaga todo o conteúdo existente antes de escrever
- [ ] Lança um erro porque o arquivo já existe
- [ ] Abre em modo somente leitura

> O modo `"w"` (write) sobrescreve o arquivo inteiro. Para adicionar conteúdo sem apagar o
> existente, use o modo `"a"` (append).

### 3. Qual exceção o Python lança ao tentar abrir para leitura um arquivo que não existe?

- [ ] `ValueError`
- [ ] `TypeError`
- [x] `FileNotFoundError`
- [ ] `KeyError`

> `FileNotFoundError` é a exceção específica lançada quando `open()` é chamado em modo leitura
> (`"r"`) sobre um caminho que não existe no sistema de arquivos.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Arquivos" na trilha de Python do CodePath. Contexto: o capítulo explica open(),
> os modos de abertura (r, w, a) e o uso do bloco with para leitura/escrita segura. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
