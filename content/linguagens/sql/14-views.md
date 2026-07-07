---
numero: 14
titulo: "Views"
nivel: "avancado"
objetivo: "Criar consultas reutilizáveis com CREATE VIEW."
duracao: 10
status: "completo"
---

## Conceito

Uma view é uma consulta `SELECT` salva sob um nome, que pode ser consultada como se fosse uma
tabela comum — mas não guarda dados próprios: toda vez que a view é consultada, a consulta
subjacente é executada novamente. Views são úteis para simplificar consultas complexas e
recorrentes, e para expor apenas um subconjunto controlado de colunas/linhas a certos usuários.

## Sintaxe

```sql
CREATE VIEW funcionarios_engenharia AS
SELECT nome, cargo, salario
FROM funcionarios
WHERE departamento_id = 1;

SELECT * FROM funcionarios_engenharia; -- consulta como se fosse uma tabela
```

## Exemplos comentados

```sql
-- View simples: encapsula uma consulta frequente
CREATE VIEW funcionarios_bem_pagos AS
SELECT nome, cargo, salario
FROM funcionarios
WHERE salario > 8000;

SELECT * FROM funcionarios_bem_pagos ORDER BY salario DESC;
-- é possível aplicar WHERE, ORDER BY, etc. sobre o resultado da view normalmente

-- View com JOIN: esconde a complexidade de combinar tabelas
CREATE VIEW funcionarios_com_departamento AS
SELECT f.id, f.nome, f.salario, d.nome AS departamento
FROM funcionarios f
LEFT JOIN departamentos d ON f.departamento_id = d.id;

SELECT nome, departamento FROM funcionarios_com_departamento WHERE departamento = 'Engenharia';

-- View com agregação: relatórios reutilizáveis
CREATE VIEW resumo_por_departamento AS
SELECT d.nome AS departamento, COUNT(f.id) AS total_funcionarios, AVG(f.salario) AS media_salarial
FROM departamentos d
LEFT JOIN funcionarios f ON f.departamento_id = d.id
GROUP BY d.nome;

SELECT * FROM resumo_por_departamento;

-- Views são "vivas": refletem automaticamente qualquer mudança nos dados subjacentes
-- (diferente de uma tabela temporária, que guardaria um "retrato" fixo dos dados)

-- Remover uma view
DROP VIEW IF EXISTS funcionarios_bem_pagos;

-- Algumas views "simples" (sem JOIN, agregação ou DISTINCT) podem ser atualizáveis:
-- UPDATE funcionarios_bem_pagos SET salario = 8500 WHERE nome = 'Ana';
-- (a atualização reflete na tabela funcionarios de verdade — nem toda view suporta isso)
```

## Exercício 1: Crie uma view de funcionários por departamento

Escreva uma view `visao_funcionarios` que combina `funcionarios` e `departamentos` via `LEFT
JOIN`, expondo `nome` do funcionário, `salario` e `nome` do departamento (como `departamento`).

### Solução

```sql
CREATE VIEW visao_funcionarios AS
SELECT f.nome, f.salario, d.nome AS departamento
FROM funcionarios f
LEFT JOIN departamentos d ON f.departamento_id = d.id;
```

```sql
SELECT * FROM visao_funcionarios WHERE salario > 7000;
```

A view encapsula o `JOIN` uma única vez; qualquer consulta seguinte pode simplesmente usar
`visao_funcionarios` como se fosse uma tabela comum, sem precisar repetir a lógica de junção toda
vez — útil especialmente quando essa combinação é consultada com frequência por diferentes partes
de uma aplicação.

## Exercício 2: Crie uma view de relatório agregado

Escreva uma view `relatorio_departamentos` que mostra, para cada departamento, o total de
funcionários e a soma dos salários.

### Solução

```sql
CREATE VIEW relatorio_departamentos AS
SELECT
    d.nome AS departamento,
    COUNT(f.id) AS total_funcionarios,
    SUM(f.salario) AS folha_salarial
FROM departamentos d
LEFT JOIN funcionarios f ON f.departamento_id = d.id
GROUP BY d.nome;
```

```sql
SELECT * FROM relatorio_departamentos ORDER BY folha_salarial DESC;
```

Como a view guarda a **definição** da consulta (não um resultado congelado), toda vez que
`relatorio_departamentos` for consultada, os totais e somas são recalculados com os dados mais
atuais das tabelas `departamentos` e `funcionarios` — nunca fica "desatualizada".

## Quiz

### 1. Uma view guarda uma cópia dos dados no momento em que foi criada?

- [ ] Sim, e precisa ser atualizada manualmente
- [x] Não — uma view executa a consulta subjacente novamente a cada vez que é consultada, sempre refletindo os dados atuais
- [ ] Apenas se criada com a opção `MATERIALIZED`
- [ ] Views não podem ser consultadas mais de uma vez

> Uma view (não materializada) não armazena dados próprios: ela é essencialmente um `SELECT`
> nomeado, reexecutado a cada consulta. (Views materializadas, um recurso mais avançado e não
> disponível em todos os bancos, sim guardam um resultado "congelado" que precisa ser atualizado
> explicitamente.)

### 2. Qual a principal vantagem de encapsular um JOIN complexo em uma view?

- [ ] A consulta fica mais rápida automaticamente
- [x] Simplifica consultas futuras, que passam a usar a view como se fosse uma tabela comum, sem repetir a lógica de junção
- [ ] Views eliminam a necessidade de índices
- [ ] Apenas administradores podem criar views

> Encapsular uma consulta complexa (com múltiplos JOINs, por exemplo) em uma view evita repetir
> essa lógica em todo lugar onde ela é necessária — quem consulta a view só precisa saber que ela
> retorna certas colunas, sem se preocupar com os detalhes de como esses dados são combinados por
> trás.

### 3. O que acontece se os dados nas tabelas subjacentes de uma view mudarem?

- [ ] A view precisa ser recriada manualmente para refletir a mudança
- [x] A próxima consulta à view automaticamente reflete os dados atualizados, sem nenhuma ação manual
- [ ] A view para de funcionar até ser atualizada
- [ ] Apenas a metade da view é atualizada

> Como a view não guarda dados próprios, qualquer alteração nas tabelas que ela consulta
> (`INSERT`, `UPDATE`, `DELETE`) é automaticamente refletida na próxima vez que a view for
> consultada — não é preciso "sincronizar" nada manualmente.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Views" na trilha de SQL do CodePath. Contexto: o capítulo explica CREATE VIEW,
> views com JOIN e agregação, e a diferença para views materializadas. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
