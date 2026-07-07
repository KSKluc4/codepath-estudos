---
numero: 3
titulo: "Permissões"
nivel: "basico"
objetivo: "Entender e alterar permissões de arquivos com chmod e chown."
duracao: 10
status: "completo"
---

## Conceito

Todo arquivo/diretório em sistemas Unix (Linux, macOS) tem permissões separadas para três grupos:
o **dono** (owner), o **grupo** (group) e **outros** (others), cada um com direitos de leitura
(`r`), escrita (`w`) e execução (`x`). `ls -l` mostra essas permissões; `chmod` altera quem pode
fazer o quê, e `chown` altera quem é o dono.

## Sintaxe

```bash
ls -l arquivo.txt          # mostra as permissões atuais
chmod 755 script.sh          # altera permissões (notação numérica)
chown ana arquivo.txt          # altera o dono do arquivo
```

## Exemplos comentados

```bash
ls -l notas.txt
# -rw-r--r-- 1 ana staff 1024 Mar 15 10:30 notas.txt
#  ^^^^^^^^^
#  posição 1: tipo (- = arquivo, d = diretório)
#  posições 2-4: permissões do DONO    (rw-)
#  posições 5-7: permissões do GRUPO    (r--)
#  posições 8-10: permissões de OUTROS   (r--)

# r (read) = 4, w (write) = 2, x (execute) = 1 — soma para cada grupo
chmod 644 notas.txt   # dono: rw- (4+2=6), grupo: r-- (4), outros: r-- (4)
chmod 755 script.sh    # dono: rwx (4+2+1=7), grupo: r-x (4+1=5), outros: r-x (5)
chmod 600 segredo.txt   # dono: rw-, grupo: ---, outros: --- (só o dono acessa)

# Notação simbólica: mais legível para mudanças pontuais
chmod +x script.sh      # adiciona permissão de execução para TODOS
chmod u+x script.sh      # adiciona execução só para o dono (user)
chmod g-w arquivo.txt      # remove permissão de escrita do grupo
chmod o=r arquivo.txt        # define permissão de "outros" como somente leitura

# Permissão de execução é OBRIGATÓRIA para rodar um script diretamente
./script.sh
# bash: ./script.sh: Permission denied   <- sem +x
chmod +x script.sh
./script.sh   # agora funciona

# chown: altera o DONO (e opcionalmente o grupo) de um arquivo
chown ana arquivo.txt        # muda o dono para "ana"
chown ana:staff arquivo.txt   # muda dono E grupo de uma vez
# geralmente exige sudo, já que só o dono atual ou root pode transferir a posse

# Em diretórios, "x" tem um significado especial: permite ENTRAR (cd) no diretório,
# não "executá-lo" como um programa
chmod +x pasta/   # sem isso, "cd pasta" seria negado mesmo com permissão de leitura
```

## Exercício 1: Torne um script executável

Você criou um arquivo `deploy.sh` e tentou rodá-lo com `./deploy.sh`, mas recebeu "Permission
denied". Escreva o comando que resolve isso.

### Solução

```bash
chmod +x deploy.sh
./deploy.sh
```

Por padrão, arquivos criados (por exemplo, com um editor de texto) não têm permissão de execução.
`chmod +x` adiciona essa permissão para todos os grupos (dono, grupo e outros), permitindo rodar o
script diretamente com `./deploy.sh`.

## Exercício 2: Restrinja o acesso a um arquivo sensível

Escreva o comando `chmod` (notação numérica) que configura um arquivo `chave_privada.pem` para que
apenas o dono possa ler e escrever nele, sem nenhuma permissão para grupo ou outros.

### Solução

```bash
chmod 600 chave_privada.pem
```

`600` decompõe em: dono = `rw-` (4+2=6), grupo = `---` (0), outros = `---` (0). Esse é o padrão
recomendado para arquivos sensíveis como chaves privadas — muitas ferramentas (como o cliente SSH)
inclusive recusam usar uma chave privada com permissões mais abertas que essa, por segurança.

## Quiz

### 1. O que os três grupos de permissão em Unix representam?

- [ ] Leitura, escrita e exclusão
- [x] Dono (owner), grupo (group) e outros (others)
- [ ] Administrador, usuário comum e convidado
- [ ] Local, rede e nuvem

> Toda permissão Unix é dividida em três "quem": o dono do arquivo, o grupo associado a ele, e
> todos os demais usuários do sistema (outros) — cada um com seu próprio conjunto de permissões de
> leitura/escrita/execução.

### 2. O que `chmod 755 script.sh` configura?

- [ ] Apenas leitura para todos
- [x] Dono com leitura/escrita/execução (rwx); grupo e outros com leitura/execução (r-x)
- [ ] Ninguém pode acessar o arquivo
- [ ] Apenas o dono pode ler, ninguém mais tem acesso

> `7` = `rwx` (4+2+1), `5` = `r-x` (4+1). Então `755` dá ao dono controle total (ler, escrever,
> executar), e a grupo/outros permissão de ler e executar, mas não modificar — uma configuração
> comum para scripts que devem ser executáveis por qualquer um, mas editáveis só pelo dono.

### 3. O que significa a permissão de execução (`x`) em um DIRETÓRIO, diferente de um arquivo?

- [ ] Permite "rodar" o diretório como um programa
- [x] Permite entrar no diretório (com `cd`) e acessar seus arquivos, mesmo com permissão de leitura
- [ ] Não tem efeito nenhum em diretórios
- [ ] Torna o diretório oculto

> Em diretórios, `x` controla se é possível "atravessar" (entrar) naquele diretório — sem essa
> permissão, mesmo tendo `r` (leitura, que permite listar o conteúdo com `ls`), comandos como `cd
> pasta` ou acessar arquivos dentro dela são negados.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Permissões" na trilha de Bash do CodePath. Contexto: o capítulo explica
> permissões de dono/grupo/outros, chmod (numérico e simbólico) e chown. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
