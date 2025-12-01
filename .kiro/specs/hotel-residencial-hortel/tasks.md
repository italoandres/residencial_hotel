# Implementation Plan

- [x] 1. Configurar estrutura inicial do projeto backend


  - Criar estrutura de pastas (src/routes, src/services, src/middlewares, src/db, src/utils)
  - Inicializar package.json com dependências (express, @supabase/supabase-js, joi, jsonwebtoken, bcrypt, winston, dotenv)
  - Criar arquivo .env.example com variáveis necessárias
  - Configurar scripts npm (start, dev, test)
  - _Requirements: 7.1_



- [ ] 2. Implementar conexão com Supabase e criar schema do banco
  - [ ] 2.1 Criar cliente Supabase em src/db/supabase.js
    - Implementar conexão com Supabase usando variáveis de ambiente


    - Criar função testConnection() para verificar conectividade
    - _Requirements: 7.1_
  
  - [ ] 2.2 Criar migrations SQL para todas as tabelas
    - Escrever SQL para tabela quartos com constraints e índices
    - Escrever SQL para tabela hospedes com constraints e índices


    - Escrever SQL para tabela reservas com constraints e índices
    - Escrever SQL para tabela pagamentos_pix com constraints e índices
    - Escrever SQL para tabela funcionarios com constraints e índices
    - _Requirements: 7.2, 7.3, 7.4_
  


  - [ ] 2.3 Criar script de seed para dados iniciais
    - Inserir 11 quartos individuais (números 1-11)
    - Inserir 2 quartos triplos (números 12-13)
    - Inserir funcionário admin padrão com senha hash


    - _Requirements: 5.1_

- [ ] 3. Implementar middlewares base
  - [x] 3.1 Criar middleware de error handling


    - Implementar errorHandler com formatação de erro padronizada
    - Implementar notFoundHandler para rotas inexistentes
    - Mapear tipos de erro para status HTTP corretos
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  


  - [ ] 3.2 Criar middleware de logging
    - Configurar Winston com níveis de log (error, warn, info, debug)
    - Implementar logger middleware para registrar todas as requisições
    - Configurar formato de log com timestamp, endpoint, método
    - _Requirements: 10.5_
  
  - [ ] 3.3 Criar middleware de autenticação
    - Implementar requireAuth que verifica JWT token
    - Implementar attachUser que adiciona dados do funcionário ao req
    - Retornar 401 para tokens inválidos ou ausentes


    - _Requirements: 4.1, 4.2_

- [ ] 4. Implementar serviço de autenticação
  - [x] 4.1 Criar auth service com login e verificação

    - Implementar função login(email, senha) que valida credenciais
    - Gerar JWT token com expiração de 24h
    - Implementar função verifyToken(token) para validar tokens
    - _Requirements: 4.1, 4.2_
  


  - [ ] 4.2 Escrever property test para autenticação
    - **Property 9: Proteção de endpoints autenticados**
    - **Property 10: Concessão de acesso com credenciais válidas**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 5. Implementar rotas de autenticação
  - [ ] 5.1 Criar POST /api/auth/login
    - Validar body com Joi (email, senha obrigatórios)
    - Chamar auth service para validar credenciais


    - Retornar token e dados do funcionário
    - _Requirements: 4.1, 4.2_
  
  - [ ] 5.2 Criar POST /api/auth/verify
    - Extrair token do header Authorization
    - Validar token e retornar dados do funcionário
    - _Requirements: 4.2_

- [ ] 6. Implementar serviço de hóspedes
  - [ ] 6.1 Criar hospede service
    - Implementar buscarOuCriarHospede(nome, telefone)
    - Verificar se hóspede existe por telefone antes de criar


    - Implementar atualizarHospede(id, dados)
    - _Requirements: 7.3_
  
  - [ ] 6.2 Escrever property test para não-duplicação de hóspedes
    - **Property 21: Não-duplicação de hóspedes**
    - **Validates: Requirements 7.3**

- [ ] 7. Implementar serviço de disponibilidade
  - [ ] 7.1 Criar disponibilidade service
    - Implementar verificarDisponibilidade(data, numeroPessoas)


    - Buscar quartos com capacidade adequada
    - Verificar conflitos com reservas existentes considerando horários 13h/11h
    - Implementar calcularHorarioDisponivel(quarto, data)
    - _Requirements: 1.3, 3.1, 3.4, 3.5_
  
  - [ ] 7.2 Escrever property test para disponibilidade
    - **Property 6: Respeito aos horários de check-in e check-out**
    - **Property 7: Liberação de quarto após check-out**
    - **Property 8: Não-sobreposição de reservas**
    - **Validates: Requirements 3.1, 3.4, 3.5**

