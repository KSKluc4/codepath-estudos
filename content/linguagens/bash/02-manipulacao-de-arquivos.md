---
numero: 2
titulo: "Manipulação de arquivos"
nivel: "basico"
objetivo: "Criar, copiar, mover e remover arquivos e diretórios pelo terminal."
duracao: 10
status: "completo"
---

## Conceito

O terminal oferece comandos diretos para as operações básicas de arquivo que você faria em um
gerenciador gráfico: criar, copiar, mover/renomear e apagar. A vantagem é a velocidade e a
possibilidade de combinar esses comandos em scripts — mas também exige mais cuidado, já que
`rm` (remover) não tem lixeira por padrão: o que é apagado no terminal geralmente é apagado de
verdade.

## Sintaxe

```bash
touch arquivo.txt        # cria um arquivo vazio
mkdir pasta                # cria um diretório
cp origem destino           # copia
mv origem destino            # move ou renomeia
rm arquivo.txt                 # remove um arquivo
```

## Exemplos comentados

```bash
touch notas.txt              # cria um arquivo vazio (ou atualiza a data, se já existir)
mkdir projetos                # cria um diretório
mkdir -p projetos/sub/pasta     # -p cria diretórios pai que ainda não existem, sem erro

cp notas.txt backup.txt          # copia notas.txt para backup.txt
cp -r pasta_origem pasta_destino  # -r (recursivo) é OBRIGATÓRIO para copiar diretórios

mv backup.txt notas_antigas.txt   # mv também RENOMEIA (é copiar + apagar o original)
mv notas.txt projetos/              # mv também MOVE para outro diretório

rm notas_antigas.txt                 # remove um arquivo (SEM lixeira, é definitivo!)
rm -r pasta_temporaria/                # remove um diretório e todo o conteúdo, recursivamente
rm -rf pasta_temporaria/                # -f força, sem pedir confirmação — MUITO CUIDADO com isso
rmdir pasta_vazia                        # remove um diretório, mas SÓ se estiver vazio

# cat mostra o conteúdo de um arquivo de texto direto no terminal
cat notas.txt

# Redirecionar a saída de um comando para criar/sobrescrever um arquivo (mais no próximo capítulo)
echo "primeira linha" > notas.txt

# Sempre confira o que rm -rf vai apagar ANTES de rodar, com ls primeiro
ls pasta_temporaria/     # confira o conteúdo
rm -rf pasta_temporaria/  # só então apague
```

## Exercício 1: Crie uma estrutura de pastas

Escreva o comando que cria a estrutura `projeto/src/utils` de uma vez, mesmo que `projeto` e
`projeto/src` ainda não existam.

### Solução

```bash
mkdir -p projeto/src/utils
```

A flag `-p` (parents) faz `mkdir` criar todos os diretórios intermediários necessários no caminho,
sem lançar erro caso algum deles já exista — sem essa flag, `mkdir projeto/src/utils` falharia se
`projeto` ou `projeto/src` ainda não existissem.

## Exercício 2: Copie um diretório inteiro com segurança

Escreva o comando que copia recursivamente o diretório `configuracoes/` para
`configuracoes_backup/`, e o comando que confirma o resultado listando o novo diretório.

### Solução

```bash
cp -r configuracoes/ configuracoes_backup/
ls configuracoes_backup/
```

A flag `-r` (recursive) é obrigatória para copiar um diretório e todo o seu conteúdo — `cp`
sozinho, sem `-r`, recusa copiar diretórios e mostra um erro. Conferir com `ls` depois confirma
que a cópia realmente ocorreu como esperado.

## Quiz

### 1. Por que `rm` exige cuidado especial no terminal?

- [ ] `rm` não funciona em diretórios, apenas em arquivos
- [x] Diferente de arrastar para a lixeira em uma interface gráfica, `rm` apaga permanentemente, sem forma fácil de desfazer
- [ ] `rm` sempre pede confirmação antes de apagar
- [ ] `rm` só funciona com permissão de administrador

> Por padrão, `rm` não move arquivos para uma lixeira — a remoção é imediata e, na maioria dos
> sistemas, não há forma trivial de recuperar o arquivo depois. Combinar `rm` com `-rf` (recursivo
> e forçado) sem checar antes é uma das formas mais comuns de perder dados acidentalmente no
> terminal.

### 2. Qual a diferença entre `cp` e `mv`?

- [ ] Não há diferença, são sinônimos
- [x] `cp` cria uma cópia, mantendo o original; `mv` move (ou renomeia), sem manter o arquivo na posição original
- [ ] `mv` só funciona com diretórios
- [ ] `cp` sempre exige a flag `-r`

> `cp origem destino` duplica o arquivo/diretório, deixando o original intacto. `mv origem
> destino` efetivamente "move" o arquivo para o novo local (ou nome) — o arquivo não existe mais
> na localização/nome original depois do comando, já que `mv` é, na prática, implementado como
> copiar + apagar o original.

### 3. Por que `cp` exige a flag `-r` para copiar um diretório?

- [ ] É uma limitação, `cp` não pode copiar diretórios em nenhuma circunstância
- [x] Copiar um diretório significa copiar recursivamente todo seu conteúdo (subpastas e arquivos); `-r` sinaliza essa intenção explicitamente
- [ ] `-r` só é necessário em sistemas Windows
- [ ] `-r` torna a cópia mais rápida

> Sem `-r`, `cp` assume que você quer copiar um único arquivo, e recusa operar sobre um diretório
> (que pode conter uma árvore inteira de subpastas e arquivos) — exigir `-r` explicitamente evita
> cópias acidentais de estruturas grandes.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Manipulação de arquivos" na trilha de Bash do CodePath. Contexto: o capítulo
> explica touch, mkdir, cp, mv e rm, incluindo as flags -p, -r e -f. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
