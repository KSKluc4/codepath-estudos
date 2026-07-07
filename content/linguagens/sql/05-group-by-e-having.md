---
numero: 5
titulo: "GROUP BY e HAVING"
nivel: "intermediario"
objetivo: "Agrupar linhas e filtrar grupos com GROUP BY e HAVING."
duracao: 12
status: "completo"
---

## Conceito

`GROUP BY` agrupa linhas que compartilham o mesmo valor em uma (ou mais) colunas, permitindo
aplicar funções agregadas **por grupo** em vez de sobre a tabela inteira — por exemplo, "quantos
funcionários há em CADA departamento" em vez de "quantos funcionários há no total". `HAVING`
filtra **grupos** depois da agregação, assim como `WHERE` filtra linhas antes dela — é a principal
diferença entre os dois.

## Sintaxe

```sql
SELECT departamento, COUNT(*) AS total
FROM funcionarios
GROUP BY departamento;

SELECT departamento, AVG(salario) AS media
FROM funcionarios
GROUP BY departamento
HAVING AVG(salario) > 7000;
```

## Exemplos comentados

```sql
-- Contar funcionários por departamento
SELECT departamento, COUNT(*) AS total_funcionarios
FROM funcionarios
GROUP BY departamento;
-- Engenharia | 2
-- Produto    | 1
-- Vendas     | 1

-- Toda coluna no SELECT que não é uma função agregada PRECISA estar no GROUP BY
SELECT departamento, AVG(salario) AS media_salarial
FROM funcionarios
GROUP BY departamento;
-- SELECT departamento, cargo, AVG(salario) FROM funcionarios GROUP BY departamento;
-- ERRO: "cargo" não está no GROUP BY nem é uma agregação

-- HAVING filtra GRUPOS, depois da agregação (diferente de WHERE, que filtra LINHAS antes)
SELECT departamento, AVG(salario) AS media_salarial
FROM funcionarios
GROUP BY departamento
HAVING AVG(salario) > 7000; -- só departamentos com média acima de 7000

-- WHERE e HAVING podem ser combinados: WHERE filtra linhas ANTES de agrupar,
-- HAVING filtra grupos DEPOIS de agrupar
SELECT departamento, COUNT(*) AS total
FROM funcionarios
WHERE data_contratacao > '2020-01-01' -- filtra linhas primeiro
GROUP BY departamento
HAVING COUNT(*) >= 1; -- depois filtra os grupos resultantes

-- Agrupar por múltiplas colunas
SELECT departamento, cargo, COUNT(*) AS total
FROM funcionarios
GROUP BY departamento, cargo;

-- Ordenar o resultado agrupado (ORDER BY vem sempre por último)
SELECT departamento, COUNT(*) AS total
FROM funcionarios
GROUP BY departamento
ORDER BY total DESC;
```

## Exercício 1: Conte funcionários por departamento

Escreva uma consulta que retorna cada departamento e quantos funcionários ele tem.

### Solução

```sql
SELECT departamento, COUNT(*) AS total_funcionarios
FROM funcionarios
GROUP BY departamento;
```

`GROUP BY departamento` agrupa as linhas por valor de departamento, e `COUNT(*)` conta quantas
linhas caíram em cada grupo — o resultado tem uma linha por departamento distinto, não uma linha
por funcionário.

## Exercício 2: Encontre departamentos com média salarial alta

Escreva uma consulta que retorna apenas os departamentos cuja média salarial é maior que `7000`.

### Solução

```sql
SELECT departamento, AVG(salario) AS media_salarial
FROM funcionarios
GROUP BY departamento
HAVING AVG(salario) > 7000;
```

`HAVING AVG(salario) > 7000` filtra os GRUPOS já calculados — não seria possível usar `WHERE
AVG(salario) > 7000` para isso, porque `WHERE` é avaliado antes de a agregação existir, quando o
banco ainda não tem o valor médio calculado por departamento.

## Quiz

### 1. Qual a principal diferença entre `WHERE` e `HAVING`?

- [ ] Não há diferença, são sinônimos
- [x] `WHERE` filtra linhas ANTES do agrupamento; `HAVING` filtra grupos DEPOIS da agregação
- [ ] `HAVING` só pode ser usado sem `GROUP BY`
- [ ] `WHERE` é mais lento que `HAVING`

> `WHERE` opera sobre as linhas originais da tabela, antes de qualquer agrupamento acontecer.
> `HAVING` opera sobre os grupos já formados (e suas agregações já calculadas) — por isso é a
> ferramenta certa para filtrar com base em `COUNT`, `AVG`, `SUM`, etc.

### 2. O que acontece ao incluir uma coluna no SELECT que não está no GROUP BY nem dentro de uma função agregada?

- [ ] O banco escolhe um valor qualquer daquela coluna automaticamente
- [x] A maioria dos bancos rejeita a consulta com um erro, por ser ambíguo qual valor mostrar para aquela coluna dentro de cada grupo
- [ ] A consulta funciona normalmente, sempre
- [ ] A coluna é ignorada silenciosamente

> Como `GROUP BY` colapsa várias linhas em um único grupo, qualquer coluna que não seja parte do
> agrupamento (nem resultado de uma agregação) teria múltiplos valores possíveis dentro do mesmo
> grupo — SQL padrão (e a maioria dos bancos) exige que toda coluna do `SELECT` seja ou parte do
> `GROUP BY`, ou o resultado de uma função agregada.

### 3. Em uma consulta com `WHERE`, `GROUP BY` e `HAVING` juntos, qual é a ordem lógica de avaliação?

- [ ] HAVING, depois WHERE, depois GROUP BY
- [x] WHERE (filtra linhas) → GROUP BY (agrupa) → HAVING (filtra grupos)
- [ ] GROUP BY, depois HAVING, depois WHERE
- [ ] A ordem não importa, todos são avaliados ao mesmo tempo

> Conceitualmente, SQL processa nessa ordem: primeiro filtra as linhas relevantes com `WHERE`,
> depois agrupa o que sobrou com `GROUP BY` (calculando as agregações), e só então filtra os
> grupos resultantes com `HAVING` — mesmo que a ordem de escrita na consulta seja diferente dessa
> ordem de execução.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "GROUP BY e HAVING" na trilha de SQL do CodePath. Contexto: o capítulo explica
> agrupamento de linhas, agregações por grupo e a diferença entre WHERE e HAVING. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