- [ ] 8. Implementar serviço PIX (mock inicial)
  - [ ] 8.1 Criar PIX service com geração de QR Code
    - Implementar gerarPixDinamico(valor, reservaId)
    - Gerar txid único usando UUID
    - Retornar mock de qrCode e copiaECola (implementação real depois)
    - Implementar verificarPagamento(txid)
    - _Requirements: 2.1_
  
  - [ ] 8.2 Escrever property test para unicidade de PIX
    - **Property 3: Unicidade de PIX por reserva**
    - **Validates: Requirements 2.1**

- [ ] 9. Implementar serviço de reservas
  - [ ] 9.1 Criar reserva service com todas as operações
    - Implementar criarPreReserva(dados) que cria reserva PENDENTE
    - Calcular valor_total baseado em precoDiaria e número de dias
    - Implementar confirmarReserva(reservaId, pagamentoId)
    - Implementar cancelarReserva(reservaId)
    - Implementar realizarCheckIn(reservaId)
    - Implementar realizarCheckOut(reservaId)
    - _Requirements: 1.5, 2.3, 6.1, 6.2, 6.3_
  
  - [ ] 9.2 Escrever property tests para operações de reserva
    - **Property 2: Criação de pré-reserva com disponibilidade**
    - **Property 4: Confirmação de pagamento atualiza status**
    - **Property 15: Check-in atualiza status e registra horário**
    - **Property 16: Check-out libera quarto**
    - **Property 17: Cancelamento atualiza status**


    - **Property 18: Persistência de histórico de cancelamento**
    - **Validates: Requirements 1.5, 2.3, 6.1, 6.2, 6.3, 6.4**

- [ ] 10. Implementar validações com Joi
  - [x] 10.1 Criar schemas de validação

    - Schema para criação de reserva (hospedeNome, hospedeTelefone, dataCheckin, numeroPessoas)
    - Schema para query de quartos (data, pessoas)
    - Schema para login (email, senha)
    - Validar formatos de data, telefone, email
    - _Requirements: 9.1, 9.2, 9.4_
  
  - [ ] 10.2 Criar middleware de validação
    - Implementar validateReserva usando schema Joi
    - Implementar validateQuartoQuery usando schema Joi
    - Retornar 400 com lista de erros para dados inválidos
    - _Requirements: 9.1, 9.2_
  
  - [ ] 10.3 Escrever property tests para validação
    - **Property 1: Validação de campos obrigatórios**


    - **Property 28: Validação de tipos e formatos**
    - **Property 29: Erro 400 para campos ausentes**
    - **Property 31: Validação de datas**
    - **Property 32: Rejeição de capacidade excedida**
    - **Validates: Requirements 1.2, 9.1, 9.2, 9.4, 9.5**

- [x] 11. Implementar rotas de quartos

  - [ ] 11.1 Criar GET /api/quartos
    - Aceitar query params data e pessoas
    - Chamar disponibilidade service se params fornecidos
    - Retornar lista de quartos disponíveis
    - Aplicar filtro por tipo se fornecido

    - _Requirements: 5.1, 5.4, 8.1_
  
  - [ ] 11.2 Criar GET /api/quartos/:id
    - Buscar quarto por ID
    - Calcular status atual (disponível/ocupado/reservado)

    - Incluir dados de hóspede se ocupado
    - Retornar 404 se não encontrado
    - _Requirements: 5.2, 5.3_
  
  - [ ] 11.3 Escrever property tests para rotas de quartos
    - **Property 12: Cálculo correto de status de quarto**

    - **Property 13: Inclusão de dados de hóspede em quarto ocupado**
    - **Property 14: Filtro de quartos por tipo**
    - **Property 23: Formato JSON em resposta de quartos**
    - **Validates: Requirements 5.2, 5.3, 5.4, 8.1**

