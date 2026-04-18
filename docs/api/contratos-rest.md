# Contratos REST e Autenticacao JWT

Este documento define os contratos iniciais da API para suportar o site publico e o painel de professores.

## Base da API
- Base URL (exemplo): `/api/v1`
- Formato: JSON
- Autenticacao: JWT em cookie `httpOnly`
- Autorizacao: papel `admin` e `professor`

## Fluxo de autenticacao
1. `POST /auth/login` valida email/senha.
2. API gera `access token` e `refresh token`.
3. Tokens sao enviados em cookie `httpOnly`.
4. Guard de autenticacao valida token em rotas privadas.
5. Guard de papel valida permissoes por endpoint.

## Modulo Auth

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
    "nome": "Professor A",
    "email": "professor@equipejiu.com",
    "papel": "professor"
  }
}
```

### POST /auth/refresh
- Renova token de acesso com refresh token valido.

### POST /auth/logout
- Invalida sessao e remove cookies.

### POST /auth/forgot-password
Request:
```json
{
  "email": "professor@equipejiu.com"
}
```
- Dispara email com token de recuperacao.

### POST /auth/reset-password
Request:
```json
{
  "token": "reset-token",
  "novaSenha": "NovaSenhaForte123"
}
```

## Modulo Alunos

### GET /alunos
- Lista alunos com filtros (`ativo`, `faixa`, `nome`).

### POST /alunos
Request:
```json
{
  "nome": "Aluno Exemplo",
  "cpf": "000.000.000-00",
  "dataNascimento": "2010-05-01",
  "faixa": "branca",
  "grau": 0,
  "telefone": "+55 11 99999-9999",
  "fotoUrl": "https://..."
}
```

### GET /alunos/:id
- Retorna ficha completa, frequencia e historico de graduacoes.

### PATCH /alunos/:id
- Atualiza dados cadastrais e status.

### PATCH /alunos/:id/status
Request:
```json
{
  "ativo": false
}
```

## Modulo Aulas

### GET /aulas
- Filtros: `dataInicio`, `dataFim`, `modalidade`, `cancelada`.

### POST /aulas
Request:
```json
{
  "titulo": "Treino No-Gi",
  "descricao": "Treino tecnico e situacional",
  "modalidade": "adulto",
  "dataHora": "2026-05-10T19:00:00Z",
  "duracaoMin": 60,
  "vagas": 30
}
```

### PATCH /aulas/:id
- Atualiza campos da aula.

### PATCH /aulas/:id/cancelar
Request:
```json
{
  "motivo": "Evento externo"
}
```

### DELETE /aulas/:id
- Remove aula quando politica de negocio permitir.

## Modulo Presencas

### GET /presencas/aula/:aulaId
- Lista chamada da aula.

### POST /presencas
Request:
```json
{
  "aulaId": "uuid",
  "alunoId": "uuid",
  "presente": true,
  "observacao": "Chegou no horario"
}
```

### GET /presencas/aluno/:alunoId
- Historico de presenca do aluno.

### GET /presencas/export
- Exportacao CSV com filtros por periodo e modalidade.

## Modulo Graduacoes

### GET /graduacoes/aluno/:alunoId
- Retorna historico de faixa/grau do aluno.

### POST /graduacoes
Request:
```json
{
  "alunoId": "uuid",
  "faixa": "azul",
  "grau": 1,
  "dataGraduacao": "2026-04-01",
  "observacao": "Graduacao trimestral"
}
```

## Modulo Contatos

### POST /contatos
Request:
```json
{
  "nome": "Visitante",
  "email": "visitante@email.com",
  "interesse": "kids",
  "mensagem": "Gostaria de agendar aula experimental"
}
```

### GET /contatos
- Rota restrita para listar mensagens recebidas.

### PATCH /contatos/:id/lido
Request:
```json
{
  "lido": true
}
```

## Modulo Dashboard

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
- Retorna serie temporal para grafico.

## DTOs basicos (referencia)
- `LoginDto`: `email`, `senha`
- `CreateAlunoDto`: dados cadastrais e graduacao atual
- `CreateAulaDto`: metadados de agenda e capacidade
- `RegistrarPresencaDto`: `aulaId`, `alunoId`, `presente`, `observacao`
- `CreateGraduacaoDto`: `alunoId`, `faixa`, `grau`, `dataGraduacao`, `observacao`
- `CreateContatoDto`: `nome`, `email`, `interesse`, `mensagem`

## Mapeamento de rotas de frontend

### Rotas publicas
- `/`
- `/sobre`
- `/modalidades`
- `/galeria`
- `/contato`

### Rotas protegidas
- `/login`
- `/dashboard`
- `/dashboard/aulas`
- `/dashboard/presencas`
- `/dashboard/alunos`
- `/dashboard/graduacoes`

## Convencoes de erro
Formato padrao sugerido:
```json
{
  "statusCode": 400,
  "message": "Dados invalidos",
  "error": "Bad Request"
}
```

## Seguranca inicial
- Rate limit em login e recuperacao de senha.
- Senhas com hash forte (argon2 ou bcrypt com custo adequado).
- Cookies `httpOnly`, `secure` em producao e `sameSite` configurado.
- Auditoria de acoes sensiveis (cancelamento de aula, graduacao e inativacao de aluno).
