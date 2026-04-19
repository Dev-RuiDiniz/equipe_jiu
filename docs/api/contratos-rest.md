# Contratos REST e Autenticacao JWT

Documento de referencia dos contratos atualmente implementados em `apps/api`.

## Base da API
- Prefixo: `/api/v1`
- Formato: JSON (exceto exportacao CSV)
- Sessao: cookie `httpOnly` (`access_token` e `refresh_token`)
- Autorizacao por papel: `admin` e `professor`

## Fluxo de autenticacao
1. `POST /auth/login` valida credenciais e retorna `usuario`.
2. API grava cookies `httpOnly` de acesso e refresh.
3. Rotas protegidas validam cookie com `JwtAuthGuard`.
4. Guard de papel (`RolesGuard`) bloqueia acesso sem permissao.
5. `POST /auth/refresh` renova cookies ativos.

## Auth

### POST /auth/login
Request:
```json
{
  "email": "professor@equipejiu.com",
  "senha": "SenhaForte123"
}
```

Response 200:
```json
{
  "usuario": {
    "id": "uuid",
    "nome": "Professor BJJ",
    "email": "professor@equipejiu.com",
    "papel": "professor"
  }
}
```

### POST /auth/refresh
Response 200:
```json
{
  "usuario": {
    "id": "uuid",
    "nome": "Professor BJJ",
    "email": "professor@equipejiu.com",
    "papel": "professor"
  }
}
```

### POST /auth/logout
Response 200:
```json
{
  "message": "Sessao encerrada com sucesso."
}
```

### POST /auth/forgot-password
Request:
```json
{
  "email": "professor@equipejiu.com"
}
```

Response 200:
```json
{
  "message": "Se o e-mail existir, enviaremos instrucoes para redefinicao de senha."
}
```

### POST /auth/reset-password
Request:
```json
{
  "token": "token-recuperacao",
  "novaSenha": "NovaSenha123"
}
```

### GET /auth/me
Retorna usuario autenticado no cookie.

## Contatos

### POST /contatos (publico)
Request:
```json
{
  "nome": "Visitante",
  "email": "visitante@email.com",
  "interesse": "Kids",
  "mensagem": "Quero agendar aula experimental"
}
```

### GET /contatos (protegido)
Lista contatos mais recentes.

### PATCH /contatos/:id/lido (protegido)
Request:
```json
{
  "lido": true
}
```

## Alunos

### GET /alunos
Filtros opcionais:
- `ativo=true|false`
- `faixa=Azul`
- `nome=larissa`

### POST /alunos
Request:
```json
{
  "nome": "Larissa M.",
  "cpf": "000.000.000-00",
  "dataNascimento": "2010-05-01",
  "faixa": "Azul",
  "grau": 1,
  "telefone": "+55 11 99999-9999",
  "fotoUrl": "https://exemplo.com/foto.jpg"
}
```

### GET /alunos/:id
Retorna aluno com historico de graduacoes.

### PATCH /alunos/:id
Atualiza dados cadastrais.

### PATCH /alunos/:id/status
Request:
```json
{
  "ativo": false
}
```

## Aulas

### GET /aulas
Filtros opcionais:
- `dataInicio=2026-04-01T00:00:00.000Z`
- `dataFim=2026-04-30T23:59:59.999Z`
- `modalidade=Adulto`
- `cancelada=true|false`

### POST /aulas
Request:
```json
{
  "titulo": "No-Gi Avancado",
  "descricao": "Treino tecnico e situacional",
  "professorId": "uuid-do-professor",
  "modalidade": "Adulto",
  "dataHora": "2026-05-10T19:00:00Z",
  "duracaoMin": 60,
  "vagas": 30
}
```

### GET /aulas/:id
Retorna dados completos da aula.

### PATCH /aulas/:id
Atualiza dados da aula.

### PATCH /aulas/:id/cancelar
Request:
```json
{
  "motivo": "Evento externo"
}
```

### DELETE /aulas/:id
Remove aula cadastrada.

## Presencas

### POST /presencas
Request:
```json
{
  "aulaId": "uuid-aula",
  "alunoId": "uuid-aluno",
  "presente": true,
  "observacao": "Chegou no horario"
}
```

### GET /presencas/aula/:aulaId
Lista presencas da aula (com dados do aluno).

### GET /presencas/aluno/:alunoId
Lista historico de presencas do aluno (com dados da aula).

### GET /presencas/export
Retorna CSV (`text/csv`) com filtros opcionais:
- `dataInicio`
- `dataFim`
- `modalidade`

## Graduacoes

### POST /graduacoes
Request:
```json
{
  "alunoId": "uuid-aluno",
  "faixa": "Roxa",
  "grau": 2,
  "dataGraduacao": "2026-04-01",
  "professorId": "uuid-professor",
  "observacao": "Graduacao trimestral"
}
```

### GET /graduacoes/aluno/:alunoId
Retorna historico de faixas/graus do aluno.

## Dashboard

### GET /dashboard/resumo
Response 200:
```json
{
  "alunosAtivos": 120,
  "presencaMediaSemana": 82.5,
  "proximasAulas": 6,
  "alertasGraduacao": 4
}
```

### GET /dashboard/frequencia-mensal
Response 200 (exemplo):
```json
[
  { "mes": "2026-01", "totalPresencas": 64 },
  { "mes": "2026-02", "totalPresencas": 71 }
]
```

## Mapeamento de rotas frontend

### Rotas publicas
- `/`
- `/sobre`
- `/modalidades`
- `/galeria`
- `/contato`

### Rotas administrativas
- `/adm/login` (nao protegida por guard de frontend)
- `/adm/dashboard` (protegida por sessao)
- `/adm/aulas` (protegida por sessao)
- `/adm/presencas` (protegida por sessao)
- `/adm/alunos` (protegida por sessao)

## Convencao de erros
Formato padrao NestJS:
```json
{
  "statusCode": 400,
  "message": "Dados invalidos",
  "error": "Bad Request"
}
```

## Segurança implementada
- Rate limit in-memory para login e recovery.
- Hash de senha com `bcryptjs`.
- Cookies `httpOnly` com `sameSite=lax`.
- Guard de autenticacao e guard de papel nas rotas privadas.