- [x] 12. Implementar rotas de reservas

  - [ ] 12.1 Criar POST /api/reservas
    - Validar dados com middleware
    - Buscar ou criar hóspede
    - Verificar disponibilidade
    - Criar pré-reserva com status PENDENTE
    - Gerar PIX dinâmico
    - Retornar reserva com QR Code
    - _Requirements: 1.2, 1.3, 1.5, 2.1, 8.2_
  
  - [ ] 12.2 Criar GET /api/reservas
    - Aceitar filtros opcionais (status, data)
    - Retornar lista ordenada por data_checkin
    - Proteger com requireAuth middleware
    - _Requirements: 4.4, 8.4_
  


  - [ ] 12.3 Criar GET /api/reservas/:id
    - Buscar reserva por ID com joins (hospede, quarto, pagamento)
    - Retornar 404 se não encontrado
    - Proteger com requireAuth middleware
    - _Requirements: 6.5_
  
  - [ ] 12.4 Criar PATCH /api/reservas/:id/check-in
    - Validar que reserva está CONFIRMADA
    - Chamar reserva service para realizar check-in
    - Retornar reserva atualizada
    - Proteger com requireAuth middleware
    - _Requirements: 6.1_
  
  - [x] 12.5 Criar PATCH /api/reservas/:id/check-out


    - Validar que reserva está EM_ANDAMENTO
    - Chamar reserva service para realizar check-out
    - Retornar reserva atualizada
    - Proteger com requireAuth middleware
    - _Requirements: 6.2_
  
  - [ ] 12.6 Criar DELETE /api/reservas/:id
    - Chamar reserva service para cancelar
    - Retornar mensagem de sucesso
    - Proteger com requireAuth middleware
    - _Requirements: 6.3, 8.5_
  
  - [ ] 12.7 Escrever property tests para rotas de reservas
    - **Property 11: Ordenação de reservas por data**
    - **Property 19: Inclusão de dados relacionados em reserva**
    - **Property 20: Persistência de campos obrigatórios de reserva**
    - **Property 24: Inclusão de QR Code em criação de reserva**
    - **Property 26: Aplicação de filtros em lista de reservas**
    - **Property 27: Cancelamento via DELETE**
    - **Validates: Requirements 4.4, 6.5, 7.2, 8.2, 8.4, 8.5**

- [ ] 13. Implementar webhook de confirmação PIX
  - [x] 13.1 Criar POST /api/webhooks/pix



    - Validar payload do webhook (txid, valor, status, reservaId)
    - Buscar pagamento por txid
    - Atualizar status do pagamento para PAGO
    - Registrar data_pagamento com timestamp atual
    - Chamar reserva service para confirmar reserva
    - Retornar success: true
    - _Requirements: 2.3, 2.4, 8.3_
  
  - [ ] 13.2 Escrever property tests para webhook
    - **Property 5: Registro de timestamp de pagamento**
    - **Property 22: Integridade referencial de pagamento**
    - **Property 25: Processamento de webhook PIX**
    - **Validates: Requirements 2.4, 7.4, 8.3**





- [ ] 14. Implementar sanitização e segurança
  - [ ] 14.1 Adicionar sanitização de inputs
    - Criar função sanitizeString que remove caracteres SQL perigosos
    - Aplicar sanitização em todos os inputs de texto
    - Usar queries parametrizadas do Supabase
    - _Requirements: 9.3_
  
  - [ ] 14.2 Escrever property test para sanitização
    - **Property 30: Sanitização de caracteres especiais**
    - **Validates: Requirements 9.3**

- [ ] 15. Implementar tratamento de erros HTTP
  - [ ] 15.1 Adicionar tratamento específico de erros
    - Implementar classe customizada AppError(code, message, statusCode)
    - Atualizar error handler para usar AppError
    - Garantir que erros 500 não expõem stack trace
    - _Requirements: 10.2, 10.3, 10.4_
  
  - [ ] 15.2 Escrever property tests para erros HTTP
    - **Property 33: Erro 400 para validação**
    - **Property 34: Erro 404 para recurso não encontrado**
    - **Property 35: Erro 500 sem exposição de detalhes**
    - **Property 36: Estrutura de log de erros**
    - **Validates: Requirements 10.2, 10.3, 10.4, 10.5**

- [ ] 16. Configurar servidor Express principal
  - [ ] 16.1 Criar src/server.js
    - Inicializar Express app
    - Configurar CORS para origens específicas
    - Registrar middlewares (body-parser, logger, error handler)
    - Montar todas as rotas (/api/auth, /api/quartos, /api/reservas, /api/webhooks)
    - Adicionar health check endpoint GET /health
    - Iniciar servidor na porta configurada
    - _Requirements: 7.1_

