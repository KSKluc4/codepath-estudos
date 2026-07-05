---
id: "m5-a5"
mes: 5
numero: 5
titulo: "Bancos de dados (SQL e NoSQL)"
objetivo: "Entender os fundamentos de bancos relacionais e não-relacionais e quando usar cada um."
duracao: 30
status: "completo"
---

## Onde os dados realmente vivem

Na aula 4, vimos que a "camada de dados" de uma arquitetura é responsável por salvar e recuperar
informação de forma persistente — ou seja, informação que continua existindo mesmo depois que o
programa é fechado ou o computador é reiniciado (diferente de uma variável na memória RAM, que some
quando o processo termina, retomando o mês 1). A ferramenta mais comum para essa persistência é um
**banco de dados**. Esta aula cobre os dois grandes estilos: **bancos relacionais (SQL)** e
**bancos não-relacionais (NoSQL)**.

## Bancos relacionais: dados em tabelas

Um banco de dados **relacional** organiza informação em **tabelas**, parecidas com planilhas: cada
tabela tem colunas fixas (definidas com antecedência) e linhas representando registros individuais.
Tabelas podem se **relacionar** entre si através de chaves.

```text
Tabela: clientes                    Tabela: pedidos
┌────┬─────────┬──────────┐        ┌────┬─────────────┬────────┐
│ id │ nome    │ email    │        │ id │ cliente_id  │ valor  │
├────┼─────────┼──────────┤        ├────┼─────────────┼────────┤
│ 1  │ Ana     │ ana@...  │        │ 10 │ 1           │ 150.00 │
│ 2  │ Bruno   │ bruno@..│        │ 11 │ 1           │ 90.00  │
└────┴─────────┴──────────┘        │ 12 │ 2           │ 300.00 │
                                     └────┴─────────────┴────────┘
```

A coluna `cliente_id` na tabela `pedidos` é uma **chave estrangeira**: ela aponta para o `id` (a
**chave primária**) de um registro na tabela `clientes`, estabelecendo a relação "este pedido pertence
a este cliente" sem precisar duplicar o nome e o e-mail do cliente em cada linha de pedido.

## SQL: a linguagem de consulta

**SQL** (*Structured Query Language*) é a linguagem usada para ler e escrever dados em um banco
relacional. Os comandos mais fundamentais:

```sql
-- Buscar todos os clientes
SELECT * FROM clientes;

-- Buscar apenas nome e email, filtrando por uma condição
SELECT nome, email FROM clientes WHERE id = 1;

-- Buscar pedidos junto com o nome do cliente correspondente (JOIN)
SELECT pedidos.valor, clientes.nome
FROM pedidos
JOIN clientes ON pedidos.cliente_id = clientes.id;
```

O **`JOIN`** é o comando que "atravessa" a relação entre duas tabelas: ele combina linhas de
`pedidos` com linhas de `clientes` sempre que `pedidos.cliente_id` corresponder ao `clientes.id`,
permitindo consultar informações que estão espalhadas por tabelas diferentes como se fosse uma única
tabela combinada. Sem o `JOIN`, seria necessário fazer duas consultas separadas e combinar os
resultados manualmente no código.

## Normalização: evitando dados duplicados e inconsistentes

**Normalização** é o processo de organizar tabelas para minimizar duplicação de dados. Considere a
alternativa **não normalizada**, com tudo em uma tabela só:

```text
Tabela: pedidos (não normalizada)
┌────┬──────────────┬────────────────┬────────┐
│ id │ cliente_nome │ cliente_email  │ valor  │
├────┼──────────────┼────────────────┼────────┤
│ 10 │ Ana          │ ana@...        │ 150.00 │
│ 11 │ Ana          │ ana@...        │ 90.00  │  <- nome/email duplicados
└────┴──────────────┴────────────────┴────────┘
```

Aqui, o nome e o e-mail de "Ana" aparecem duplicados em cada pedido dela. O problema não é só o
desperdício de espaço: se Ana atualizar seu e-mail, é preciso lembrar de atualizar **todas** as linhas
onde ele aparece — esquecer uma delas cria uma **inconsistência** (dois pedidos do mesmo cliente com
e-mails diferentes, sem forma de saber qual está correto). A versão normalizada, com uma tabela
`clientes` separada e referenciada por `cliente_id` (como vimos acima), guarda o e-mail em **um único
lugar**: atualizar o e-mail de Ana significa mudar uma única linha, e todos os pedidos automaticamente
"enxergam" o valor atualizado através da relação.

