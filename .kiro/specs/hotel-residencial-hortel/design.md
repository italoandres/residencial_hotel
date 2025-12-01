# Design Document - Residencial Hortel

## Overview

O sistema do Residencial Hortel é uma aplicação web completa para gestão hoteleira com foco em simplicidade e automação. A arquitetura é composta por:

- **Backend API**: Node.js + Express servindo endpoints RESTful
- **Banco de Dados**: Supabase (PostgreSQL) para persistência
- **Painel Administrativo**: React SPA para funcionários
- **Integração Externa**: N8N para automação WhatsApp
- **Pagamento**: API PIX dinâmico com geração de QR Code e webhooks

O sistema prioriza velocidade operacional, com fluxo automatizado desde a reserva até confirmação de pagamento, minimizando intervenção manual.

## Architecture

### High-Level Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   WhatsApp  │────────▶│     N8N      │────────▶│  Backend    │
│   (Cliente) │         │  (Automação) │         │   API       │
└─────────────┘         └──────────────┘         └──────┬──────┘
                                                         │
                        ┌────────────────────────────────┼────────┐
                        │                                │        │
                        ▼                                ▼        ▼
                 ┌─────────────┐                 ┌──────────┐ ┌─────────┐
                 │   Supabase  │                 │   PIX    │ │  Painel │
                 │  (Postgres) │                 │   API    │ │  Admin  │
                 └─────────────┘                 └──────────┘ └─────────┘
```

### Technology Stack

**Backend:**
- Node.js 18+
- Express 4.x
- Supabase JS Client
- JWT para autenticação
- Joi para validação
- Winston para logging

**Frontend (Painel Admin):**
- React 18
- React Router para navegação
- Axios para HTTP
- Context API para estado global
- CSS Modules para estilização

**Database:**
- PostgreSQL via Supabase
- Row Level Security (RLS) habilitado
- Índices para queries de disponibilidade

**Deployment:**
- Backend: Render ou Railway
- Frontend: Vercel ou Netlify
- Database: Supabase Cloud

## Components and Interfaces

### Backend Components

#### 1. API Server (`server.js`)
Ponto de entrada da aplicação, configura Express e middlewares.

```javascript
// Responsabilidades:
- Inicializar Express
- Configurar CORS
- Registrar middlewares (body-parser, logger, error handler)
- Montar rotas
- Conectar ao Supabase
```

#### 2. Database Client (`db/supabase.js`)
Gerencia conexão com Supabase.

```javascript
// Interface:
export const supabase: SupabaseClient
export async function testConnection(): Promise<boolean>
```

#### 3. Routes

**Quartos Routes (`routes/quartos.js`)**
```javascript
GET /api/quartos
  Query params: ?data=YYYY-MM-DD&pessoas=N
  Response: { quartos: Array<Quarto> }

GET /api/quartos/:id
  Response: { quarto: Quarto, reservas: Array<Reserva> }
```

**Reservas Routes (`routes/reservas.js`)**
```javascript
POST /api/reservas
  Body: { hospedeNome, hospedeTelefone, dataCheckin, numeroPessoas }
  Response: { reserva: Reserva, pixQrCode: string, pixCopiaECola: string }

GET /api/reservas
  Query params: ?status=PENDENTE&data=YYYY-MM-DD
  Response: { reservas: Array<Reserva> }

GET /api/reservas/:id
  Response: { reserva: Reserva, hospede: Hospede, quarto: Quarto, pagamento: Pagamento }

PATCH /api/reservas/:id/check-in
  Response: { reserva: Reserva }

PATCH /api/reservas/:id/check-out
  Response: { reserva: Reserva }

DELETE /api/reservas/:id
  Response: { message: string }
```

**Webhook Routes (`routes/webhooks.js`)**
```javascript
POST /api/webhooks/pix
  Body: { txid, valor, status, reservaId }
  Response: { success: boolean }
```

**Auth Routes (`routes/auth.js`)**
```javascript
POST /api/auth/login
  Body: { email, senha }
  Response: { token: string, funcionario: Funcionario }