- [ ] 17. Checkpoint - Garantir que todos os testes passam
  - Executar todos os testes unitários e property tests
  - Verificar que não há erros de lint
  - Testar endpoints manualmente com Postman/Insomnia
  - Garantir que banco de dados está populado corretamente

- [ ] 18. Implementar tabela e serviço de configurações
  - [ ] 18.1 Criar migration para tabela configuracoes
    - Escrever SQL para tabela configuracoes com chave única
    - Inserir configurações padrão (quartos_whatsapp=5, horario_checkin=13, horario_checkout=11)
    - _Requirements: 12.2_
  
  - [ ] 18.2 Criar configuracoes service
    - Implementar buscarConfiguracoes() que retorna objeto com todas as configs
    - Implementar atualizarConfiguracoes(dados) que atualiza valores
    - Implementar obterQuartosWhatsApp() para uso na API de disponibilidade
    - _Requirements: 12.2, 12.3_
  
  - [ ] 18.3 Escrever property test para configurações
    - **Property 41: Persistência de configurações**
    - **Validates: Requirements 12.2**

- [ ] 19. Implementar rotas de configurações
  - [ ] 19.1 Criar GET /api/configuracoes
    - Chamar configuracoes service
    - Retornar objeto com configurações
    - Proteger com requireAuth middleware
    - _Requirements: 12.1_
  
  - [ ] 19.2 Criar PATCH /api/configuracoes
    - Validar body com Joi (quartosWhatsApp, horarioCheckin, horarioCheckout)
    - Chamar configuracoes service para atualizar
    - Retornar configurações atualizadas
    - Proteger com requireAuth middleware
    - _Requirements: 12.2_

- [ ] 20. Atualizar serviço de disponibilidade para usar configuração
  - [ ] 20.1 Modificar verificarDisponibilidade para limitar resultados
    - Buscar valor de quartos_whatsapp das configurações
    - Aplicar limite aos quartos retornados
    - Se limite excede disponíveis, retornar todos disponíveis
    - _Requirements: 12.3, 12.5_
  
  - [ ] 20.2 Escrever property tests para limitação de quartos
    - **Property 42: Limitação de quartos para WhatsApp**
    - **Property 43: Retorno de quartos disponíveis quando limite excede realidade**
    - **Validates: Requirements 12.3, 12.5**

- [ ] 21. Implementar rotas de hóspedes
  - [ ] 21.1 Criar GET /api/hospedes
    - Chamar hospede service para listar todos
    - Ordenar por created_at DESC
    - Retornar array de hóspedes
    - Proteger com requireAuth middleware
    - _Requirements: 11.1, 11.5_
  
  - [ ] 21.2 Criar GET /api/hospedes/cpf/:cpf
    - Validar formato do CPF
    - Chamar hospede service para buscar por CPF
    - Buscar reservas associadas ao hóspede
    - Retornar hóspede com histórico de reservas
    - Retornar 404 se não encontrado
    - Proteger com requireAuth middleware
    - _Requirements: 11.2, 11.3, 11.4_
  
  - [ ] 21.3 Escrever property tests para rotas de hóspedes
    - **Property 37: Listagem completa de hóspedes**
    - **Property 38: Busca de hóspede por CPF**
    - **Property 39: Inclusão de histórico de reservas do hóspede**
    - **Property 40: Ordenação de hóspedes por data de cadastro**
    - **Validates: Requirements 11.1, 11.2, 11.4, 11.5**

- [ ] 22. Melhorar rota de quartos com status visual
  - [ ] 22.1 Atualizar GET /api/quartos para incluir status detalhado
    - Para cada quarto, calcular status (DISPONÍVEL/OCUPADO)
    - Se OCUPADO, incluir nome do hóspede e data_checkout
    - Se OCUPADO, calcular dias_restantes até checkout
    - Se DISPONÍVEL, não incluir dados extras
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ] 22.2 Escrever property tests para status de quartos
    - **Property 44: Status correto de quarto na listagem**
    - **Property 45: Inclusão de dados de hóspede em quarto ocupado**
    - **Property 46: Ausência de dados extras em quarto disponível**
    - **Property 47: Cálculo de dias restantes até check-out**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4**

