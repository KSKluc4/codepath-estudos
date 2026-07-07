---
numero: 7
titulo: "JOINs (parte 2)"
nivel: "intermediario"
objetivo: "Explorar RIGHT JOIN, FULL JOIN e joins entre múltiplas tabelas."
duracao: 12
status: "completo"
---

## Conceito

Além de `INNER` e `LEFT JOIN`, existem `RIGHT JOIN` (o espelho do `LEFT JOIN`) e `FULL JOIN`
(combina o comportamento dos dois, preservando linhas sem correspondência de ambos os lados). Na
prática, `RIGHT JOIN` é usado com menos frequência do que `LEFT JOIN`, porque qualquer `RIGHT
JOIN` pode ser reescrito como um `LEFT JOIN` invertendo a ordem das tabelas — mas vale conhecer.
Também é comum encadear `JOIN`s entre três ou mais tabelas na mesma consulta.

Continuamos com `funcionarios` e `departamentos` do capítulo anterior.

## Sintaxe

```sql
SELECT f.nome, d.nome
FROM funcionarios f
RIGHT JOIN departamentos d ON f.departamento_id = d.id;

SELECT f.nome, d.nome
FROM funcionarios f
FULL JOIN departamentos d ON f.departamento_id = d.id;
```

## Exemplos comentados

```sql
-- RIGHT JOIN: mantém TODAS as linhas da tabela à DIREITA, mesmo sem correspondência à esquerda
SELECT f.nome, d.nome AS departamento
FROM funcionarios f
RIGHT JOIN departamentos d ON f.departamento_id = d.id;
-- Se existisse um departamento "Marketing" sem nenhum funcionário, ele ainda apareceria,
-- com f.nome = NULL

-- Qualquer RIGHT JOIN pode ser reescrito como LEFT JOIN invertendo a ordem das tabelas
-- (as duas consultas abaixo são equivalentes)
SELECT f.nome, d.nome FROM funcionarios f RIGHT JOIN departamentos d ON f.departamento_id = d.id;
SELECT f.nome, d.nome FROM departamentos d LEFT JOIN funcionarios f ON f.departamento_id = d.id;

-- FULL JOIN (ou FULL OUTER JOIN): união de LEFT e RIGHT — preserva linhas sem
-- correspondência de AMBOS os lados (não é suportado nativamente pelo MySQL,
-- que exige simular com UNION de um LEFT JOIN e um RIGHT JOIN)
SELECT f.nome, d.nome AS departamento
FROM funcionarios f
FULL JOIN departamentos d ON f.departamento_id = d.id;
-- inclui tanto Diego (sem departamento) quanto qualquer departamento sem funcionários

-- Encadeando JOINs entre 3+ tabelas
-- Tabela extra: projetos(id, nome, departamento_id)
SELECT f.nome AS funcionario, d.nome AS departamento, p.nome AS projeto
FROM funcionarios f
INNER JOIN departamentos d ON f.departamento_id = d.id
INNER JOIN projetos p ON p.departamento_id = d.id;

-- Self join: uma tabela relacionada a si mesma (comum para hierarquias, como "gerente")
-- funcionarios(id, nome, gerente_id) -- gerente_id referencia outro funcionário
SELECT f.nome AS funcionario, g.nome AS gerente
FROM funcionarios f
LEFT JOIN funcionarios g ON f.gerente_id = g.id;
```

## Exercício 1: Liste todos os departamentos, mesmo sem funcionários

Escreva uma consulta que retorna nome do departamento e nome do funcionário (ou `NULL`), garantindo
que TODOS os departamentos apareçam, mesmo os sem nenhum funcionário.

### Solução

```sql
SELECT d.nome AS departamento, f.nome AS funcionario
FROM funcionarios f
RIGHT JOIN departamentos d ON f.departamento_id = d.id;
```

`RIGHT JOIN` preserva todas as linhas da tabela à direita (`departamentos`), preenchendo `f.nome`
com `NULL` quando não há nenhum funcionário associado — equivalente a escrever `FROM departamentos
d LEFT JOIN funcionarios f ON ...`, apenas com a ordem das tabelas invertida.

## Exercício 2: Encadeie três tabelas

Considerando as tabelas `funcionarios`, `departamentos` e `projetos(id, nome,
departamento_id)`, escreva uma consulta que lista nome do funcionário, departamento e nomes dos
projetos daquele departamento.

### Solução

```sql
SELECT f.nome AS funcionario, d.nome AS departamento, p.nome AS projeto
FROM funcionarios f
INNER JOIN departamentos d ON f.departamento_id = d.id
INNER JOIN projetos p ON p.departamento_id = d.id;
```

Cada `INNER JOIN` adiciona mais uma tabela relacionada à consulta, seguindo a cadeia de chaves:
`funcionarios` liga a `departamentos` por `departamento_id`, e `departamentos` liga a `projetos`
pelo mesmo `departamento_id` — o resultado combina informações das três tabelas em cada linha.

## Quiz

### 1. Qual a relação entre `RIGHT JOIN` e `LEFT JOIN`?

- [ ] Não têm relação nenhuma
- [x] Qualquer `RIGHT JOIN` pode ser reescrito como `LEFT JOIN` trocando a ordem das tabelas
- [ ] `RIGHT JOIN` é mais rápido que `LEFT JOIN` sempre
- [ ] `RIGHT JOIN` não existe em SQL padrão

> `A RIGHT JOIN B` e `B LEFT JOIN A` produzem exatamente o mesmo resultado — por isso, na prática,
> muitos desenvolvedores usam apenas `LEFT JOIN` (organizando a ordem das tabelas na consulta) e
> raramente escrevem `RIGHT JOIN` explicitamente.

### 2. O que `FULL JOIN` preserva, diferente de `LEFT` ou `RIGHT JOIN` isoladamente?

- [ ] Nada a mais, é idêntico a `INNER JOIN`
- [x] Linhas sem correspondência de AMBOS os lados da junção, não apenas de um
- [ ] Apenas linhas duplicadas
- [ ] `FULL JOIN` só funciona com duas tabelas idênticas

> `FULL JOIN` (ou `FULL OUTER JOIN`) combina o comportamento de `LEFT` e `RIGHT JOIN`: mantém
> linhas sem correspondência tanto da tabela esquerda quanto da direita, preenchendo com `NULL` o
> lado que não tem par.

### 3. O que é um "self join"?

- [ ] Um erro de sintaxe, já que uma tabela não pode se juntar a si mesma
- [x] Um JOIN onde a mesma tabela é referenciada duas vezes, geralmente com aliases diferentes, para representar relações internas
- [ ] Um JOIN que sempre retorna a tabela inteira sem filtro
- [ ] Um tipo de índice, não relacionado a JOIN

> Self join é usado quando linhas de uma tabela se relacionam com outras linhas da MESMA tabela —
> como um funcionário que tem um `gerente_id` apontando para outro funcionário. A tabela é
> referenciada duas vezes na consulta, com aliases diferentes (`f` e `g`) para distinguir os dois
> "papéis".

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "JOINs (parte 2)" na trilha de SQL do CodePath. Contexto: o capítulo explica
> RIGHT JOIN, FULL JOIN, joins entre múltiplas tabelas e self joins. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