POST /api/auth/verify
  Headers: Authorization: Bearer <token>
  Response: { valid: boolean, funcionario: Funcionario }
```

**Hospedes Routes (`routes/hospedes.js`)**
```javascript
GET /api/hospedes
  Headers: Authorization: Bearer <token>
  Response: { hospedes: Array<Hospede> }

GET /api/hospedes/cpf/:cpf
  Headers: Authorization: Bearer <token>
  Response: { hospede: Hospede, reservas: Array<Reserva> }
```

**Configuracoes Routes (`routes/configuracoes.js`)**
```javascript
GET /api/configuracoes
  Headers: Authorization: Bearer <token>
  Response: { configuracoes: Configuracoes }

PATCH /api/configuracoes
  Headers: Authorization: Bearer <token>
  Body: { quartosWhatsApp: number, horarioCheckin: number, horarioCheckout: number }
  Response: { configuracoes: Configuracoes }
```

#### 4. Services

**Disponibilidade Service (`services/disponibilidade.js`)**
```javascript
async function verificarDisponibilidade(data: Date, numeroPessoas: number): Promise<Quarto[]>
async function calcularHorarioDisponivel(quarto: Quarto, data: Date): Promise<boolean>
```

**Reserva Service (`services/reserva.js`)**
```javascript
async function criarPreReserva(dados: ReservaInput): Promise<Reserva>
async function confirmarReserva(reservaId: string, pagamentoId: string): Promise<Reserva>
async function cancelarReserva(reservaId: string): Promise<void>
async function realizarCheckIn(reservaId: string): Promise<Reserva>
async function realizarCheckOut(reservaId: string): Promise<Reserva>
```

**PIX Service (`services/pix.js`)**
```javascript
async function gerarPixDinamico(valor: number, reservaId: string): Promise<PixResponse>
async function verificarPagamento(txid: string): Promise<PagamentoStatus>
```

**Hospede Service (`services/hospede.js`)**
```javascript
async function buscarOuCriarHospede(nome: string, telefone: string): Promise<Hospede>
async function atualizarHospede(id: string, dados: Partial<Hospede>): Promise<Hospede>
async function listarTodosHospedes(): Promise<Hospede[]>
async function buscarHospedePorCPF(cpf: string): Promise<Hospede | null>
async function buscarReservasDoHospede(hospedeId: string): Promise<Reserva[]>
```

**Configuracoes Service (`services/configuracoes.js`)**
```javascript
async function buscarConfiguracoes(): Promise<Configuracoes>
async function atualizarConfiguracoes(dados: Partial<Configuracoes>): Promise<Configuracoes>
async function obterQuartosWhatsApp(): Promise<number>
```

#### 5. Middlewares

**Validação (`middlewares/validation.js`)**
```javascript
function validateReserva(req, res, next)
function validateQuartoQuery(req, res, next)
function validateAuth(req, res, next)
```

**Autenticação (`middlewares/auth.js`)**
```javascript
function requireAuth(req, res, next)
function attachUser(req, res, next)
```

**Error Handler (`middlewares/errorHandler.js`)**
```javascript
function errorHandler(err, req, res, next)
function notFoundHandler(req, res, next)
```

### Frontend Components (Painel Admin)

#### 1. Pages
- `LoginPage`: Autenticação de funcionários
- `DashboardPage`: Visão geral com métricas
- `QuartosPage`: Lista e gestão de quartos com status visual
- `ReservasPage`: Lista e gestão de reservas
- `ReservaDetailPage`: Detalhes e ações de uma reserva
- `ClientesPage`: Lista de hóspedes com busca por CPF
- `ConfiguracoesPage`: Configurações do sistema (quartos WhatsApp, horários)

#### 2. Components
- `QuartoCard`: Exibe informações de um quarto com status visual (DISPONÍVEL/OCUPADO)
- `QuartoStatusBadge`: Badge colorido para status do quarto
- `ReservaCard`: Exibe informações de uma reserva
- `CheckInButton`: Botão para realizar check-in
- `CheckOutButton`: Botão para realizar check-out
- `CancelButton`: Botão para cancelar reserva
- `StatusBadge`: Badge visual para status de reserva
- `ClienteSearchForm`: Formulário de busca por CPF
- `ClienteCard`: Exibe informações de um hóspede
- `ConfigForm`: Formulário de configurações do sistema

#### 3. Services
- `api.js`: Cliente HTTP centralizado
- `auth.js`: Gerenciamento de autenticação
- `storage.js`: LocalStorage wrapper

## Data Models

### Database Schema

#### Tabela: `quartos`
```sql
CREATE TABLE quartos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero INTEGER UNIQUE NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('INDIVIDUAL', 'TRIPLO')),
  capacidade INTEGER NOT NULL,
  preco_diaria DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quartos_tipo ON quartos(tipo);