- [ ] 23. Checkpoint - Testar novas funcionalidades backend
  - Executar todos os property tests das novas features
  - Testar endpoints de hóspedes manualmente
  - Testar endpoints de configurações manualmente
  - Verificar que limitação de quartos WhatsApp funciona
  - Verificar que status visual dos quartos está correto

- [ ] 24. Configurar estrutura inicial do painel React
  - [ ] 24.1 Criar projeto React
    - Inicializar com create-react-app ou Vite
    - Instalar dependências (react-router-dom, axios)
    - Criar estrutura de pastas (src/pages, src/components, src/services, src/contexts)
    - Configurar variáveis de ambiente para API URL
    - _Requirements: 4.3_
  
  - [ ] 24.2 Criar serviços de API e autenticação
    - Criar src/services/api.js com cliente Axios configurado
    - Criar src/services/auth.js com login, logout, getToken
    - Criar src/services/storage.js para gerenciar localStorage
    - _Requirements: 4.1, 4.2_

- [ ] 25. Implementar autenticação no frontend
  - [ ] 25.1 Criar contexto de autenticação
    - Criar AuthContext com estado de usuário e token
    - Implementar funções login, logout, checkAuth
    - Criar AuthProvider para envolver a aplicação
    - _Requirements: 4.1, 4.2_
  
  - [ ] 25.2 Criar página de login
    - Criar LoginPage com formulário (email, senha)
    - Validar campos antes de enviar
    - Chamar API de login e armazenar token
    - Redirecionar para dashboard após sucesso
    - Exibir erros de autenticação
    - _Requirements: 4.1, 4.2_
  
  - [ ] 25.3 Criar ProtectedRoute component
    - Verificar se usuário está autenticado
    - Redirecionar para login se não autenticado
    - Permitir acesso se autenticado
    - _Requirements: 4.1_

- [ ] 26. Implementar dashboard e navegação
  - [ ] 26.1 Criar DashboardPage
    - Exibir métricas básicas (total de quartos, reservas ativas, check-ins hoje)
    - Buscar dados da API ao carregar
    - Exibir loading state
    - _Requirements: 4.3, 4.4_
  
  - [ ] 26.2 Criar componente de navegação
    - Criar Navbar com links para Dashboard, Quartos, Reservas
    - Adicionar botão de logout
    - Exibir nome do funcionário logado
    - _Requirements: 4.3_

- [ ] 27. Implementar página de quartos com status visual
  - [ ] 27.1 Criar QuartosPage melhorada
    - Buscar lista de quartos da API
    - Exibir em grid com QuartoCard components
    - Mostrar número, tipo, capacidade, status
    - Adicionar filtro por tipo (Individual/Triplo)
    - _Requirements: 5.1, 5.2, 5.4_
  
    - Buscar lista de quartos com status detalhado da API
    - Exibir em grid com QuartoCard components
    - Mostrar número, tipo, capacidade, status visual
    - Para quartos OCUPADOS, mostrar nome do hóspede e data de checkout
    - Para quartos OCUPADOS, mostrar dias restantes
    - Adicionar filtro por tipo (Individual/Triplo)
    - _Requirements: 13.1, 13.2, 13.4_
  
  - [ ] 27.2 Criar QuartoCard component melhorado
    - Exibir informações do quarto
    - Mostrar StatusBadge com cor baseada em status
    - Exibir dados do hóspede se ocupado
    - _Requirements: 5.2, 5.3_

    - Exibir informações do quarto
    - Mostrar QuartoStatusBadge com cor baseada em status (verde=DISPONÍVEL, vermelho=OCUPADO)
    - Se OCUPADO, exibir dados do hóspede e checkout
    - Se OCUPADO, exibir badge com dias restantes
    - _Requirements: 13.1, 13.2, 13.4_

- [ ] 28. Implementar página de reservas
  - [ ] 28.1 Criar ReservasPage
    - Buscar lista de reservas da API
    - Exibir em lista com ReservaCard components
    - Adicionar filtros (status, data)
    - Ordenar por data de check-in
    - _Requirements: 4.4, 6.5_
  
  - [ ] 28.2 Criar ReservaCard component
    - Exibir informações da reserva (hóspede, quarto, datas)
    - Mostrar StatusBadge
    - Adicionar botões de ação baseados em status
    - Link para página de detalhes
    - _Requirements: 6.5_

