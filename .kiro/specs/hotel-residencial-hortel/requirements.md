# Requirements Document

## Introduction

O Residencial Hortel é um sistema completo de gestão hoteleira focado em trabalhadores, com estrutura simples e alto custo-benefício. O sistema permite reservas rápidas via WhatsApp, pagamento automático via PIX, e painel administrativo para funcionários gerenciarem operações diárias. O hotel possui 11 quartos individuais e 2 quartos triplos, totalizando capacidade para 17 hóspedes.

## Glossary

- **Sistema**: O sistema completo de gestão do Residencial Hortel
- **Hóspede**: Cliente que realiza reserva no hotel
- **Funcionário**: Usuário administrativo que gerencia operações do hotel
- **Reserva**: Registro de ocupação de quarto por período determinado
- **Pré-reserva**: Reserva com status PENDENTE aguardando confirmação de pagamento
- **Quarto Individual**: Quarto com capacidade para 1 pessoa
- **Quarto Triplo**: Quarto com capacidade para 3 pessoas
- **Check-in**: Processo de entrada do hóspede no quarto às 13h
- **Check-out**: Processo de saída do hóspede do quarto às 11h
- **PIX Dinâmico**: Sistema de pagamento instantâneo com geração de QR Code único
- **Webhook**: Endpoint que recebe notificações automáticas de confirmação de pagamento
- **N8N**: Plataforma de automação que integra WhatsApp com o Sistema
- **Supabase**: Plataforma de banco de dados Postgres utilizada pelo Sistema

## Requirements

### Requirement 1

**User Story:** Como hóspede, eu quero iniciar uma reserva através do WhatsApp, para que eu possa reservar um quarto de forma rápida e conveniente.

#### Acceptance Criteria

1. WHEN um hóspede envia mensagem inicial pelo WhatsApp, THEN o Sistema SHALL solicitar data desejada, quantidade de pessoas e nome completo
2. WHEN o hóspede fornece os dados solicitados, THEN o Sistema SHALL validar que todos os campos obrigatórios foram preenchidos
3. WHEN os dados são válidos, THEN o Sistema SHALL verificar disponibilidade em tempo real no banco de dados
4. WHEN não há quartos disponíveis, THEN o Sistema SHALL informar indisponibilidade e sugerir datas alternativas
5. WHEN há quartos disponíveis, THEN o Sistema SHALL criar uma pré-reserva com status PENDENTE

### Requirement 2

**User Story:** Como hóspede, eu quero realizar pagamento via PIX, para que minha reserva seja confirmada automaticamente.

#### Acceptance Criteria

1. WHEN uma pré-reserva é criada, THEN o Sistema SHALL gerar um QR Code PIX dinâmico único para aquela reserva
2. WHEN o QR Code é gerado, THEN o Sistema SHALL enviar o código via WhatsApp ao hóspede
3. WHEN o pagamento PIX é confirmado via webhook, THEN o Sistema SHALL atualizar o status da reserva para CONFIRMADA
4. WHEN o status muda para CONFIRMADA, THEN o Sistema SHALL registrar data e hora do pagamento na tabela de pagamentos
5. WHEN o pagamento é confirmado, THEN o Sistema SHALL notificar o hóspede via WhatsApp sobre a confirmação

### Requirement 3

**User Story:** Como sistema, eu quero gerenciar disponibilidade de quartos considerando horários de check-in e check-out, para que as reservas sejam alocadas corretamente.

#### Acceptance Criteria

1. WHEN o Sistema verifica disponibilidade, THEN o Sistema SHALL considerar check-in às 13h e check-out às 11h
2. WHEN uma reserva é para o dia atual antes das 13h, THEN o Sistema SHALL permitir a reserva
3. WHEN uma reserva é para o dia atual após as 13h, THEN o Sistema SHALL verificar se o quarto já passou do horário de check-in
4. WHEN um quarto tem check-out às 11h, THEN o Sistema SHALL liberar o quarto para nova reserva no mesmo dia a partir das 13h
5. WHEN há múltiplas reservas consecutivas, THEN o Sistema SHALL garantir que não haja sobreposição de ocupação