## NoSQL: quando o modelo de tabelas não encaixa bem

Bancos **NoSQL** ("not only SQL") abrangem vários estilos alternativos ao modelo relacional,
projetados para casos onde tabelas rígidas com colunas fixas não são a melhor forma de representar os
dados. O estilo mais comum é o **banco de documentos**, que guarda registros como objetos flexíveis
(parecidos com JSON), sem exigir que todos os registros tenham exatamente as mesmas colunas:

```json
{
  "_id": 1,
  "nome": "Ana",
  "pedidos": [
    { "valor": 150.00, "itens": ["livro", "caneta"] },
    { "valor": 90.00, "itens": ["caderno"] }
  ]
}
```

Aqui, os pedidos de Ana já vêm **aninhados** dentro do próprio documento do cliente, sem precisar de
um `JOIN` para juntar informações de duas tabelas — tudo relacionado a um cliente específico já está
agrupado em um único lugar, o que pode tornar certas consultas mais rápidas e simples (buscar "tudo
sobre o cliente X" é uma leitura só, sem relacionar tabelas).

## SQL vs. NoSQL: quando usar cada um

| | SQL (relacional) | NoSQL (documentos, por exemplo) |
|---|-------------------|-----------------------------------|
| Estrutura | Tabelas com colunas fixas, definidas antecipadamente | Flexível; registros podem ter formatos diferentes entre si |
| Relações | Fortes, via chaves estrangeiras e `JOIN` | Geralmente aninhadas dentro do próprio documento |
| Consistência | Forte — regras e relações aplicadas rigidamente pelo banco | Frequentemente mais flexível, priorizando velocidade/escala |
| Bom para | Dados com relações bem definidas e que exigem consistência forte (sistemas financeiros, estoque) | Dados com estrutura variável ou que mudam com frequência (perfis de usuário, conteúdo de um app) |

Não existe um vencedor universal entre os dois — a escolha depende de como os dados se relacionam e
de quais garantias o sistema precisa. Um sistema bancário, por exemplo, se beneficia da consistência
rígida e das relações bem definidas do SQL (não se pode "quase" debitar uma conta corretamente); já um
sistema que armazena preferências de usuário, com campos que variam bastante de usuário para usuário,
pode se beneficiar da flexibilidade de um banco de documentos.

## Exercício 1: Escreva uma consulta SQL

Usando as tabelas `clientes` e `pedidos` mostradas na aula, escreva uma consulta SQL que devolva o
nome de cada cliente junto com o valor de cada pedido que ele fez, ordenado pelo maior valor de
pedido primeiro.

### Solução

```sql
SELECT clientes.nome, pedidos.valor
FROM pedidos
JOIN clientes ON pedidos.cliente_id = clientes.id
ORDER BY pedidos.valor DESC;
```

O `JOIN` combina cada linha de `pedidos` com a linha correspondente de `clientes` (comparando
`cliente_id` com `id`), permitindo selecionar colunas de ambas as tabelas em uma única consulta. O
`ORDER BY pedidos.valor DESC` ordena o resultado do maior valor para o menor (`DESC` = decrescente).

## Exercício 2: Identifique o problema de normalização

A tabela abaixo guarda pedidos, repetindo o endereço de entrega do cliente em cada linha:

```text
┌────┬─────────────┬────────────────────┬────────┐
│ id │ cliente_nome│ endereco_entrega    │ valor  │
├────┼─────────────┼────────────────────┼────────┤
│ 10 │ Bruno       │ Rua A, 100          │ 300.00 │
│ 11 │ Bruno       │ Rua A, 100          │ 120.00 │
└────┴─────────────┴────────────────────┴────────┘
```

Se Bruno se mudar, qual problema pode ocorrer com essa estrutura? Como uma tabela `clientes` separada
resolveria isso?

### Solução

Se Bruno se mudar, seria necessário **atualizar o endereço em todas as linhas de pedidos** onde ele
aparece. Esquecer de atualizar uma delas gera uma **inconsistência**: dois pedidos do mesmo cliente
mostrando endereços de entrega diferentes, sem clareza de qual é o correto (ou se um deles é
proposital, como um endereço de entrega antigo específico daquele pedido). Uma tabela `clientes`
separada, guardando o endereço atual em uma única linha, e referenciada pelos pedidos via
`cliente_id`, garante que atualizar o endereço de Bruno uma única vez seja suficiente — todos os
pedidos que referenciam esse cliente automaticamente "enxergam" o endereço atualizado através da
relação, sem duplicação nem risco de inconsistência.

## Exercício 3: SQL ou NoSQL?

Para cada cenário abaixo, decida se um banco relacional (SQL) ou um banco de documentos (NoSQL) seria
mais adequado, e justifique:

1. Um sistema bancário que precisa garantir que toda transferência debite uma conta e credite outra
   de forma absolutamente consistente.
2. Um aplicativo onde cada usuário pode configurar um conjunto bem diferente de preferências e
   campos personalizados de perfil.

### Solução

1. **SQL (relacional)** — sistemas financeiros exigem consistência forte e relações bem definidas
   entre contas e transações; o modelo relacional, com suas garantias rígidas e chaves estrangeiras,
   é adequado para evitar cenários onde um débito acontece sem o crédito correspondente.
2. **NoSQL (documentos)** — como os campos variam bastante entre usuários diferentes, forçar um
   esquema de tabela rígido, com colunas fixas para cada possível preferência, seria custoso e pouco
   flexível. Um banco de documentos permite que cada perfil de usuário tenha uma estrutura levemente
   diferente, sem exigir que todos os registros compartilhem exatamente as mesmas colunas.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Bancos de dados (SQL e NoSQL)" do meu curso de programação. Contexto: a aula
> explica bancos relacionais (tabelas, chaves estrangeiras, `JOIN`), normalização de dados, bancos
> NoSQL (documentos flexíveis) e quando escolher cada modelo. Minha dúvida/meu exercício: [descreva
> aqui exatamente onde travou].

## Quiz

### 1. O que é uma chave estrangeira em um banco relacional?

- [ ] Uma senha usada para acessar o banco de dados
- [x] Uma coluna que aponta para a chave primária de outra tabela, estabelecendo uma relação entre elas
- [ ] Um tipo de índice usado apenas em bancos NoSQL
- [ ] Um comando SQL para criar tabelas

> A chave estrangeira (como `cliente_id` na tabela `pedidos`) referencia a chave primária de outra
> tabela (`id` em `clientes`), permitindo relacionar registros de tabelas diferentes sem duplicar dados.

### 2. O que o comando `JOIN` do SQL faz?

- [ ] Cria uma nova tabela vazia
- [x] Combina linhas de duas (ou mais) tabelas com base em uma relação entre elas
- [ ] Apaga registros de uma tabela
- [ ] Ordena os resultados de uma consulta

> `JOIN` permite consultar dados espalhados por tabelas diferentes como se fossem uma única tabela
> combinada, usando a relação entre chave primária e chave estrangeira.

### 3. Qual é o principal risco de não normalizar um banco de dados, duplicando informações como o e-mail de um cliente em várias linhas?

- [ ] O banco de dados fica mais rápido, mas usa mais memória
- [x] Atualizar essa informação exige mudar todas as linhas duplicadas, e esquecer uma delas gera inconsistência
- [ ] O SQL deixa de funcionar corretamente
- [ ] Não há nenhum risco real, apenas um estilo diferente de organização

> Sem normalização, uma mesma informação duplicada em várias linhas pode ficar inconsistente se
> apenas algumas das cópias forem atualizadas, sem garantia de que todas reflitam o mesmo valor.

### 4. O que caracteriza um banco de dados NoSQL do tipo "documentos"?

- [ ] Ele só pode ser usado para guardar arquivos de texto
- [x] Ele guarda registros como objetos flexíveis, que podem ter estruturas diferentes entre si, sem exigir colunas fixas
- [ ] Ele não permite nenhum tipo de consulta
- [ ] Ele é sempre mais lento que um banco relacional

> Bancos de documentos permitem que cada registro tenha um formato próprio, ao contrário de tabelas
> relacionais, que exigem que todas as linhas sigam o mesmo conjunto fixo de colunas.

### 5. Em qual cenário um banco relacional (SQL) costuma ser mais adequado do que um NoSQL?

- [ ] Quando os dados de cada registro variam muito de estrutura entre si
- [x] Quando os dados têm relações bem definidas entre entidades e exigem consistência forte, como em um sistema financeiro
- [ ] Quando não existe nenhuma relação entre os dados
- [ ] SQL nunca é mais adequado do que NoSQL em nenhum cenário

> Sistemas que dependem de relações bem definidas e garantias rígidas de consistência (como um débito
> sempre corresponder a um crédito) se beneficiam do modelo relacional e de suas regras estruturadas.
