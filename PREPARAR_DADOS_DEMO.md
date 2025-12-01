# 📊 PREPARAR DADOS PARA DEMONSTRAÇÃO

## 🎯 OBJETIVO

Ter dados realistas no sistema para uma demonstração convincente ao dono do hotel.

---

## 📋 DADOS NECESSÁRIOS

### 1. Quartos (já criados pelo seed)
- ✅ 11 quartos individuais (1-11)
- ✅ 2 quartos triplos (12-13)

### 2. Hóspedes de Exemplo

Cadastre 5-6 hóspedes com dados realistas:

```
Hóspede 1:
- Nome: João Silva Santos
- CPF: 123.456.789-00
- Telefone: (11) 98765-4321
- Email: joao.silva@email.com

Hóspede 2:
- Nome: Maria Oliveira Costa
- CPF: 987.654.321-00
- Telefone: (11) 97654-3210
- Email: maria.oliveira@email.com

Hóspede 3:
- Nome: Pedro Souza Lima
- CPF: 456.789.123-00
- Telefone: (11) 96543-2109
- Email: pedro.souza@email.com

Hóspede 4:
- Nome: Ana Paula Ferreira
- CPF: 321.654.987-00
- Telefone: (11) 95432-1098
- Email: ana.ferreira@email.com

Hóspede 5:
- Nome: Carlos Eduardo Alves
- CPF: 789.123.456-00
- Telefone: (11) 94321-0987
- Email: carlos.alves@email.com
```

### 3. Ocupações Atuais

**Quartos Ocupados (3-4 quartos):**

```
Quarto 1 - OCUPADO
- Hóspede: João Silva Santos
- Check-in: Hoje
- Check-out: Amanhã às 11h
- Status: EM_ANDAMENTO

Quarto 3 - OCUPADO
- Hóspede: Maria Oliveira Costa
- Check-in: Ontem
- Check-out: Hoje + 2 dias às 11h
- Status: EM_ANDAMENTO

Quarto 5 - OCUPADO
- Hóspede: Pedro Souza Lima
- Check-in: Hoje - 2 dias
- Check-out: Hoje + 1 dia às 11h
- Status: EM_ANDAMENTO

Quarto 12 (Triplo) - OCUPADO
- Hóspede: Ana Paula Ferreira
- Check-in: Hoje
- Check-out: Hoje + 3 dias às 11h
- Status: EM_ANDAMENTO
```

**Quartos Disponíveis:**
- Quartos 2, 4, 6, 7, 8, 9, 10, 11, 13

### 4. Reservas Futuras

```
Reserva 1 - CONFIRMADA
- Hóspede: Carlos Eduardo Alves
- Quarto: 2
- Check-in: Amanhã às 13h
- Check-out: Amanhã + 3 dias às 11h
- Status: CONFIRMADA
- Pagamento: PAGO

Reserva 2 - PENDENTE
- Hóspede: Novo Cliente (WhatsApp)
- Quarto: 4
- Check-in: Hoje + 2 dias às 13h
- Check-out: Hoje + 5 dias às 11h
- Status: PENDENTE
- Pagamento: PENDENTE
```

---

## 🔧 COMO PREPARAR OS DADOS

### Opção 1: Via Painel Admin (Recomendado)

1. **Fazer Login**
   - Acesse o sistema
   - Login: `admin@residencialhortel.com`
   - Senha: `admin123`

2. **Ocupar Quartos**
   - Vá para "Quartos"
   - Clique em um quarto disponível
   - Clique em "Ocupar Quarto"
   - Preencha dados do hóspede
   - Salve
   - Repita para 3-4 quartos

3. **Criar Reservas**
   - Vá para "Reservas"
   - Clique em "Nova Reserva"
   - Preencha dados
   - Salve

### Opção 2: Via SQL (Mais Rápido)

Execute no Supabase SQL Editor:

