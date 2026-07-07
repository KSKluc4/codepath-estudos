---
numero: 4
titulo: "Funções agregadas"
nivel: "basico"
objetivo: "Resumir dados com COUNT, SUM, AVG, MIN e MAX."
duracao: 10
status: "completo"
---

## Conceito

Funções agregadas resumem várias linhas em um único valor: contar quantas linhas existem, somar
uma coluna, calcular a média, encontrar o maior/menor valor. São essenciais para responder
perguntas como "quantos funcionários temos?" ou "qual a folha salarial total?" sem precisar
processar os dados manualmente fora do banco.

## Sintaxe

```sql
SELECT COUNT(*) FROM funcionarios;         -- quantas linhas existem
SELECT SUM(salario) FROM funcionarios;      -- soma total
SELECT AVG(salario) FROM funcionarios;       -- média
SELECT MIN(salario), MAX(salario) FROM funcionarios; -- menor e maior valor
```

## Exemplos comentados

```sql
-- COUNT(*): conta todas as linhas, independente de valores nulos
SELECT COUNT(*) FROM funcionarios; -- 4

-- COUNT(coluna): conta apenas linhas onde aquela coluna NÃO é NULL
SELECT COUNT(data_contratacao) FROM funcionarios;

-- COUNT(DISTINCT coluna): conta valores ÚNICOS
SELECT COUNT(DISTINCT departamento) FROM funcionarios; -- 3 (Engenharia, Produto, Vendas)

-- SUM: soma os valores de uma coluna numérica
SELECT SUM(salario) AS folha_salarial FROM funcionarios; -- 33700

-- AVG: calcula a média
SELECT AVG(salario) AS media_salarial FROM funcionarios; -- 8425

-- MIN e MAX funcionam com números, texto e datas
SELECT MIN(salario), MAX(salario) FROM funcionarios;
SELECT MIN(data_contratacao) AS contratacao_mais_antiga FROM funcionarios;
SELECT MIN(nome), MAX(nome) FROM funcionarios; -- ordem alfabética para texto

-- Combinando várias agregações na mesma consulta
SELECT
    COUNT(*) AS total_funcionarios,
    SUM(salario) AS folha_total,
    AVG(salario) AS media_salarial,
    MAX(salario) AS maior_salario
FROM funcionarios;

-- Agregações combinadas com WHERE: o filtro é aplicado ANTES da agregação
SELECT AVG(salario) AS media_engenharia
FROM funcionarios
WHERE departamento = 'Engenharia';

-- ROUND arredonda o resultado de cálculos, comum junto de AVG
SELECT ROUND(AVG(salario), 2) AS media_arredondada FROM funcionarios;
```

## Exercício 1: Calcule a folha salarial total

Escreva uma consulta que retorna a soma de todos os salários da tabela `funcionarios`, nomeando o
resultado como `folha_total`.

### Solução

```sql
SELECT SUM(salario) AS folha_total FROM funcionarios;
```

`SUM(coluna)` soma os valores de `salario` de todas as linhas retornadas pela consulta (nesse caso,
todas as linhas da tabela, já que não há `WHERE`). O alias `AS folha_total` só nomeia a coluna
resultante, tornando o resultado mais legível.

## Exercício 2: Conte quantos funcionários ganham acima da média

Escreva uma consulta que conta quantos funcionários têm salário maior que `8000`.

### Solução

```sql
SELECT COUNT(*) AS acima_de_8000
FROM funcionarios
WHERE salario > 8000;
```

O `WHERE` filtra as linhas **antes** de `COUNT(*)` contá-las — o resultado é o número de linhas que
sobraram após o filtro (Ana com 8500 e Carla com 12000, então `2`), não o total geral da tabela.

## Quiz

### 1. Qual a diferença entre `COUNT(*)` e `COUNT(coluna)`?

- [ ] Não há diferença
- [x] `COUNT(*)` conta todas as linhas; `COUNT(coluna)` conta apenas linhas onde aquela coluna não é NULL
- [ ] `COUNT(coluna)` é sempre mais rápido
- [ ] `COUNT(*)` só funciona em tabelas sem valores nulos

> `COUNT(*)` conta o número total de linhas, sem se importar com valores nulos em nenhuma coluna
> específica. `COUNT(coluna)` ignora linhas onde aquela coluna específica é `NULL` — se
> `data_contratacao` fosse nula em alguma linha, `COUNT(data_contratacao)` retornaria um número
> menor que `COUNT(*)`.

### 2. Em uma consulta com `WHERE` e uma função agregada, qual é aplicado primeiro?

- [ ] A função agregada, depois o WHERE
- [x] O WHERE filtra as linhas primeiro; a agregação (COUNT, SUM, AVG, etc.) processa apenas o que sobrou
- [ ] Ambos são aplicados simultaneamente, sem ordem definida
- [ ] Depende do banco de dados usado

> `WHERE` sempre é avaliado antes de qualquer agregação: ele decide quais linhas "sobrevivem" ao
> filtro, e só então funções como `SUM`, `COUNT` e `AVG` operam sobre esse subconjunto já
> filtrado.

### 3. O que `COUNT(DISTINCT departamento)` retorna, considerando a tabela do capítulo (Engenharia, Produto, Engenharia, Vendas)?

- [ ] `4`, o total de linhas
- [x] `3`, o número de valores ÚNICOS de departamento
- [ ] `1`, apenas o primeiro departamento encontrado
- [ ] Um erro, `DISTINCT` não pode ser usado dentro de `COUNT`

> `DISTINCT` dentro de `COUNT` elimina duplicatas antes de contar — mesmo havendo 4 funcionários,
> apenas 3 departamentos distintos aparecem entre eles (Engenharia aparece duas vezes, mas é
> contada uma única vez).

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Funções agregadas" na trilha de SQL do CodePath. Contexto: o capítulo explica
> COUNT, SUM, AVG, MIN, MAX e a ordem de avaliação com WHERE. Minha dúvida/meu exercício: [descreva
> aqui exatamente onde travou].