CREATE INDEX idx_quartos_ativo ON quartos(ativo);
```

#### Tabela: `hospedes`
```sql
CREATE TABLE hospedes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  cpf VARCHAR(14),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hospedes_telefone ON hospedes(telefone);
```

#### Tabela: `reservas`
```sql
CREATE TABLE reservas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospede_id UUID NOT NULL REFERENCES hospedes(id),
  quarto_id UUID NOT NULL REFERENCES quartos(id),
  data_checkin DATE NOT NULL,
  data_checkout DATE NOT NULL,
  hora_checkin TIMESTAMP,
  hora_checkout TIMESTAMP,
  numero_pessoas INTEGER NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'CONFIRMADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reservas_status ON reservas(status);
CREATE INDEX idx_reservas_datas ON reservas(data_checkin, data_checkout);
CREATE INDEX idx_reservas_quarto ON reservas(quarto_id);
CREATE INDEX idx_reservas_hospede ON reservas(hospede_id);
```

#### Tabela: `pagamentos_pix`
```sql
CREATE TABLE pagamentos_pix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reserva_id UUID NOT NULL REFERENCES reservas(id),
  txid VARCHAR(255) UNIQUE NOT NULL,
  qr_code TEXT NOT NULL,
  copia_e_cola TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'PAGO', 'EXPIRADO', 'CANCELADO')),
  data_pagamento TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pagamentos_reserva ON pagamentos_pix(reserva_id);
CREATE INDEX idx_pagamentos_txid ON pagamentos_pix(txid);
CREATE INDEX idx_pagamentos_status ON pagamentos_pix(status);
```

#### Tabela: `funcionarios`
```sql
CREATE TABLE funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_funcionarios_email ON funcionarios(email);
```

#### Tabela: `configuracoes`
```sql
CREATE TABLE configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_configuracoes_chave ON configuracoes(chave);

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('quartos_whatsapp', '5', 'Quantidade de quartos disponíveis exibidos no WhatsApp'),
  ('horario_checkin', '13', 'Horário de check-in (formato 24h)'),
  ('horario_checkout', '11', 'Horário de check-out (formato 24h)');
