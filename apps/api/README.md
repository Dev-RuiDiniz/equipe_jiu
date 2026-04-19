# apps/api

API NestJS da plataforma Equipe Jiu.

## Módulos implementados
- `auth`: login, refresh, logout, forgot/reset password e `me`
- `contatos`: recebimento publico e gestao interna
- `alunos`: cadastro, consulta, atualizacao e status ativo/inativo
- `aulas`: cadastro, filtros, atualizacao, cancelamento e remocao
- `presencas`: registro por aula/aluno, historico e exportacao CSV
- `graduacoes`: cadastro e historico por aluno
- `dashboard`: resumo operacional e frequencia mensal

## Stack
- NestJS 10
- Prisma ORM 6
- PostgreSQL
- JWT + Passport
- `class-validator` para validacao de DTOs

## Pré-requisitos
- Node.js 20+
- PostgreSQL em execucao

## Setup local
```bash
cd apps/api
npm install
cp ../../.env.example .env
```

Atualize o `.env` com os valores reais.

## Variáveis de ambiente usadas
- `DATABASE_URL`
- `API_PORT` (default `3001`)
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (default `15m`)
- `JWT_REFRESH_EXPIRES_IN` (default `7d`)
- `CORS_ORIGINS` (opcional, separado por virgula)

## Banco de dados (Prisma)
```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
```

O seed inicial cria:
- 1 usuario `admin`
- 1 usuario `professor`

## Execução
```bash
# desenvolvimento
npm run start:dev

# build de produção
npm run build
npm run start
```

Base URL local: `http://localhost:3001/api/v1`

## Scripts principais
- `npm run lint`
- `npm run build`
- `npm run test -- --runInBand`
- `npm run prisma:generate`
- `npm run prisma:migrate:dev`
- `npm run prisma:migrate:deploy`
- `npm run prisma:seed`

## Estrutura resumida
```text
src/
|-- auth/
|-- contatos/
|-- alunos/
|-- aulas/
|-- presencas/
|-- graduacoes/
|-- dashboard/
|-- prisma/
`-- common/
```

## Observações de produto
- O fluxo de `forgot-password` e `reset-password` esta funcional, mas com token de recuperacao em memoria (sem envio SMTP nesta fase).
- Cookies de sessao usam `httpOnly` com `sameSite=lax`; em producao, habilitar `secure=true`.
