---
numero: 12
titulo: "find"
nivel: "avancado"
objetivo: "Localizar arquivos por nome, tipo e data com find."
duracao: 12
status: "completo"
---

## Conceito

`find` percorre recursivamente uma árvore de diretórios procurando arquivos/pastas que satisfazem
critérios: nome, tipo, tamanho, data de modificação, entre outros. É muito mais poderoso que `ls`
para buscas — e, combinado com `-exec` ou um pipe, permite agir diretamente sobre os arquivos
encontrados.

## Sintaxe

```bash
find caminho -name "padrao"
find . -type f -name "*.log"
```

## Exemplos comentados

```bash
# Buscar por nome (aceita padrões glob, entre aspas para evitar expansão prematura pelo shell)
find . -name "*.txt"                # todos os .txt, a partir do diretório atual
find /home -name "config*"            # arquivos começando com "config" em /home
find . -iname "*.TXT"                   # -iname: ignora maiúsculas/minúsculas

# Filtrar por tipo: f (arquivo comum), d (diretório), l (link simbólico)
find . -type f -name "*.sh"           # só arquivos .sh (não diretórios com esse nome)
find . -type d -name "node_modules"     # diretórios chamados node_modules

# Filtrar por data de modificação
find . -mtime -7           # modificados nos últimos 7 dias
find . -mtime +30            # modificados há mais de 30 dias
find . -newer arquivo.txt      # modificados depois de arquivo.txt

# Filtrar por tamanho
find . -size +100M          # arquivos maiores que 100 MB
find . -size -1k              # arquivos menores que 1 KB

# Combinando critérios (AND é o padrão entre condições)
find . -type f -name "*.log" -mtime +30    # logs com mais de 30 dias

# -exec: executa um comando para cada resultado encontrado
find . -name "*.tmp" -exec rm {} \;         # remove cada arquivo .tmp encontrado
# {} é substituído pelo caminho de cada arquivo; \; marca o fim do comando -exec

find . -name "*.sh" -exec chmod +x {} \;      # torna todos os scripts .sh executáveis

# Combinando find com xargs (alternativa a -exec, geralmente mais rápida para muitos arquivos)
find . -name "*.tmp" | xargs rm

# Limitar a profundidade da busca
find . -maxdepth 1 -type f    # só arquivos DIRETAMENTE no diretório atual, sem entrar em subpastas

# -delete: forma mais direta (e perigosa) de apagar direto pelo find
# find . -name "*.tmp" -delete
```

## Exercício 1: Encontre todos os arquivos .log

Escreva um comando `find` que localiza todos os arquivos `.log` a partir do diretório atual,
incluindo subdiretórios.

### Solução

```bash
find . -type f -name "*.log"
```

`.` indica que a busca começa no diretório atual, percorrendo recursivamente todos os
subdiretórios por padrão. `-type f` garante que apenas arquivos comuns sejam listados (não
diretórios que por acaso tenham ".log" no nome), e `-name "*.log"` filtra pelo padrão do nome.

## Exercício 2: Remova arquivos temporários antigos

Escreva um comando `find` que localiza arquivos `.tmp` modificados há mais de 7 dias e os remove,
usando `-exec`.

### Solução

```bash
find . -name "*.tmp" -mtime +7 -exec rm {} \;
```

`-mtime +7` filtra arquivos cuja última modificação foi há mais de 7 dias. `-exec rm {} \;`
executa `rm` para cada arquivo encontrado, substituindo `{}` pelo caminho de cada um — o `\;` no
final é obrigatório para marcar onde o comando `-exec` termina, já que ele poderia, em teoria,
receber mais argumentos depois.

## Quiz

### 1. O que `find . -type f -name "*.txt"` procura?

- [ ] Todos os arquivos e diretórios chamados "*.txt"
- [x] Apenas arquivos comuns (não diretórios) cujo nome termina em ".txt"
- [ ] Apenas o primeiro arquivo .txt encontrado
- [ ] Arquivos .txt apenas no diretório atual, ignorando subpastas

> `-type f` restringe o resultado a arquivos comuns, excluindo diretórios (mesmo que, por algum
> motivo estranho, um diretório se chamasse "algo.txt"). `find` também percorre subdiretórios
> recursivamente por padrão, a menos que `-maxdepth` limite essa profundidade.

### 2. O que `{}` representa dentro de `-exec comando {} \;`?

- [ ] Um bloco de código vazio
- [x] É substituído pelo caminho de CADA arquivo encontrado pelo find, um de cada vez
- [ ] Representa o diretório atual
- [ ] É opcional e pode ser omitido sem alterar o comportamento

> Para cada resultado que o `find` localizar, `-exec` roda o comando especificado substituindo
> `{}` pelo caminho completo daquele arquivo — assim, `find . -name "*.tmp" -exec rm {} \;`
> executa `rm caminho/arquivo.tmp` uma vez para cada arquivo `.tmp` encontrado.

### 3. O que `-mtime +30` filtra?

- [ ] Arquivos criados há exatamente 30 dias
- [x] Arquivos cuja última modificação ocorreu há MAIS de 30 dias
- [ ] Arquivos modificados nos últimos 30 minutos
- [ ] Arquivos com exatamente 30 caracteres no nome

> `-mtime` filtra por tempo de modificação em dias. O sinal importa: `+30` significa "mais de 30
> dias atrás" (mais antigos), `-30` significa "menos de 30 dias atrás" (mais recentes), e `30`
> sozinho (sem sinal) significa "exatamente 30 dias atrás".

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "find" na trilha de Bash do CodePath. Contexto: o capítulo explica busca por
> nome/tipo/data/tamanho com find, e a execução de comandos com -exec. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