```sql
-- Inserir hóspedes
INSERT INTO hospedes (nome, cpf, telefone, email) VALUES
('João Silva Santos', '12345678900', '11987654321', 'joao.silva@email.com'),
('Maria Oliveira Costa', '98765432100', '11976543210', 'maria.oliveira@email.com'),
('Pedro Souza Lima', '45678912300', '11965432109', 'pedro.souza@email.com'),
('Ana Paula Ferreira', '32165498700', '11954321098', 'ana.ferreira@email.com'),
('Carlos Eduardo Alves', '78912345600', '11943210987', 'carlos.alves@email.com');

-- Ocupar quartos (ajuste as datas conforme necessário)
INSERT INTO reservas (hospede_id, quarto_id, data_checkin, data_checkout, numero_pessoas, valor_total, status, hora_checkin)
SELECT 
  h.id,
  q.id,
  CURRENT_DATE,
  CURRENT_DATE + 1,
  1,
  q.preco_diaria,
  'EM_ANDAMENTO',
  NOW()
FROM hospedes h, quartos q
WHERE h.nome = 'João Silva Santos' AND q.numero = 1;

INSERT INTO reservas (hospede_id, quarto_id, data_checkin, data_checkout, numero_pessoas, valor_total, status, hora_checkin)
SELECT 
  h.id,
  q.id,
  CURRENT_DATE - 1,
  CURRENT_DATE + 2,
  1,
  q.preco_diaria * 3,
  'EM_ANDAMENTO',
  NOW() - INTERVAL '1 day'
FROM hospedes h, quartos q
WHERE h.nome = 'Maria Oliveira Costa' AND q.numero = 3;

INSERT INTO reservas (hospede_id, quarto_id, data_checkin, data_checkout, numero_pessoas, valor_total, status, hora_checkin)
SELECT 
  h.id,
  q.id,
  CURRENT_DATE - 2,
  CURRENT_DATE + 1,
  1,
  q.preco_diaria * 3,
  'EM_ANDAMENTO',
  NOW() - INTERVAL '2 days'
FROM hospedes h, quartos q
WHERE h.nome = 'Pedro Souza Lima' AND q.numero = 5;

INSERT INTO reservas (hospede_id, quarto_id, data_checkin, data_checkout, numero_pessoas, valor_total, status, hora_checkin)
SELECT 
  h.id,
  q.id,
  CURRENT_DATE,
  CURRENT_DATE + 3,
  3,
  q.preco_diaria * 3,
  'EM_ANDAMENTO',
  NOW()
FROM hospedes h, quartos q
WHERE h.nome = 'Ana Paula Ferreira' AND q.numero = 12;

-- Criar reserva futura confirmada
INSERT INTO reservas (hospede_id, quarto_id, data_checkin, data_checkout, numero_pessoas, valor_total, status)
SELECT 
  h.id,
  q.id,
  CURRENT_DATE + 1,
  CURRENT_DATE + 4,
  1,
  q.preco_diaria * 3,
  'CONFIRMADA'
FROM hospedes h, quartos q
WHERE h.nome = 'Carlos Eduardo Alves' AND q.numero = 2;
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes da demonstração, verifique:

- [ ] Pelo menos 3 quartos ocupados
- [ ] Pelo menos 2 quartos disponíveis
- [ ] Dados dos hóspedes parecem realistas
- [ ] Datas fazem sentido (check-in no passado, check-out no futuro)
- [ ] Pelo menos 1 reserva futura confirmada
- [ ] Pelo menos 1 CPF anotado para demonstrar busca
- [ ] Status dos quartos está correto (verde/vermelho)
- [ ] Dias restantes até checkout aparecem corretamente

---

## 🎯 CENÁRIOS DE DEMONSTRAÇÃO

### Cenário 1: Ocupar Quarto
**Use:** Quarto 2 (disponível)
**Hóspede:** Criar novo na hora ou usar "Carlos Eduardo Alves"
**Objetivo:** Mostrar como é fácil ocupar um quarto

### Cenário 2: Desocupar Quarto
**Use:** Quarto 1 (João Silva Santos)
**Objetivo:** Mostrar como liberar um quarto rapidamente

### Cenário 3: Buscar Hóspede por CPF
**Use:** CPF 123.456.789-00 (João Silva Santos)
**Objetivo:** Mostrar preenchimento automático de dados

### Cenário 4: Check-in de Reserva
**Use:** Reserva de Carlos Eduardo Alves (se for amanhã)
**Objetivo:** Mostrar processo de check-in

### Cenário 5: Visualizar Histórico
**Use:** Qualquer hóspede com múltiplas reservas
**Objetivo:** Mostrar rastreamento de histórico

---

## 📝 NOTAS IMPORTANTES

1. **Datas Realistas**
   - Use datas próximas (hoje, ontem, amanhã)
   - Evite datas muito antigas ou muito futuras
   - Certifique-se que check-out é depois de check-in

2. **Dados Consistentes**
   - CPF deve ter 11 dígitos
   - Telefone deve ter DDD + número
   - Email deve ter formato válido

3. **Status Corretos**
   - EM_ANDAMENTO: check-in feito, check-out não
   - CONFIRMADA: pagamento confirmado, check-in não feito
   - PENDENTE: aguardando pagamento

4. **Valores Realistas**
   - Quarto individual: R$ 80-120/dia
   - Quarto triplo: R$ 150-200/dia
   - Calcule valor_total = preco_diaria * numero_dias

---

## 🔄 RESETAR DADOS (SE NECESSÁRIO)

Se precisar limpar e recomeçar:

```sql
-- CUIDADO: Isso apaga TODOS os dados!
DELETE FROM pagamentos_pix;
DELETE FROM reservas;
DELETE FROM hospedes WHERE email != 'admin@residencialhortel.com';

-- Depois execute os INSERTs acima novamente
```

---

## 🎬 ÚLTIMA VERIFICAÇÃO ANTES DA DEMO

30 minutos antes da demonstração:

1. [ ] Acesse o sistema
2. [ ] Faça login
3. [ ] Vá para "Quartos" e verifique status visual
4. [ ] Vá para "Hóspedes" e verifique lista
5. [ ] Teste busca por CPF
6. [ ] Vá para "Reservas" e verifique lista
7. [ ] Teste ocupar/desocupar um quarto
8. [ ] Verifique que tudo está funcionando

**Se algo estiver errado, corrija AGORA!**

---

**Dados preparados = Demonstração de sucesso! 🎯**