### Requirement 4

**User Story:** Como funcionário, eu quero acessar um painel administrativo, para que eu possa gerenciar todas as operações do hotel.

#### Acceptance Criteria

1. WHEN um funcionário acessa o painel, THEN o Sistema SHALL exigir autenticação com credenciais válidas
2. WHEN as credenciais são válidas, THEN o Sistema SHALL conceder acesso ao dashboard administrativo
3. WHEN o funcionário está autenticado, THEN o Sistema SHALL exibir lista de todos os quartos com status atual
4. WHEN o funcionário está autenticado, THEN o Sistema SHALL exibir lista de todas as reservas ordenadas por data
5. WHEN a sessão expira, THEN o Sistema SHALL redirecionar o funcionário para tela de login

### Requirement 5

**User Story:** Como funcionário, eu quero visualizar e gerenciar quartos, para que eu possa controlar a disponibilidade e ocupação.

#### Acceptance Criteria

1. WHEN o funcionário acessa a lista de quartos, THEN o Sistema SHALL exibir todos os 13 quartos com tipo e capacidade
2. WHEN o funcionário visualiza um quarto, THEN o Sistema SHALL mostrar status atual (disponível, ocupado, reservado)
3. WHEN o funcionário visualiza um quarto ocupado, THEN o Sistema SHALL exibir dados do hóspede atual e horário de check-out
4. WHEN o funcionário filtra por tipo, THEN o Sistema SHALL separar quartos individuais e triplos
5. WHEN o funcionário busca por disponibilidade, THEN o Sistema SHALL calcular disponibilidade em tempo real

### Requirement 6

**User Story:** Como funcionário, eu quero gerenciar reservas, para que eu possa realizar check-in, check-out e cancelamentos.

#### Acceptance Criteria

1. WHEN o funcionário realiza check-in, THEN o Sistema SHALL atualizar status da reserva para EM_ANDAMENTO e registrar horário
2. WHEN o funcionário realiza check-out, THEN o Sistema SHALL atualizar status da reserva para CONCLUIDA e liberar o quarto
3. WHEN o funcionário cancela uma reserva, THEN o Sistema SHALL atualizar status para CANCELADA e liberar o quarto
4. WHEN uma reserva é cancelada, THEN o Sistema SHALL manter histórico completo no banco de dados
5. WHEN o funcionário visualiza uma reserva, THEN o Sistema SHALL exibir todos os dados do hóspede, pagamento e quarto

### Requirement 7

**User Story:** Como sistema, eu quero armazenar dados de forma estruturada no Supabase, para que todas as informações sejam persistidas e consultadas eficientemente.

#### Acceptance Criteria

1. WHEN o Sistema inicia, THEN o Sistema SHALL estabelecer conexão segura com banco Supabase
2. WHEN dados de reserva são criados, THEN o Sistema SHALL armazenar na tabela reservas com todos os campos obrigatórios
3. WHEN dados de hóspede são fornecidos, THEN o Sistema SHALL armazenar na tabela hospedes evitando duplicação
4. WHEN pagamento é confirmado, THEN o Sistema SHALL registrar na tabela pagamentos_pix com referência à reserva
5. WHEN consultas são realizadas, THEN o Sistema SHALL utilizar índices para otimizar performance

### Requirement 8

**User Story:** Como sistema, eu quero expor APIs RESTful, para que integrações externas como N8N possam interagir com o sistema.

#### Acceptance Criteria

1. WHEN uma requisição GET é feita para /quartos, THEN o Sistema SHALL retornar lista de quartos disponíveis em formato JSON
2. WHEN uma requisição POST é feita para /reservas, THEN o Sistema SHALL criar pré-reserva e retornar dados com QR Code PIX
3. WHEN uma requisição POST é feita para /reservas/confirmar-pix, THEN o Sistema SHALL processar webhook de confirmação de pagamento
4. WHEN uma requisição GET é feita para /reservas, THEN o Sistema SHALL retornar lista de reservas com filtros opcionais
5. WHEN uma requisição DELETE é feita para /reservas/:id, THEN o Sistema SHALL cancelar a reserva especificada

### Requirement 9

