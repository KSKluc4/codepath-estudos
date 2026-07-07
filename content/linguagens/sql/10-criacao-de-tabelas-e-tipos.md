---
numero: 10
titulo: "Criação de tabelas e tipos"
nivel: "avancado"
objetivo: "Criar tabelas com CREATE TABLE e escolher tipos de dados adequados."
duracao: 12
status: "completo"
---

## Conceito

`CREATE TABLE` define a estrutura de uma tabela: nome, colunas e o tipo de dado de cada uma. Tipos
de dados variam um pouco entre bancos (PostgreSQL, MySQL, SQLite, SQL Server), mas as categorias
principais são as mesmas em todos: números inteiros, números decimais, texto, datas e booleanos.
Escolher o tipo certo evita desperdício de espaço e garante que o banco rejeite dados inválidos
automaticamente.

## Sintaxe

```sql
CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    salario DECIMAL(10, 2),
    data_contratacao DATE
);
```

## Exemplos comentados

```sql
CREATE TABLE departamentos (
    id INTEGER PRIMARY KEY,       -- chave primária: identifica cada linha de forma única
    nome VARCHAR(50) NOT NULL,     -- texto de tamanho variável, até 50 caracteres, obrigatório
    orcamento DECIMAL(12, 2)         -- número decimal com até 12 dígitos, 2 casas decimais
);

CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    salario DECIMAL(10, 2) DEFAULT 0,     -- valor padrão se omitido no INSERT
    ativo BOOLEAN DEFAULT TRUE,             -- true/false
    data_contratacao DATE,
    departamento_id INTEGER,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) -- assunto do próximo capítulo
);

-- Tipos numéricos comuns:
-- INTEGER / INT       -- número inteiro
-- BIGINT               -- inteiro de faixa maior
-- DECIMAL(p, s) / NUMERIC(p, s) -- decimal EXATO, p dígitos totais, s casas decimais (ideal para dinheiro)
-- FLOAT / REAL / DOUBLE -- ponto flutuante (evitar para valores monetários, por imprecisão)

-- Tipos de texto:
-- VARCHAR(n)  -- texto de tamanho variável, até n caracteres
-- CHAR(n)      -- texto de tamanho FIXO, sempre n caracteres (preenchido com espaços se menor)
-- TEXT          -- texto sem limite prático de tamanho

-- Tipos de data/hora:
-- DATE          -- apenas data (2024-03-15)
-- TIME           -- apenas hora (14:30:00)
-- TIMESTAMP       -- data e hora juntas

-- BOOLEAN: true/false (em alguns bancos, como versões antigas de MySQL, simulado com TINYINT)

-- Coluna com auto-incremento (a sintaxe varia MUITO entre bancos):
-- PostgreSQL: id SERIAL PRIMARY KEY  (ou GENERATED ALWAYS AS IDENTITY, mais moderno)
-- MySQL:      id INT AUTO_INCREMENT PRIMARY KEY
-- SQLite:     id INTEGER PRIMARY KEY AUTOINCREMENT

-- Remover uma tabela existente
DROP TABLE IF EXISTS tabela_antiga;

-- Alterar uma tabela já existente
ALTER TABLE funcionarios ADD COLUMN email VARCHAR(100);
ALTER TABLE funcionarios DROP COLUMN ativo;
```

## Exercício 1: Crie uma tabela de produtos

Escreva um `CREATE TABLE` para uma tabela `produtos` com: `id` (inteiro, chave primária), `nome`
(texto, até 100 caracteres, obrigatório), `preco` (decimal, 2 casas decimais) e `em_estoque`
(booleano, padrão `true`).

### Solução

```sql
CREATE TABLE produtos (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2),
    em_estoque BOOLEAN DEFAULT TRUE
);
```

Cada requisito do enunciado mapeia diretamente para uma cláusula: `PRIMARY KEY` marca `id` como
identificador único, `NOT NULL` torna `nome` obrigatório, `DECIMAL(10, 2)` permite valores
monetários com 2 casas decimais, e `DEFAULT TRUE` define o valor padrão de `em_estoque` quando
omitido em um `INSERT`.

## Exercício 2: Adicione uma coluna a uma tabela existente

Escreva um comando que adiciona uma coluna `email VARCHAR(100)` à tabela `funcionarios` já
existente.

### Solução

```sql
ALTER TABLE funcionarios ADD COLUMN email VARCHAR(100);
```

`ALTER TABLE` modifica a estrutura de uma tabela já criada, sem precisar recriá-la do zero (o que
apagaria os dados existentes). A nova coluna `email` é adicionada com valor `NULL` em todas as
linhas já existentes, já que não há como "adivinhar" esse dado para registros antigos.

## Quiz

### 1. Por que `DECIMAL(10, 2)` costuma ser preferido a `FLOAT` para representar valores monetários?

- [ ] `FLOAT` não existe na maioria dos bancos
- [x] `DECIMAL` representa valores decimais de forma EXATA; `FLOAT` pode ter pequenos erros de arredondamento por ser ponto flutuante binário
- [ ] `DECIMAL` é sempre mais rápido de processar
- [ ] Não há diferença prática entre os dois

> `FLOAT`/`REAL`/`DOUBLE` representam números usando ponto flutuante binário, que não consegue
> representar exatamente certos valores decimais (como `0.1`), levando a pequenos erros de
> arredondamento acumulados. `DECIMAL(precisao, escala)` armazena o número de forma exata, sendo a
> escolha recomendada sempre que precisão decimal exata importa, como em valores financeiros.

### 2. O que `NOT NULL` em uma definição de coluna garante?

- [ ] Que a coluna sempre terá o valor `0`
- [x] Que o banco rejeita qualquer tentativa de inserir ou atualizar aquela coluna com valor nulo
- [ ] Que a coluna não pode ser lida com SELECT
- [ ] Que a tabela não pode ter mais de uma linha

> `NOT NULL` é uma restrição (constraint) que impede a ausência de valor naquela coluna — qualquer
> `INSERT` ou `UPDATE` que tente deixar essa coluna sem valor (ou explicitamente `NULL`) é
> rejeitado pelo banco, garantindo a integridade dos dados desde a camada do banco, não só na
> aplicação.

### 3. Para que serve o comando `ALTER TABLE`?

- [ ] Para inserir novos dados em uma tabela
- [x] Para modificar a estrutura de uma tabela já existente, como adicionar ou remover colunas
- [ ] Para apagar uma tabela inteira
- [ ] Para consultar dados de uma tabela

> `ALTER TABLE` permite evoluir o schema de uma tabela sem precisar recriá-la (o que apagaria
> todos os dados) — operações comuns incluem `ADD COLUMN`, `DROP COLUMN`, alterar o tipo de uma
> coluna existente, ou adicionar/remover constraints.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Criação de tabelas e tipos" na trilha de SQL do CodePath. Contexto: o capítulo
> explica CREATE TABLE, os principais tipos de dados e ALTER TABLE. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
