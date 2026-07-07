---
numero: 8
titulo: "Subqueries"
nivel: "intermediario"
objetivo: "Escrever consultas aninhadas (subqueries) dentro de outras consultas."
duracao: 12
status: "completo"
---

## Conceito

Uma subquery (subconsulta) é uma consulta `SELECT` dentro de outra consulta, usada quando o
resultado de uma busca depende do resultado de outra. Subqueries podem aparecer em `WHERE` (para
filtrar), em `FROM` (como se fosse uma tabela temporária) ou em `SELECT` (como uma coluna
calculada). Muitas subqueries podem ser reescritas como `JOIN` — a escolha costuma ser uma questão
de legibilidade.

## Sintaxe

```sql
SELECT nome FROM funcionarios
WHERE salario > (SELECT AVG(salario) FROM funcionarios);
```

## Exemplos comentados

```sql
-- Subquery em WHERE: filtra com base em um valor calculado por outra consulta
SELECT nome, salario
FROM funcionarios
WHERE salario > (SELECT AVG(salario) FROM funcionarios);
-- retorna quem ganha acima da média geral

-- Subquery com IN: compara contra uma LISTA de valores retornada por outra consulta
SELECT nome
FROM funcionarios
WHERE departamento_id IN (
    SELECT id FROM departamentos WHERE orcamento > 250000
);
-- funcionários de departamentos com orçamento alto

-- Subquery com EXISTS: verifica se a subconsulta retorna PELO MENOS uma linha
SELECT d.nome
FROM departamentos d
WHERE EXISTS (
    SELECT 1 FROM funcionarios f WHERE f.departamento_id = d.id
);
-- departamentos que têm pelo menos um funcionário

-- Subquery em FROM: tratada como uma tabela temporária
SELECT departamento_id, media_salario
FROM (
    SELECT departamento_id, AVG(salario) AS media_salario
    FROM funcionarios
    GROUP BY departamento_id
) AS medias
WHERE media_salario > 7000;

-- Subquery escalar em SELECT: retorna um único valor, usado como coluna calculada
SELECT
    nome,
    salario,
    (SELECT AVG(salario) FROM funcionarios) AS media_geral
FROM funcionarios;

-- Subquery correlacionada: referencia a consulta EXTERNA, roda uma vez por linha
SELECT f.nome, f.salario
FROM funcionarios f
WHERE f.salario > (
    SELECT AVG(f2.salario)
    FROM funcionarios f2
    WHERE f2.departamento_id = f.departamento_id
);
-- funcionários que ganham acima da média do PRÓPRIO departamento
```

## Exercício 1: Funcionários acima da média geral

Escreva uma consulta que retorna nome e salário dos funcionários que ganham mais que a média
salarial geral da empresa, usando uma subquery.

### Solução

```sql
SELECT nome, salario
FROM funcionarios
WHERE salario > (SELECT AVG(salario) FROM funcionarios);
```

A subquery `(SELECT AVG(salario) FROM funcionarios)` é calculada primeiro, produzindo um único
número (a média geral) — a consulta externa então compara o salário de cada funcionário contra
esse valor fixo.

## Exercício 2: Departamentos sem nenhum funcionário

Escreva uma consulta que retorna o nome dos departamentos que NÃO têm nenhum funcionário
associado, usando `NOT EXISTS`.

### Solução

```sql
SELECT d.nome
FROM departamentos d
WHERE NOT EXISTS (
    SELECT 1 FROM funcionarios f WHERE f.departamento_id = d.id
);
```

Para cada departamento da consulta externa, a subquery correlacionada verifica se existe algum
funcionário com aquele `departamento_id`. `NOT EXISTS` inverte a lógica: mantém apenas os
departamentos onde essa subquery NÃO encontrou nenhuma linha — ou seja, sem funcionários.

## Quiz

### 1. O que uma subquery escalar (usada em `WHERE coluna > (SELECT ...)`) deve retornar?

- [ ] Múltiplas linhas e colunas, sem restrição
- [x] Um único valor (uma linha, uma coluna)
- [ ] Sempre uma tabela inteira
- [ ] Um erro de sintaxe, subqueries não podem ser usadas em WHERE

> Quando uma subquery é comparada diretamente com um operador como `>`, `=` ou `<`, ela precisa
> retornar exatamente um valor — se retornasse múltiplas linhas, o banco não saberia com qual
> comparar, e lançaria um erro em tempo de execução.

### 2. Qual a diferença entre `IN (subquery)` e `EXISTS (subquery)`?

- [ ] São idênticos em todos os casos
- [x] `IN` compara um valor contra uma LISTA retornada pela subquery; `EXISTS` só verifica se a subquery retorna alguma linha, sem comparar valores
- [ ] `EXISTS` só funciona com números
- [ ] `IN` não pode ser usado com subqueries

> `WHERE coluna IN (SELECT ...)` verifica se `coluna` está entre os valores retornados pela
> subquery. `WHERE EXISTS (SELECT ...)` ignora os valores retornados e só checa se existe pelo
> menos uma linha de resultado — geralmente mais eficiente quando só importa a existência, não os
> valores em si.

### 3. O que caracteriza uma subquery "correlacionada"?

- [ ] Uma subquery que não pode ser usada em `WHERE`
- [x] Uma subquery que referencia colunas da consulta externa, sendo reavaliada para cada linha processada
- [ ] Uma subquery que sempre retorna `NULL`
- [ ] Uma subquery que não pode conter `WHERE`

> Diferente de uma subquery independente (calculada uma única vez, como a média geral), uma
> subquery correlacionada usa uma coluna da consulta externa dentro de sua própria condição (como
> `f2.departamento_id = f.departamento_id`), o que faz com que ela seja recalculada para cada linha
> da consulta externa — mais poderosa, mas potencialmente mais custosa em tabelas grandes.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Subqueries" na trilha de SQL do CodePath. Contexto: o capítulo explica
> subqueries em WHERE/FROM/SELECT, IN, EXISTS e subqueries correlacionadas. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
