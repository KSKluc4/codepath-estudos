---
numero: 2
titulo: "WHERE"
nivel: "basico"
objetivo: "Filtrar linhas de resultado com a cláusula WHERE."
duracao: 10
status: "completo"
---

## Conceito

`WHERE` filtra **quais linhas** entram no resultado de uma consulta, com base em uma condição.
Diferente de `SELECT` (que decide quais colunas aparecem), `WHERE` decide quais linhas — ele é
avaliado antes de qualquer ordenação ou agrupamento. Usaremos a mesma tabela `funcionarios` do
capítulo anterior.

## Sintaxe

```sql
SELECT * FROM funcionarios WHERE salario > 7000;

SELECT * FROM funcionarios
WHERE departamento = 'Engenharia' AND salario > 8000;
```

## Exemplos comentados

```sql
-- Comparações: = != (ou <>) > < >= <=
SELECT * FROM funcionarios WHERE cargo = 'Gerente';
SELECT * FROM funcionarios WHERE salario >= 8000;
SELECT * FROM funcionarios WHERE departamento != 'Vendas';

-- Operadores lógicos: AND, OR, NOT
SELECT * FROM funcionarios
WHERE departamento = 'Engenharia' AND salario > 8000;

SELECT * FROM funcionarios
WHERE cargo = 'Gerente' OR cargo = 'Designer';

SELECT * FROM funcionarios
WHERE NOT departamento = 'Vendas'; -- equivalente a != 'Vendas'

-- BETWEEN: verifica se um valor está dentro de uma faixa (inclusive)
SELECT * FROM funcionarios WHERE salario BETWEEN 6000 AND 9000;

-- IN: verifica se o valor está em uma lista de opções (evita vários OR)
SELECT * FROM funcionarios WHERE departamento IN ('Engenharia', 'Produto');
-- equivalente a: WHERE departamento = 'Engenharia' OR departamento = 'Produto'

-- LIKE: busca por padrão em texto. % = qualquer sequência, _ = um único caractere
SELECT * FROM funcionarios WHERE nome LIKE 'A%';    -- começa com "A"
SELECT * FROM funcionarios WHERE nome LIKE '%a';     -- termina com "a"
SELECT * FROM funcionarios WHERE nome LIKE '%an%';   -- contém "an" em qualquer posição

-- IS NULL / IS NOT NULL: comparar com NULL exige sintaxe especial
-- (NULL representa "ausência de valor" — "coluna = NULL" NUNCA é verdadeiro em SQL)
SELECT * FROM funcionarios WHERE data_contratacao IS NOT NULL;

-- Combinando várias condições, com parênteses para controlar a precedência
SELECT * FROM funcionarios
WHERE (departamento = 'Engenharia' OR departamento = 'Produto')
  AND salario > 7000;
```

## Exercício 1: Filtre por salário e departamento

Escreva uma consulta que retorna nome e cargo de funcionários do departamento `'Engenharia'` com
salário maior que `9000`.

### Solução

```sql
SELECT nome, cargo
FROM funcionarios
WHERE departamento = 'Engenharia' AND salario > 9000;
```

`AND` exige que **ambas** as condições sejam verdadeiras para a linha entrar no resultado — nesse
caso, apenas Carla (Engenharia, salario 12000) satisfaz ambas.

## Exercício 2: Busque nomes que começam com uma letra específica

Escreva uma consulta que retorna todos os funcionários cujo nome começa com a letra `"D"`, usando
`LIKE`.

### Solução

```sql
SELECT * FROM funcionarios WHERE nome LIKE 'D%';
```

O `%` depois do `D` casa com qualquer sequência de caracteres (inclusive nenhuma) que venha depois
— então `LIKE 'D%'` encontra qualquer nome que comece com "D", como "Diego". Para buscar um padrão
no meio do texto, o `%` seria colocado dos dois lados: `LIKE '%ie%'`.

## Quiz

### 1. Qual a diferença entre `AND` e `OR` em uma cláusula WHERE?

- [ ] São sinônimos
- [x] `AND` exige que TODAS as condições sejam verdadeiras; `OR` exige que PELO MENOS UMA seja verdadeira
- [ ] `OR` só funciona com números
- [ ] `AND` sempre retorna mais linhas que `OR`

> `AND` é mais restritivo (interseção das condições); `OR` é mais permissivo (união das
> condições). Misturar os dois na mesma cláusula sem parênteses pode gerar resultados inesperados,
> por isso é boa prática usar parênteses para deixar a precedência explícita.

### 2. O que `WHERE coluna = NULL` faz?

- [ ] Retorna as linhas onde `coluna` é nula
- [x] NUNCA retorna nenhuma linha — comparar com NULL usando `=` sempre resulta em "desconhecido", não "verdadeiro"
- [ ] Lança um erro de sintaxe
- [ ] É equivalente a `WHERE coluna IS NULL`

> `NULL` representa "ausência de valor" e não pode ser comparado com `=` (o resultado da
> comparação é sempre "desconhecido" em SQL, tratado como falso para fins de filtro). A forma
> correta de checar valores nulos é `WHERE coluna IS NULL` (ou `IS NOT NULL`).

### 3. O que `WHERE departamento IN ('Engenharia', 'Produto')` é equivalente a escrever?

- [ ] `WHERE departamento = 'Engenharia' AND departamento = 'Produto'`
- [x] `WHERE departamento = 'Engenharia' OR departamento = 'Produto'`
- [ ] `WHERE departamento != 'Engenharia' AND departamento != 'Produto'`
- [ ] Não é equivalente a nada, `IN` é uma sintaxe totalmente diferente

> `IN (lista)` é um atalho para uma série de comparações `OR` contra o mesmo valor — mais legível
> e conciso quando há várias opções possíveis, especialmente listas longas.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "WHERE" na trilha de SQL do CodePath. Contexto: o capítulo explica filtros com
> WHERE, operadores de comparação, AND/OR, BETWEEN, IN, LIKE e IS NULL. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