```

### TypeScript Interfaces

```typescript
interface Quarto {
  id: string;
  numero: number;
  tipo: 'INDIVIDUAL' | 'TRIPLO';
  capacidade: number;
  precoDiaria: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Hospede {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  cpf?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Reserva {
  id: string;
  hospedeId: string;
  quartoId: string;
  dataCheckin: Date;
  dataCheckout: Date;
  horaCheckin?: Date;
  horaCheckout?: Date;
  numeroPessoas: number;
  valorTotal: number;
  status: 'PENDENTE' | 'CONFIRMADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  createdAt: Date;
  updatedAt: Date;
}

interface PagamentoPix {
  id: string;
  reservaId: string;
  txid: string;
  qrCode: string;
  copiaECola: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO' | 'EXPIRADO' | 'CANCELADO';
  dataPagamento?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  descricao?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Configuracoes {
  quartosWhatsApp: number;
  horarioCheckin: number;
  horarioCheckout: number;
}
```

### Business Rules

**Disponibilidade de Quartos:**
- Check-in: 13:00
- Check-out: 11:00
- Um quarto com check-out às 11h pode ser reservado para check-in às 13h do mesmo dia
- Reservas para "hoje" são permitidas se ainda não passou das 13h
- Quartos individuais: 1 pessoa
- Quartos triplos: até 3 pessoas

**Status de Reserva:**
- `PENDENTE`: Aguardando pagamento PIX
- `CONFIRMADA`: Pagamento confirmado, aguardando check-in
- `EM_ANDAMENTO`: Check-in realizado, hóspede no quarto
- `CONCLUIDA`: Check-out realizado
- `CANCELADA`: Reserva cancelada

**Cálculo de Valor:**
- Valor = precoDiaria * numeroDias
- numeroDias = dataCheckout - dataCheckin


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Validação de campos obrigatórios
*For any* requisição de criação de reserva, se campos obrigatórios estão ausentes, então o Sistema deve rejeitar com erro de validação
**Validates: Requirements 1.2**

### Property 2: Criação de pré-reserva com disponibilidade
*For any* conjunto de dados válidos com quartos disponíveis, o Sistema deve criar uma pré-reserva com status PENDENTE
**Validates: Requirements 1.5**

### Property 3: Unicidade de PIX por reserva
*For any* pré-reserva criada, o Sistema deve gerar um txid PIX único que não colide com outras reservas
**Validates: Requirements 2.1**

### Property 4: Confirmação de pagamento atualiza status
*For any* webhook válido de confirmação PIX, o Sistema deve atualizar o status da reserva de PENDENTE para CONFIRMADA
**Validates: Requirements 2.3**

### Property 5: Registro de timestamp de pagamento
*For any* confirmação de pagamento, o Sistema deve registrar data e hora não-nula na tabela pagamentos_pix
**Validates: Requirements 2.4**

### Property 6: Respeito aos horários de check-in e check-out
*For any* verificação de disponibilidade, o Sistema deve considerar check-in às 13h e check-out às 11h ao calcular conflitos
**Validates: Requirements 3.1**

### Property 7: Liberação de quarto após check-out
*For any* quarto com check-out às 11h, o Sistema deve marcar o quarto como disponível para reservas a partir das 13h do mesmo dia
**Validates: Requirements 3.4**

### Property 8: Não-sobreposição de reservas
*For any* conjunto de reservas em um quarto, não deve existir sobreposição de datas entre reservas ativas (CONFIRMADA, EM_ANDAMENTO)
**Validates: Requirements 3.5**

### Property 9: Proteção de endpoints autenticados
*For any* requisição a endpoints administrativos sem token válido, o Sistema deve retornar erro 401 Unauthorized
**Validates: Requirements 4.1**

### Property 10: Concessão de acesso com credenciais válidas
*For any* credenciais válidas de funcionário, o Sistema deve retornar um token JWT válido
**Validates: Requirements 4.2**

### Property 11: Ordenação de reservas por data
*For any* lista de reservas retornada, os registros devem estar ordenados por data_checkin em ordem crescente
**Validates: Requirements 4.4**

### Property 12: Cálculo correto de status de quarto
*For any* quarto consultado, o Sistema deve calcular status (disponível/ocupado/reservado) baseado nas reservas ativas
**Validates: Requirements 5.2**

### Property 13: Inclusão de dados de hóspede em quarto ocupado
*For any* quarto com status ocupado, a resposta deve incluir dados do hóspede e horário de check-out
**Validates: Requirements 5.3**

### Property 14: Filtro de quartos por tipo
*For any* requisição com filtro de tipo, o Sistema deve retornar apenas quartos do tipo especificado (INDIVIDUAL ou TRIPLO)
**Validates: Requirements 5.4**

### Property 15: Check-in atualiza status e registra horário
*For any* reserva com status CONFIRMADA, realizar check-in deve mudar status para EM_ANDAMENTO e registrar hora_checkin
**Validates: Requirements 6.1**

### Property 16: Check-out libera quarto
*For any* reserva com status EM_ANDAMENTO, realizar check-out deve mudar status para CONCLUIDA e liberar o quarto para novas reservas
**Validates: Requirements 6.2**

### Property 17: Cancelamento atualiza status
*For any* reserva não concluída, cancelar deve mudar status para CANCELADA e liberar o quarto
**Validates: Requirements 6.3**

### Property 18: Persistência de histórico de cancelamento
*For any* reserva cancelada, o registro deve permanecer no banco de dados com status CANCELADA
**Validates: Requirements 6.4**

### Property 19: Inclusão de dados relacionados em reserva
*For any* reserva consultada, a resposta deve incluir dados completos de hóspede, quarto e pagamento
**Validates: Requirements 6.5**

### Property 20: Persistência de campos obrigatórios de reserva
*For any* reserva criada, todos os campos obrigatórios (hospede_id, quarto_id, data_checkin, data_checkout, numero_pessoas, valor_total, status) devem estar presentes no banco
**Validates: Requirements 7.2**

### Property 21: Não-duplicação de hóspedes
*For any* múltiplas tentativas de criar hóspede com mesmo telefone, o Sistema deve retornar o hóspede existente sem criar duplicata
**Validates: Requirements 7.3**

### Property 22: Integridade referencial de pagamento
*For any* pagamento registrado, deve existir uma referência válida (foreign key) para uma reserva existente
**Validates: Requirements 7.4**

### Property 23: Formato JSON em resposta de quartos
*For any* requisição GET /quartos bem-sucedida, a resposta deve ser JSON válido com array de quartos
**Validates: Requirements 8.1**

### Property 24: Inclusão de QR Code em criação de reserva
*For any* requisição POST /reservas bem-sucedida, a resposta deve incluir campos qrCode e copiaECola
**Validates: Requirements 8.2**

### Property 25: Processamento de webhook PIX
*For any* webhook POST /reservas/confirmar-pix com txid válido, o Sistema deve atualizar o pagamento correspondente
**Validates: Requirements 8.3**

### Property 26: Aplicação de filtros em lista de reservas
*For any* requisição GET /reservas com filtro de status, o Sistema deve retornar apenas reservas com aquele status
**Validates: Requirements 8.4**

### Property 27: Cancelamento via DELETE
*For any* requisição DELETE /reservas/:id com ID válido, o Sistema deve mudar status da reserva para CANCELADA
**Validates: Requirements 8.5**

### Property 28: Validação de tipos e formatos
*For any* requisição com dados de tipos incorretos (ex: string onde espera número), o Sistema deve rejeitar com erro de validação
**Validates: Requirements 9.1**

### Property 29: Erro 400 para campos ausentes
*For any* requisição com campos obrigatórios ausentes, o Sistema deve retornar status 400 com mensagem descritiva
**Validates: Requirements 9.2**

### Property 30: Sanitização de caracteres especiais
*For any* entrada contendo caracteres especiais SQL (', ", ;, --), o Sistema deve sanitizar antes de usar em queries
**Validates: Requirements 9.3**

### Property 31: Validação de datas
*For any* data fornecida, o Sistema deve validar formato ISO e rejeitar datas no passado (exceto para consultas)
**Validates: Requirements 9.4**

### Property 32: Rejeição de capacidade excedida
*For any* requisição de reserva onde numero_pessoas excede capacidade do quarto, o Sistema deve rejeitar com mensagem clara
**Validates: Requirements 9.5**

### Property 33: Erro 400 para validação
*For any* erro de validação de dados, o Sistema deve retornar status HTTP 400 com lista de campos inválidos
**Validates: Requirements 10.2**

### Property 34: Erro 404 para recurso não encontrado
*For any* requisição com ID inexistente, o Sistema deve retornar status HTTP 404 com mensagem clara
**Validates: Requirements 10.3**

### Property 35: Erro 500 sem exposição de detalhes
*For any* erro interno não tratado, o Sistema deve retornar status HTTP 500 sem expor stack trace ou detalhes de implementação
**Validates: Requirements 10.4**

### Property 36: Estrutura de log de erros
*For any* erro registrado, o log deve incluir campos timestamp, endpoint, método HTTP e stack trace
**Validates: Requirements 10.5**

### Property 37: Listagem completa de hóspedes
*For any* conjunto de hóspedes cadastrados no banco, a API deve retornar todos os hóspedes com nome, CPF, telefone e email
**Validates: Requirements 11.1**

### Property 38: Busca de hóspede por CPF
*For any* hóspede cadastrado com CPF específico, buscar por aquele CPF deve retornar os dados completos do hóspede correspondente
**Validates: Requirements 11.2**

### Property 39: Inclusão de histórico de reservas do hóspede
*For any* hóspede com reservas associadas, buscar o hóspede deve incluir todas as reservas relacionadas no response
**Validates: Requirements 11.4**

### Property 40: Ordenação de hóspedes por data de cadastro
*For any* lista de hóspedes retornada, os registros devem estar ordenados por created_at em ordem decrescente (mais recente primeiro)
**Validates: Requirements 11.5**

### Property 41: Persistência de configurações
*For any* valor de configuração salvo, consultar a configuração posteriormente deve retornar o mesmo valor
**Validates: Requirements 12.2**

### Property 42: Limitação de quartos para WhatsApp
*For any* valor configurado de quartos_whatsapp menor que quartos disponíveis, a API deve retornar no máximo aquela quantidade de quartos
**Validates: Requirements 12.3**

### Property 43: Retorno de quartos disponíveis quando limite excede realidade
*For any* valor configurado de quartos_whatsapp maior que quartos realmente disponíveis, a API deve retornar todos os quartos disponíveis sem exceder a realidade
**Validates: Requirements 12.5**

### Property 44: Status correto de quarto na listagem
*For any* quarto consultado, o status retornado deve ser DISPONÍVEL se não há reserva ativa, ou OCUPADO se há reserva EM_ANDAMENTO
**Validates: Requirements 13.1**

### Property 45: Inclusão de dados de hóspede em quarto ocupado
*For any* quarto com status OCUPADO, o response deve incluir nome do hóspede e data_checkout da reserva ativa
**Validates: Requirements 13.2**

### Property 46: Ausência de dados extras em quarto disponível
*For any* quarto com status DISPONÍVEL, o response não deve incluir dados de hóspede ou reserva
**Validates: Requirements 13.3**

### Property 47: Cálculo de dias restantes até check-out
*For any* quarto ocupado, o campo dias_restantes deve ser igual à diferença em dias entre data_checkout e data atual
**Validates: Requirements 13.4**

## Error Handling

### Error Categories

**Validation Errors (400)**
- Campos obrigatórios ausentes
- Tipos de dados incorretos
- Formatos inválidos (datas, telefone, email)
- Valores fora de range (capacidade excedida)
- Datas no passado

**Authentication Errors (401)**
- Token ausente
- Token inválido ou expirado
- Credenciais incorretas

**Authorization Errors (403)**
- Funcionário inativo tentando acessar
- Tentativa de acesso a recurso sem permissão

**Not Found Errors (404)**
- Reserva não encontrada
- Quarto não encontrado
- Hóspede não encontrado
- Funcionário não encontrado

**Conflict Errors (409)**
- Quarto já reservado para o período
- Tentativa de check-in em reserva não confirmada
- Tentativa de check-out em reserva não iniciada

**Service Unavailable (503)**
- Erro de conexão com Supabase
- Erro de conexão com API PIX
- Timeout em operações

**Internal Server Error (500)**
- Erros não tratados
- Falhas inesperadas

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos fornecidos",
    "details": [
      {
        "field": "numeroPessoas",
        "message": "Número de pessoas excede capacidade do quarto"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/reservas"
  }
}
```

### Logging Strategy

**Log Levels:**
- `ERROR`: Erros que impedem operação (500, 503)
- `WARN`: Situações anormais mas recuperáveis (409, 404)
- `INFO`: Operações importantes (criação de reserva, pagamento confirmado)
- `DEBUG`: Detalhes de execução (queries, validações)

**Log Format:**
```json
{
  "level": "ERROR",
  "timestamp": "2024-01-15T10:30:00Z",
  "message": "Erro ao criar reserva",
  "context": {
    "endpoint": "/api/reservas",
    "method": "POST",
    "userId": "uuid",
    "error": "Database connection failed",
    "stack": "..."
  }
}
```

## Testing Strategy

### Unit Testing

**Framework:** Jest

**Coverage Areas:**
- Services: Lógica de negócio isolada
- Validators: Regras de validação
- Utilities: Funções auxiliares (formatação de datas, cálculos)
- Middlewares: Autenticação, validação, error handling

**Example Unit Tests:**
- `disponibilidade.service.test.js`: Testa cálculo de disponibilidade com diferentes cenários
- `reserva.service.test.js`: Testa criação, confirmação, cancelamento de reservas
- `validation.middleware.test.js`: Testa validação de diferentes payloads

### Property-Based Testing

**Framework:** fast-check (JavaScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Custom generators for domain objects (Quarto, Reserva, Hospede)
- Shrinking enabled for minimal failing examples

**Property Test Requirements:**
- Each property test MUST be tagged with: `**Feature: hotel-residencial-hortel, Property {number}: {property_text}**`
- Each correctness property MUST be implemented by a SINGLE property-based test
- Tests should use smart generators that constrain to valid input space

**Example Property Tests:**
- Property 8: Generate multiple random reservas for same quarto, verify no overlap
- Property 21: Generate multiple hospedes with same telefone, verify only one created
- Property 28: Generate random invalid data types, verify all rejected

### Integration Testing

**Framework:** Supertest + Jest

**Coverage Areas:**
- API endpoints end-to-end
- Database operations
- Authentication flow
- Webhook processing

**Test Database:**
- Use Supabase test project
- Reset database between tests
- Seed with initial data (quartos, funcionario)

### End-to-End Testing

**Framework:** Playwright (optional, for admin panel)

**Coverage Areas:**
- Login flow
- Dashboard navigation
- Check-in/check-out operations
- Reservation management

### Testing Workflow

1. **Development**: Write implementation first, then tests
2. **Unit Tests**: Test individual functions and services
3. **Property Tests**: Verify universal properties hold
4. **Integration Tests**: Test API endpoints with real database
5. **Manual Testing**: Test N8N integration and WhatsApp flow

## Security Considerations

### Authentication
- JWT tokens with 24h expiration
- Bcrypt for password hashing (salt rounds: 10)
- Refresh token mechanism (optional for v2)

### Authorization
- Role-based access: only funcionarios can access admin endpoints
- Row-level security in Supabase for additional protection

### Data Protection
- Input sanitization on all endpoints
- Parameterized queries to prevent SQL injection
- CORS configured for specific origins only
- Rate limiting on public endpoints (reservas creation)

### Sensitive Data
- Passwords never logged or exposed
- PIX credentials stored in environment variables
- Database credentials in secure environment variables

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields (status, datas, telefone)
- Connection pooling via Supabase client
- Efficient queries avoiding N+1 problems

### Caching Strategy
- Cache lista de quartos (rarely changes)
- Cache funcionario data after authentication
- Invalidate cache on updates

### API Response Times
- Target: < 200ms for availability checks
- Target: < 500ms for reservation creation
- Target: < 100ms for simple queries

## Deployment Strategy

### Environment Variables
```
# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx

# JWT
JWT_SECRET=xxx
JWT_EXPIRATION=24h

# PIX API
PIX_API_URL=https://api.pix.com
PIX_CLIENT_ID=xxx
PIX_CLIENT_SECRET=xxx

# Application
PORT=3000
NODE_ENV=production
```

### Deployment Steps
1. Build backend: `npm run build`
2. Run migrations on Supabase
3. Seed initial data (quartos, funcionario admin)
4. Deploy to Render/Railway
5. Configure environment variables
6. Test health endpoint
7. Deploy frontend to Vercel

### Monitoring
- Health check endpoint: `GET /health`
- Log aggregation via Winston
- Error tracking (optional: Sentry)
- Uptime monitoring (optional: UptimeRobot)

## Future Enhancements (Out of Scope)

- Multi-hotel support
- Advanced reporting and analytics
- Email notifications
- SMS notifications
- Dynamic pricing
- Loyalty program
- Mobile app
- Integration with booking platforms (Booking.com, Airbnb)