- [ ] 29. Implementar página de clientes
  - [ ] 29.1 Criar ClientesPage
    - Buscar lista de hóspedes da API
    - Exibir em tabela com nome, CPF, telefone, email, data de cadastro
    - Ordenar por data de cadastro (mais recente primeiro)
    - _Requirements: 11.1, 11.5_
  
  - [ ] 29.2 Criar ClienteSearchForm component
    - Campo de busca por CPF com máscara (000.000.000-00)
    - Botão de buscar
    - Ao buscar, chamar API GET /hospedes/cpf/:cpf
    - Exibir resultado em ClienteCard
    - Exibir histórico de reservas do cliente
    - Mostrar mensagem se não encontrado
    - _Requirements: 11.2, 11.3, 11.4_
  
  - [ ] 29.3 Criar ClienteCard component
    - Exibir dados completos do hóspede
    - Exibir lista de reservas associadas
    - Mostrar status de cada reserva
    - _Requirements: 11.4_

- [ ] 30. Implementar página de configurações
  - [ ] 30.1 Criar ConfiguracoesPage
    - Buscar configurações atuais da API
    - Exibir formulário com campos editáveis
    - _Requirements: 12.1_
  
  - [ ] 30.2 Criar ConfigForm component
    - Campo para quartos_whatsapp (número)
    - Campo para horario_checkin (número 0-23)
    - Campo para horario_checkout (número 0-23)
    - Botão de salvar
    - Validar valores antes de enviar
    - Chamar API PATCH /configuracoes ao salvar
    - Mostrar mensagem de sucesso/erro
    - _Requirements: 12.2_

- [ ] 31. Implementar página de detalhes de reserva
  - [ ] 31.1 Criar ReservaDetailPage
    - Buscar reserva completa por ID
    - Exibir todos os dados (hóspede, quarto, pagamento)
    - Mostrar histórico de status
    - _Requirements: 6.5_
  
  - [ ] 31.2 Adicionar ações de gerenciamento
    - Criar CheckInButton que chama PATCH /check-in
    - Criar CheckOutButton que chama PATCH /check-out
    - Criar CancelButton que chama DELETE
    - Desabilitar botões baseado em status atual
    - Mostrar confirmação antes de ações destrutivas
    - Atualizar UI após ação bem-sucedida
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 32. Implementar componentes auxiliares
  - [ ] 32.1 Criar StatusBadge component
    - Receber status como prop
    - Retornar badge com cor apropriada (PENDENTE=amarelo, CONFIRMADA=azul, EM_ANDAMENTO=verde, CONCLUIDA=cinza, CANCELADA=vermelho)
    - _Requirements: 5.2, 6.5_
  
  - [ ] 32.2 Criar QuartoStatusBadge component
    - Receber status como prop (DISPONÍVEL/OCUPADO)
    - Retornar badge com cor apropriada (verde/vermelho)
    - _Requirements: 13.1_
  
  - [ ] 32.3 Criar componentes de loading e erro
    - Criar LoadingSpinner component
    - Criar ErrorMessage component
    - Usar em todas as páginas durante fetch
    - _Requirements: 4.3_

- [ ] 33. Adicionar estilização ao painel
  - [ ] 33.1 Criar estilos globais
    - Definir paleta de cores
    - Configurar tipografia
    - Criar classes utilitárias
    - _Requirements: 4.3_
  
  - [ ] 33.2 Estilizar todos os componentes
    - Usar CSS Modules ou styled-components
    - Garantir responsividade
    - Adicionar hover states e transições
    - _Requirements: 4.3_

- [ ] 34. Atualizar navegação para incluir novas páginas
  - [ ] 34.1 Adicionar links no menu
    - Adicionar link para ClientesPage
    - Adicionar link para ConfiguracoesPage
    - Atualizar rotas no React Router
    - _Requirements: 11.1, 12.1_

- [ ] 35. Checkpoint final - Testar sistema completo
  - Executar todos os testes backend (incluindo novos property tests)
  - Testar fluxo completo no painel admin
  - Verificar que todas as operações funcionam (login, visualizar quartos, gerenciar reservas, clientes, configurações)
  - Testar busca de cliente por CPF
  - Testar configuração de quartos WhatsApp
  - Verificar que status visual dos quartos está correto
  - Testar criação de reserva via API (simular N8N)
  - Testar webhook de confirmação PIX
  - Verificar logs e tratamento de erros
  - Documentar endpoints da API para integração N8N
