---
numero: 3
titulo: "ORDER BY"
nivel: "basico"
objetivo: "Ordenar resultados de consulta com ORDER BY."
duracao: 8
status: "completo"
---

## Conceito

Sem `ORDER BY`, a ordem das linhas retornadas por uma consulta **não é garantida** — o banco pode
devolvê-las em qualquer sequência, geralmente relacionada à ordem física de armazenamento (que pode
mudar). `ORDER BY` ordena explicitamente o resultado por uma ou mais colunas, de forma crescente
(`ASC`, o padrão) ou decrescente (`DESC`).

## Sintaxe

```sql
SELECT * FROM funcionarios ORDER BY salario;         -- crescente (padrão)
SELECT * FROM funcionarios ORDER BY salario DESC;      -- decrescente
```

## Exemplos comentados

```sql
-- Ordenar por uma coluna, crescente (ASC é o padrão, pode ser omitido)
SELECT nome, salario FROM funcionarios ORDER BY salario ASC;

-- Ordenar decrescente
SELECT nome, salario FROM funcionarios ORDER BY salario DESC;

-- Ordenar por múltiplas colunas: a segunda serve de "desempate" da primeira
SELECT nome, departamento, salario
FROM funcionarios
ORDER BY departamento ASC, salario DESC;
-- agrupa visualmente por departamento (A-Z), e dentro de cada um, do maior salário para o menor

-- Ordenar por uma coluna calculada
SELECT nome, salario, salario * 12 AS salario_anual
FROM funcionarios
ORDER BY salario_anual DESC;

-- Ordenar por posição da coluna no SELECT (funciona, mas prejudica a legibilidade — evite)
SELECT nome, salario FROM funcionarios ORDER BY 2 DESC; -- ordena pela 2ª coluna (salario)

-- Combinando com WHERE e LIMIT: útil para "top N" consultas
SELECT nome, salario
FROM funcionarios
WHERE departamento = 'Engenharia'
ORDER BY salario DESC
LIMIT 1; -- funcionário com maior salário da Engenharia

-- NULLs em ORDER BY: por padrão, muitos bancos colocam NULL por último em ASC
-- (o comportamento exato varia entre PostgreSQL, MySQL, SQL Server — sempre teste)
```

## Exercício 1: Liste funcionários do mais bem pago ao menos bem pago

Escreva uma consulta que retorna nome e salário de todos os funcionários, ordenados do maior para
o menor salário.

### Solução

```sql
SELECT nome, salario FROM funcionarios ORDER BY salario DESC;
```

`DESC` inverte a ordenação padrão (crescente) para decrescente — sem ele, o resultado viria do
menor para o maior salário.

## Exercício 2: Ordene por departamento e depois por nome

Escreva uma consulta que retorna nome e departamento de todos os funcionários, ordenados
primeiro por departamento (A-Z) e, dentro de cada departamento, por nome (A-Z).

### Solução

```sql
SELECT nome, departamento
FROM funcionarios
ORDER BY departamento ASC, nome ASC;
```

Quando `ORDER BY` recebe múltiplas colunas, a segunda só é usada para desempatar linhas que têm o
mesmo valor na primeira — nesse caso, dentro de cada departamento, os funcionários aparecem em
ordem alfabética de nome.

## Quiz

### 1. O que acontece com a ordem das linhas de uma consulta SEM `ORDER BY`?

- [ ] Sempre vem em ordem alfabética pela primeira coluna
- [x] Não há garantia de ordem — pode variar entre execuções, dependendo de fatores internos do banco
- [ ] Sempre vem na ordem em que os dados foram inseridos
- [ ] O banco recusa executar a consulta

> Sem uma cláusula `ORDER BY` explícita, o SQL não garante nenhuma ordem específica no resultado.
> Embora, na prática, muitas vezes pareça seguir a ordem de inserção, isso não é garantido pelo
> padrão e pode mudar (por exemplo, após uma reorganização de índices) — para depender de uma
> ordem, sempre use `ORDER BY`.

### 2. Ao ordenar por duas colunas, `ORDER BY departamento, salario DESC`, o que `DESC` afeta?

- [ ] Ambas as colunas, `departamento` e `salario`
- [x] Apenas `salario` (a coluna imediatamente antes do `DESC`); `departamento` continua em ordem crescente
- [ ] Nenhuma das colunas
- [ ] É um erro de sintaxe usar DESC em apenas uma coluna

> Cada coluna em `ORDER BY` pode ter sua própria direção (`ASC` ou `DESC`), independente das
> outras. Se `DESC` não for repetido para cada coluna, ele se aplica apenas à coluna imediatamente
> anterior a ele na lista.

### 3. Como combinar `ORDER BY` com `LIMIT` para obter o "funcionário mais bem pago"?

- [ ] `LIMIT` sozinho já ordena os resultados automaticamente
- [x] `ORDER BY salario DESC LIMIT 1` — ordenar decrescente e pegar só a primeira linha
- [ ] `ORDER BY salario ASC LIMIT 1`
- [ ] Não é possível combinar ORDER BY com LIMIT

> `LIMIT` sozinho não garante nenhuma ordenação específica — ele apenas trunca o número de linhas
> retornadas, na ordem em que o banco as produz. Para um "top N" (como o mais bem pago), é preciso
> ordenar primeiro (`ORDER BY salario DESC`) e só então limitar (`LIMIT 1`), pegando a primeira
> linha do resultado já ordenado.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "ORDER BY" na trilha de SQL do CodePath. Contexto: o capítulo explica ordenação
> com ASC/DESC, múltiplas colunas de ordenação e a combinação com LIMIT. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
