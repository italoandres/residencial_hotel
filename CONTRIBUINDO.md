# 🤝 Guia de Contribuição - Sistema Residencial Hortel

Obrigado por considerar contribuir para o Sistema Residencial Hortel! Este documento fornece diretrizes para contribuir com o projeto.

---

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Testes](#testes)
- [Documentação](#documentação)
- [Versionamento](#versionamento)

---

## 📜 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você concorda em manter um ambiente respeitoso e colaborativo.

### Comportamentos Esperados
- ✅ Ser respeitoso com outros contribuidores
- ✅ Aceitar críticas construtivas
- ✅ Focar no que é melhor para o projeto
- ✅ Mostrar empatia com outros membros

### Comportamentos Inaceitáveis
- ❌ Linguagem ou imagens ofensivas
- ❌ Ataques pessoais ou políticos
- ❌ Assédio público ou privado
- ❌ Publicar informações privadas de outros

---

## 🚀 Como Contribuir

### Reportar Bugs

Se encontrar um bug, por favor:

1. **Verifique** se o bug já foi reportado
2. **Crie** uma issue detalhada com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do sistema
   - Sistema operacional

**Template de Bug Report:**
```markdown
## Descrição
[Descrição clara do bug]

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que está acontecendo]

## Screenshots
[Se aplicável]

## Ambiente
- Versão: [ex: 1.0.0]
- SO: [ex: Windows 10]
- Navegador: [ex: Chrome 120]
```

### Sugerir Melhorias

Para sugerir uma nova funcionalidade:

1. **Verifique** se já não foi sugerida
2. **Crie** uma issue com:
   - Descrição da funcionalidade
   - Justificativa (por que é útil)
   - Exemplos de uso
   - Possível implementação

**Template de Feature Request:**
```markdown
## Funcionalidade
[Descrição clara da funcionalidade]

## Motivação
[Por que esta funcionalidade é necessária]

## Solução Proposta
[Como você imagina que funcione]

## Alternativas Consideradas
[Outras abordagens que você pensou]

## Exemplos
[Exemplos de uso ou screenshots]
```

### Contribuir com Código

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Faça** suas alterações
5. **Teste** suas alterações
6. **Commit** com mensagens claras
7. **Push** para seu fork
8. **Abra** um Pull Request

---

## 💻 Padrões de Código

### JavaScript/Node.js

#### Estilo de Código
```javascript
// ✅ BOM
const getUserById = async (id) => {
  try {
    const user = await db.from('users').select('*').eq('id', id).single();
    return user;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ RUIM
const getUser = async (id) => {
  const user = await db.from('users').select('*').eq('id', id).single();
  return user;
};
```

#### Convenções
- Use `camelCase` para variáveis e funções
- Use `PascalCase` para classes
- Use `UPPER_CASE` para constantes
- Use nomes descritivos
- Evite abreviações
- Máximo 80 caracteres por linha (quando possível)

#### Comentários
```javascript
// ✅ BOM - Explica o "porquê"
// Validamos o horário porque check-in só é permitido após 13h
if (hora < 13) {
  throw new Error('Check-in permitido apenas após 13h');
}

// ❌ RUIM - Explica o "o quê" (óbvio)
// Verifica se hora é menor que 13
if (hora < 13) {
  throw new Error('Check-in permitido apenas após 13h');
}
```

### HTML/CSS

#### HTML
```html
<!-- ✅ BOM -->
<div class="reserva-card">
  <h3 class="reserva-title">Reserva #123</h3>
  <p class="reserva-date">01/12/2024</p>
</div>

<!-- ❌ RUIM -->
<div class="rc">
  <h3 class="rt">Reserva #123</h3>
  <p class="rd">01/12/2024</p>
</div>
```

#### CSS
```css
/* ✅ BOM */
.reserva-card {
  padding: 20px;
  border-radius: 8px;
  background: white;
}

.reserva-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* ❌ RUIM */
.rc{padding:20px;border-radius:8px;background:white;}
.rc:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,0.1);}
```

### SQL

```sql
-- ✅ BOM
SELECT 
  r.id,
  r.data_checkin,
  r.data_checkout,
  h.nome AS hospede_nome,
  q.numero AS quarto_numero
FROM reservas r
INNER JOIN hospedes h ON r.hospede_id = h.id
INNER JOIN quartos q ON r.quarto_id = q.id
WHERE r.status = 'CONFIRMADA'
ORDER BY r.data_checkin DESC;

-- ❌ RUIM
select * from reservas where status='CONFIRMADA';
```

---

## 🔄 Processo de Desenvolvimento

### 1. Planejamento

Antes de começar a codificar:

1. **Entenda** o problema completamente
2. **Discuta** a solução com outros contribuidores
3. **Planeje** a implementação
4. **Documente** o plano

### 2. Desenvolvimento

Durante o desenvolvimento:

1. **Siga** os padrões de código
2. **Escreva** código limpo e legível
3. **Comente** quando necessário
4. **Teste** frequentemente
5. **Commit** pequenas mudanças

### 3. Revisão

Antes de submeter:

1. **Revise** seu próprio código
2. **Teste** todas as funcionalidades
3. **Verifique** a documentação
4. **Execute** o checklist

### 4. Submissão

Ao submeter um PR:

1. **Descreva** as mudanças claramente
2. **Referencie** issues relacionadas
3. **Inclua** screenshots (se aplicável)
4. **Aguarde** revisão

---

## 🧪 Testes

### Testes Manuais

Antes de submeter código:

1. **Teste** a funcionalidade principal
2. **Teste** casos extremos
3. **Teste** em diferentes navegadores (frontend)
4. **Teste** com dados inválidos
5. **Verifique** logs de erro

### Checklist de Testes

- [ ] Funcionalidade principal funciona
- [ ] Casos extremos tratados
- [ ] Erros são capturados e logados
- [ ] Validação de inputs funciona
- [ ] Sem erros no console
- [ ] Performance aceitável
- [ ] Compatível com versões anteriores

### Testes Automatizados (Futuro)

Quando implementarmos testes automatizados:

```javascript
// Exemplo de teste com Jest
describe('Reserva Service', () => {
  test('deve criar reserva com dados válidos', async () => {
    const reserva = await criarReserva(dadosValidos);
    expect(reserva).toBeDefined();
    expect(reserva.status).toBe('PENDENTE');
  });

  test('deve rejeitar reserva com dados inválidos', async () => {
    await expect(criarReserva(dadosInvalidos))
      .rejects
      .toThrow('Dados inválidos');
  });
});
```

---

## 📚 Documentação

### Documentar Código

```javascript
/**
 * Cria uma nova reserva no sistema
 * 
 * @param {Object} dados - Dados da reserva
 * @param {string} dados.quarto_id - ID do quarto
 * @param {Object} dados.hospede - Dados do hóspede
 * @param {string} dados.data_checkin - Data de check-in (YYYY-MM-DD)
 * @param {string} dados.data_checkout - Data de check-out (YYYY-MM-DD)
 * @returns {Promise<Object>} Reserva criada
 * @throws {Error} Se dados forem inválidos
 */
async function criarReserva(dados) {
  // Implementação
}
```

### Documentar APIs

Ao adicionar novos endpoints:

```markdown
## POST /api/reservas

Cria uma nova reserva.

### Request

```json
{
  "quarto_id": "uuid",
  "hospede": {
    "nome": "João Silva",
    "cpf": "12345678900",
    "telefone": "11999999999"
  },
  "data_checkin": "2024-12-01",
  "data_checkout": "2024-12-05",
  "numero_hospedes": 2
}
```

### Response (201 Created)

```json
{
  "reserva": {
    "id": "uuid",
    "status": "PENDENTE",
    "valor_total": 500.00
  }
}
```

### Errors

- `400` - Dados inválidos
- `404` - Quarto não encontrado
- `409` - Quarto não disponível
```

### Atualizar Documentação

Ao fazer mudanças:

1. **Atualize** README.md se necessário
2. **Atualize** CHANGELOG.md
3. **Atualize** documentação específica
4. **Adicione** exemplos se aplicável

---

## 📦 Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0) - Mudanças incompatíveis
- **MINOR** (0.X.0) - Novas funcionalidades compatíveis
- **PATCH** (0.0.X) - Correções de bugs

### Mensagens de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Documentação
style:    Formatação
refactor: Refatoração
test:     Testes
chore:    Manutenção

# Exemplos
feat: adicionar filtro de reservas por status
fix: corrigir validação de CPF
docs: atualizar guia de instalação
style: formatar código com prettier
refactor: simplificar lógica de disponibilidade
test: adicionar testes para check-in
chore: atualizar dependências
```

### Exemplo de Commit Completo

```bash
feat: adicionar filtro de reservas por data

- Adiciona campo de data no formulário
- Implementa filtro no backend
- Atualiza documentação da API

Closes #123
```

---

## 🔍 Revisão de Código

### Para Revisores

Ao revisar um PR:

1. **Verifique** se segue os padrões
2. **Teste** as mudanças localmente
3. **Sugira** melhorias construtivamente
4. **Aprove** ou solicite mudanças
5. **Seja** respeitoso e educado

### Checklist de Revisão

- [ ] Código segue os padrões
- [ ] Funcionalidade funciona como esperado
- [ ] Testes passam
- [ ] Documentação atualizada
- [ ] Sem código duplicado
- [ ] Sem vulnerabilidades de segurança
- [ ] Performance aceitável

---

## 🎯 Áreas para Contribuir

### Backend
- Adicionar testes automatizados
- Implementar rate limiting
- Adicionar cache (Redis)
- Melhorar performance de queries
- Adicionar mais validações

### Frontend
- Melhorar UX/UI
- Adicionar mais filtros
- Implementar paginação
- Adicionar gráficos
- Melhorar responsividade

### Integrações
- Completar integração n8n
- Integrar PIX real
- Adicionar notificações email
- Integrar com OTAs

### Documentação
- Adicionar mais exemplos
- Criar tutoriais em vídeo
- Traduzir para outros idiomas
- Melhorar troubleshooting

### Infraestrutura
- Configurar CI/CD
- Criar Docker containers
- Configurar monitoring
- Implementar backups automáticos

---

## 📞 Contato

Para dúvidas sobre contribuição:

- Abra uma issue com a tag `question`
- Consulte a documentação existente
- Revise PRs anteriores para exemplos

---

## 🙏 Agradecimentos

Obrigado por contribuir para o Sistema Residencial Hortel!

Toda contribuição, grande ou pequena, é valorizada e apreciada.

---

**Última atualização:** Novembro 2024  
**Versão:** 1.0.0
