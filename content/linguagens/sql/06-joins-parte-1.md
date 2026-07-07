---
numero: 6
titulo: "JOINs (parte 1)"
nivel: "intermediario"
objetivo: "Combinar tabelas com INNER JOIN e LEFT JOIN."
duracao: 12
status: "completo"
---

## Conceito

Bancos relacionais espalham dados em várias tabelas ligadas por chaves, em vez de repetir tudo em
uma tabela só (o assunto do capítulo de constraints explica o porquê). `JOIN` combina linhas de
duas tabelas com base em uma condição de relacionamento, geralmente comparando uma chave
estrangeira com a chave primária correspondente.

A partir deste capítulo, normalizamos o exemplo: `departamento` deixa de ser um texto solto em
`funcionarios` e vira uma tabela própria, referenciada por `departamento_id`.

```
departamentos:  id | nome        | orcamento
                1  | Engenharia  | 500000
                2  | Produto     | 300000
                3  | Vendas      | 200000

funcionarios:   id | nome  | departamento_id | salario
                1  | Ana   | 1               | 8500
                2  | Bruno | 2               | 7200
                3  | Carla | 1               | 12000
                4  | Diego | NULL            | 6000   -- ainda sem departamento definido
```

## Sintaxe

```sql
SELECT funcionarios.nome, departamentos.nome
FROM funcionarios
INNER JOIN departamentos ON funcionarios.departamento_id = departamentos.id;
```

## Exemplos comentados

```sql
-- INNER JOIN: retorna só as linhas que têm correspondência em AMBAS as tabelas
SELECT funcionarios.nome AS funcionario, departamentos.nome AS departamento
FROM funcionarios
INNER JOIN departamentos ON funcionarios.departamento_id = departamentos.id;
-- Diego (departamento_id NULL) NÃO aparece: não tem correspondência em departamentos

-- Aliases de tabela deixam a consulta mais curta e legível
SELECT f.nome AS funcionario, d.nome AS departamento
FROM funcionarios f
INNER JOIN departamentos d ON f.departamento_id = d.id;

-- LEFT JOIN: retorna TODAS as linhas da tabela da ESQUERDA, mesmo sem correspondência
-- (as colunas da tabela da direita vêm como NULL quando não há correspondência)
SELECT f.nome, d.nome AS departamento
FROM funcionarios f
LEFT JOIN departamentos d ON f.departamento_id = d.id;
-- Diego aparece, com departamento = NULL

-- LEFT JOIN é útil para encontrar registros "órfãos" (sem correspondência)
SELECT f.nome
FROM funcionarios f
LEFT JOIN departamentos d ON f.departamento_id = d.id
WHERE d.id IS NULL; -- funcionários sem departamento atribuído

-- JOIN combinado com WHERE, GROUP BY e agregações
SELECT d.nome AS departamento, COUNT(f.id) AS total_funcionarios
FROM departamentos d
LEFT JOIN funcionarios f ON f.departamento_id = d.id
GROUP BY d.nome;
-- LEFT JOIN aqui garante que departamentos SEM funcionários ainda apareçam, com total = 0
```

## Exercício 1: Combine funcionários e departamentos

Escreva uma consulta com `INNER JOIN` que retorna o nome do funcionário e o nome do seu
departamento, para todos os funcionários que TÊM um departamento atribuído.

### Solução

```sql
SELECT f.nome AS funcionario, d.nome AS departamento
FROM funcionarios f
INNER JOIN departamentos d ON f.departamento_id = d.id;
```

`INNER JOIN` só inclui no resultado as linhas onde a condição `ON` encontra correspondência nas
duas tabelas — como Diego tem `departamento_id = NULL`, ele não tem correspondência em
`departamentos` e é automaticamente excluído do resultado.

## Exercício 2: Encontre funcionários sem departamento

Escreva uma consulta que retorna o nome de funcionários que NÃO têm departamento atribuído, usando
`LEFT JOIN`.

### Solução

```sql
SELECT f.nome
FROM funcionarios f
LEFT JOIN departamentos d ON f.departamento_id = d.id
WHERE d.id IS NULL;
```

`LEFT JOIN` mantém todas as linhas de `funcionarios`, preenchendo com `NULL` as colunas de
`departamentos` quando não há correspondência. Filtrar por `WHERE d.id IS NULL` depois isola
exatamente os funcionários que "sobraram" sem par na tabela da direita — um padrão muito comum
para encontrar registros órfãos ou incompletos.

## Quiz

### 1. Qual a principal diferença entre `INNER JOIN` e `LEFT JOIN`?

- [ ] Não há diferença, são sinônimos
- [x] `INNER JOIN` só retorna linhas com correspondência em ambas as tabelas; `LEFT JOIN` retorna todas as linhas da tabela da esquerda, com NULL onde não há correspondência
- [ ] `LEFT JOIN` só funciona com números
- [ ] `INNER JOIN` sempre retorna mais linhas que `LEFT JOIN`

> `INNER JOIN` é mais restritivo: exige que a condição `ON` encontre correspondência nas duas
> tabelas para a linha aparecer. `LEFT JOIN` "preserva" todas as linhas da tabela à esquerda do
> `JOIN`, preenchendo com `NULL` os campos da tabela à direita quando não há par correspondente.

### 2. Como encontrar registros de uma tabela que NÃO têm correspondência em outra?

- [ ] Usando `INNER JOIN` normalmente
- [x] Usando `LEFT JOIN` seguido de `WHERE coluna_da_direita IS NULL`
- [ ] Não é possível fazer isso em SQL
- [ ] Usando `GROUP BY` sozinho

> O padrão "LEFT JOIN + WHERE ... IS NULL" é a técnica clássica para encontrar registros órfãos:
> como `LEFT JOIN` preenche com `NULL` a tabela da direita quando não há correspondência, filtrar
> por esse `NULL` isola exatamente os casos sem correspondência.

### 3. O que a condição depois de `ON` em um JOIN especifica?

- [ ] Um filtro qualquer, igual a WHERE
- [x] Como as linhas das duas tabelas devem ser relacionadas (geralmente comparando chave estrangeira com chave primária)
- [ ] A ordem do resultado
- [ ] Quantas linhas o resultado deve ter

> A cláusula `ON` define a regra de correspondência entre as tabelas — geralmente uma comparação
> de igualdade entre uma coluna de chave estrangeira em uma tabela e a chave primária
> correspondente na outra, como `f.departamento_id = d.id`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "JOINs (parte 1)" na trilha de SQL do CodePath. Contexto: o capítulo explica
> INNER JOIN, LEFT JOIN e o padrão para encontrar registros sem correspondência. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