**User Story:** Como desenvolvedor, eu quero validar e sanitizar todos os dados de entrada, para que o sistema seja seguro contra injeções e dados inválidos.

#### Acceptance Criteria

1. WHEN dados são recebidos via API, THEN o Sistema SHALL validar tipos e formatos antes de processar
2. WHEN campos obrigatórios estão ausentes, THEN o Sistema SHALL retornar erro 400 com mensagem descritiva
3. WHEN dados contêm caracteres especiais, THEN o Sistema SHALL sanitizar para prevenir SQL injection
4. WHEN datas são fornecidas, THEN o Sistema SHALL validar formato e garantir que não sejam datas passadas
5. WHEN quantidade de pessoas excede capacidade, THEN o Sistema SHALL rejeitar a reserva com mensagem clara

### Requirement 10

**User Story:** Como sistema, eu quero tratar erros de forma consistente, para que problemas sejam identificados e resolvidos rapidamente.

#### Acceptance Criteria

1. WHEN ocorre erro de conexão com banco, THEN o Sistema SHALL retornar erro 503 e registrar log detalhado
2. WHEN ocorre erro de validação, THEN o Sistema SHALL retornar erro 400 com lista de campos inválidos
3. WHEN recurso não é encontrado, THEN o Sistema SHALL retornar erro 404 com mensagem clara
4. WHEN ocorre erro interno, THEN o Sistema SHALL retornar erro 500 sem expor detalhes de implementação
5. WHEN erro é registrado, THEN o Sistema SHALL incluir timestamp, endpoint e stack trace no log

### Requirement 11

**User Story:** Como funcionário, eu quero visualizar e buscar informações de hóspedes, para que eu possa gerenciar dados de clientes de forma eficiente.

#### Acceptance Criteria

1. WHEN o funcionário acessa a lista de hóspedes, THEN o Sistema SHALL exibir todos os hóspedes cadastrados com nome, CPF, telefone e email
2. WHEN o funcionário busca por CPF, THEN o Sistema SHALL retornar os dados completos do hóspede correspondente
3. WHEN o CPF buscado não existe, THEN o Sistema SHALL retornar erro 404 com mensagem clara
4. WHEN o funcionário visualiza um hóspede, THEN o Sistema SHALL exibir histórico de reservas associadas
5. WHEN a lista de hóspedes é solicitada, THEN o Sistema SHALL ordenar por data de cadastro mais recente

### Requirement 12

**User Story:** Como funcionário, eu quero configurar quantos quartos aparecem como disponíveis no WhatsApp, para que eu possa criar senso de urgência nas vendas.

#### Acceptance Criteria

1. WHEN o funcionário acessa configurações, THEN o Sistema SHALL exibir campo para definir quantidade de quartos disponíveis para WhatsApp
2. WHEN o funcionário salva a configuração, THEN o Sistema SHALL persistir o valor no banco de dados
3. WHEN a API de disponibilidade é consultada via WhatsApp, THEN o Sistema SHALL limitar a quantidade de quartos retornados ao valor configurado
4. WHEN não há configuração definida, THEN o Sistema SHALL usar valor padrão de 5 quartos
5. WHEN o valor configurado excede quartos realmente disponíveis, THEN o Sistema SHALL retornar apenas os quartos realmente disponíveis

### Requirement 13

**User Story:** Como funcionário, eu quero visualizar status visual dos quartos no painel, para que eu possa identificar rapidamente disponibilidade e ocupação.

#### Acceptance Criteria

1. WHEN o funcionário visualiza a lista de quartos, THEN o Sistema SHALL exibir badge visual com status DISPONÍVEL ou OCUPADO
2. WHEN um quarto está ocupado, THEN o Sistema SHALL exibir nome do hóspede e data de check-out prevista
3. WHEN um quarto está disponível, THEN o Sistema SHALL exibir apenas o status sem informações adicionais
4. WHEN o funcionário visualiza um quarto ocupado, THEN o Sistema SHALL calcular e exibir dias restantes até check-out
5. WHEN o status de um quarto muda, THEN o Sistema SHALL atualizar a visualização em tempo real sem necessidade de refresh manual
