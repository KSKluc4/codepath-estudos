---
numero: 1
titulo: "SELECT"
nivel: "basico"
objetivo: "Consultar dados de uma tabela com SELECT."
duracao: 10
status: "completo"
---

## Conceito

SQL (Structured Query Language) é a linguagem usada para consultar e manipular dados em bancos
relacionais. `SELECT` é o comando mais básico e mais usado: ele lê dados de uma ou mais tabelas,
sem alterá-los. Diferente de linguagens de programação "imperativas", SQL é **declarativo**: você
descreve **o que** quer obter, não o passo a passo de como obter.

Os exemplos deste capítulo (e da maioria dos seguintes) usam uma tabela `funcionarios`:

```
id | nome     | cargo          | departamento | salario | data_contratacao
1  | Ana      | Desenvolvedora | Engenharia   | 8500    | 2022-03-15
2  | Bruno    | Designer       | Produto      | 7200    | 2021-11-01
3  | Carla    | Gerente        | Engenharia   | 12000   | 2019-06-20
4  | Diego    | Analista        | Vendas       | 6000    | 2023-01-10
```

## Sintaxe

```sql
SELECT coluna1, coluna2 FROM tabela;
SELECT * FROM tabela;  -- * seleciona TODAS as colunas
```

## Exemplos comentados

```sql
-- Selecionar todas as colunas de todos os funcionários
SELECT * FROM funcionarios;

-- Selecionar apenas colunas específicas
SELECT nome, cargo FROM funcionarios;

-- Renomear uma coluna no resultado com AS (alias)
SELECT nome AS nome_completo, salario AS remuneracao FROM funcionarios;

-- Expressões calculadas: SELECT pode incluir operações, não só colunas cruas
SELECT nome, salario, salario * 12 AS salario_anual FROM funcionarios;

-- DISTINCT remove linhas duplicadas do resultado
SELECT DISTINCT departamento FROM funcionarios;
-- Retorna cada departamento uma única vez: Engenharia, Produto, Vendas

-- LIMIT restringe quantas linhas retornam (útil para explorar tabelas grandes)
SELECT * FROM funcionarios LIMIT 2;

-- Concatenar texto (a sintaxe varia entre bancos: || é padrão ANSI/PostgreSQL,
-- CONCAT() funciona na maioria, incluindo MySQL e SQL Server)
SELECT nome || ' - ' || cargo AS resumo FROM funcionarios;
```

## Exercício 1: Selecione nome e salário

Escreva uma consulta que retorna apenas as colunas `nome` e `salario` de todos os funcionários.

### Solução

```sql
SELECT nome, salario FROM funcionarios;
```

Listar as colunas explicitamente (em vez de usar `*`) é considerado boa prática: a consulta fica
mais previsível e não retorna colunas desnecessárias, especialmente importante em tabelas com
muitas colunas ou quando o resultado alimenta outro sistema.

## Exercício 2: Liste departamentos únicos com um alias

Escreva uma consulta que retorna a lista de departamentos únicos (sem repetição), nomeando a
coluna do resultado como `setor`.

### Solução

```sql
SELECT DISTINCT departamento AS setor FROM funcionarios;
```

`DISTINCT` elimina linhas duplicadas do resultado — sem ele, a consulta retornaria "Engenharia"
duas vezes (uma para Ana, outra para Carla). O `AS setor` só renomeia a coluna na saída do
resultado, sem afetar a tabela original de forma alguma.

## Quiz

### 1. O que `SELECT *` retorna?

- [ ] Apenas a primeira coluna da tabela
- [x] Todas as colunas de todas as linhas da tabela
- [ ] Apenas linhas com valores repetidos
- [ ] Um erro de sintaxe

> `*` é um curinga que representa "todas as colunas" na cláusula `SELECT`. Embora conveniente para
> explorar dados rapidamente, listar colunas explicitamente é geralmente preferido em consultas de
> produção, por clareza e performance.

### 2. Para que serve `DISTINCT`?

- [ ] Ordena o resultado
- [x] Remove linhas duplicadas do resultado, mantendo apenas valores únicos
- [ ] Limita o número de linhas retornadas
- [ ] Renomeia colunas

> `SELECT DISTINCT coluna FROM tabela` retorna cada valor único da coluna apenas uma vez, mesmo
> que ele apareça em múltiplas linhas da tabela original.

### 3. SQL é uma linguagem declarativa ou imperativa?

- [ ] Imperativa: você descreve o passo a passo exato de como buscar os dados
- [x] Declarativa: você descreve o que quer obter, e o banco decide como buscar
- [ ] Nenhuma das duas, SQL não é uma linguagem de programação
- [ ] Depende do banco de dados usado

> Em SQL, você especifica o resultado desejado (`SELECT nome FROM funcionarios WHERE ...`), e o
> motor do banco de dados (o "otimizador de consultas") decide internamente a estratégia mais
> eficiente para produzir esse resultado — diferente de escrever um loop manual percorrendo
> registros, como seria em uma linguagem imperativa.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "SELECT" na trilha de SQL do CodePath. Contexto: o capítulo explica a cláusula
> SELECT, aliases (AS), DISTINCT e LIMIT. Minha dúvida/meu exercício: [descreva aqui exatamente
> onde travou].
