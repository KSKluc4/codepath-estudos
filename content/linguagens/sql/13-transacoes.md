---
numero: 13
titulo: "Transações"
nivel: "avancado"
objetivo: "Garantir atomicidade de operações com BEGIN, COMMIT e ROLLBACK."
duracao: 12
status: "completo"
---

## Conceito

Uma transação agrupa vários comandos SQL para que sejam tratados como uma **única unidade
atômica**: ou todos são aplicados com sucesso (`COMMIT`), ou nenhum é (`ROLLBACK`) — mesmo que
algum comando no meio do caminho falhe. É essencial sempre que múltiplas alterações precisam
acontecer juntas, como transferir dinheiro entre duas contas: debitar de uma e creditar em outra
não podem "acontecer pela metade".

## Sintaxe

```sql
BEGIN;
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;
```

## Exemplos comentados

```sql
-- Transferência bancária: as duas atualizações precisam acontecer JUNTAS
BEGIN;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1; -- debita da conta 1
UPDATE contas SET saldo = saldo + 100 WHERE id = 2; -- credita na conta 2

COMMIT; -- confirma as duas alterações de uma vez, permanentemente

-- Se algo der errado no meio do caminho, ROLLBACK desfaz TUDO desde o BEGIN
BEGIN;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;

-- Verificação: se o saldo ficou negativo, a transferência não deveria ter acontecido
-- SELECT saldo FROM contas WHERE id = 1;
-- (imaginando que o resultado revela saldo negativo)

ROLLBACK; -- desfaz o débito acima, como se nunca tivesse acontecido

-- Propriedades ACID que uma transação garante:
-- Atomicidade:   tudo ou nada (COMMIT confirma tudo, ROLLBACK desfaz tudo)
-- Consistência:  a transação leva o banco de um estado válido a outro estado válido
-- Isolamento:    transações concorrentes não "veem" mudanças incompletas umas das outras
-- Durabilidade:  depois do COMMIT, os dados persistem mesmo em caso de queda do sistema

-- SAVEPOINT: marca um ponto intermediário dentro de uma transação, para
-- desfazer parcialmente sem cancelar a transação inteira
BEGIN;
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
SAVEPOINT antes_do_credito;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;
-- ROLLBACK TO antes_do_credito; -- desfaria só o crédito, mantendo o débito
COMMIT;

-- Muitas ferramentas/ORMs fazem BEGIN/COMMIT automaticamente por trás dos panos —
-- mas entender o mecanismo ajuda a debugar problemas de concorrência e consistência
```

## Exercício 1: Escreva uma transferência com transação

Escreva uma transação que transfere `200` do saldo da conta `id = 1` para a conta `id = 2`,
usando `BEGIN` e `COMMIT`.

### Solução

```sql
BEGIN;

UPDATE contas SET saldo = saldo - 200 WHERE id = 1;
UPDATE contas SET saldo = saldo + 200 WHERE id = 2;

COMMIT;
```

Envolver as duas atualizações em `BEGIN`/`COMMIT` garante que, se o banco cair (ou a conexão
falhar) entre os dois `UPDATE`, nenhuma das alterações fica "pela metade" aplicada — ao reiniciar,
a transação inteira é revertida automaticamente, como se nunca tivesse começado.

## Exercício 2: Desfaça uma alteração indevida com ROLLBACK

Escreva uma sequência que inicia uma transação, atualiza o salário de um funcionário para um
valor claramente errado, percebe o erro, e desfaz a alteração com `ROLLBACK` antes de confirmar
qualquer coisa.

### Solução

```sql
BEGIN;

UPDATE funcionarios SET salario = 999999 WHERE id = 1; -- valor errado, digitado por engano

ROLLBACK; -- desfaz a atualização acima, como se nunca tivesse acontecido

-- Neste ponto, o salario do funcionário id=1 permanece com o valor ORIGINAL
```

Como a transação nunca chegou a um `COMMIT`, o `ROLLBACK` reverte completamente a alteração feita
depois do `BEGIN` — nenhum outro usuário do banco jamais chegou a ver o valor `999999`, já que
transações não confirmadas permanecem isoladas até o `COMMIT` (propriedade de isolamento do ACID).

## Quiz

### 1. O que `COMMIT` faz ao final de uma transação?

- [ ] Cancela todas as alterações feitas desde o BEGIN
- [x] Confirma permanentemente todas as alterações feitas desde o BEGIN, tornando-as visíveis e duráveis
- [ ] Apenas revisa as alterações, sem aplicá-las
- [ ] Cria uma nova tabela

> `COMMIT` finaliza a transação com sucesso: todas as alterações feitas desde o `BEGIN` (ou o
> último `COMMIT`/`ROLLBACK`) tornam-se permanentes e visíveis para outras conexões ao banco.

### 2. O que garante a propriedade de "atomicidade" (o "A" de ACID)?

- [ ] Que a transação é executada instantaneamente, sem demora
- [x] Que todos os comandos da transação são aplicados com sucesso, ou nenhum deles é (tudo ou nada)
- [ ] Que a transação nunca pode falhar
- [ ] Que os dados nunca podem ser lidos por outra conexão

> Atomicidade significa que uma transação é indivisível: se qualquer parte dela falhar, o banco
> garante que NENHUMA parte fica aplicada — é exatamente o que `ROLLBACK` (manual ou automático,
> em caso de erro/queda) garante.

### 3. Por que uma transferência bancária (debitar de uma conta, creditar em outra) deve ser feita dentro de uma transação?

- [ ] Não é necessário, cada UPDATE já é seguro isoladamente
- [x] Para garantir que, se algo falhar entre o débito e o crédito, nenhuma das duas alterações fique aplicada sozinha (evitando "sumiço" de dinheiro)
- [ ] Apenas para deixar a operação mais rápida
- [ ] Transações só existem para operações de leitura

> Sem uma transação, se o sistema falhar exatamente entre os dois `UPDATE` (depois de debitar, mas
> antes de creditar), o dinheiro "desapareceria" — debitado de uma conta sem nunca ter sido
> creditado na outra. A transação garante que essa situação intermediária inconsistente nunca
> persista: ou as duas operações são aplicadas juntas, ou nenhuma é.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Transações" na trilha de SQL do CodePath. Contexto: o capítulo explica BEGIN/
> COMMIT/ROLLBACK, SAVEPOINT e as propriedades ACID. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].
