# Equipe Jiu - Monorepo

Plataforma web do time de jiu-jitsu com:
- site publico (captacao e contato),
- area administrativa para professores,
- API NestJS com persistencia em PostgreSQL.

## Estado atual do projeto

### Entregue nesta fase
- Frontend publico implementado: `/`, `/sobre`, `/modalidades`, `/galeria`, `/contato`.
- Frontend administrativo implementado: `/adm/login`, `/adm/dashboard`, `/adm/aulas`, `/adm/presencas`, `/adm/alunos`.
- Integracao frontend-backend ativa para:
  - contato publico (`POST /contatos`);
  - login administrativo com sessao em cookie `httpOnly`;
  - dashboard com agregacoes reais;
  - listagem/cancelamento de aulas;
  - chamada e exportacao CSV de presencas;
  - cadastro e ativacao/inativacao de alunos.
- API NestJS modularizada com Prisma e schema inicial das 6 tabelas.
- Seed inicial com usuario `admin` e `professor`.

### O que falta para fechar 100% do escopo funcional
- Fluxo de recuperacao de senha com envio real por e-mail (atualmente token em memoria).
- Persistencia e revogacao robusta de refresh token (blacklist/rotacao).
- Telas web para:
  - gestao administrativa de `contatos` (GET/PATCH),
  - gestao de `graduacoes` no frontend.
- Operacoes completas de CRUD na UI de aulas e alunos (atualmente foco no fluxo principal).
- Testes automatizados de dominio (auth, regras de presenca, cancelamento, status de aluno).

## Stack
- Frontend: Next.js 14 + TypeScript + Tailwind
- Backend: NestJS + JWT + Passport
- Dados: Prisma ORM + PostgreSQL
- Infra (documentada): Docker Compose + Nginx + SSL + CI/CD

## Estrutura do repositório
```text
.
|-- apps/
|   |-- web/
|   `-- api/
|-- packages/
|   |-- config/
|   `-- shared-types/
|-- docs/
|   |-- arquitetura/
|   |-- produto/
|   |-- api/
|   |-- dados/
|   |-- infra/
|   `-- roadmap/
|-- infra/
|   |-- docker/
|   `-- nginx/
`-- .github/workflows/
```

## Como rodar localmente

### 1. API
```bash
cd apps/api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

API default: `http://localhost:3001/api/v1`

### 2. Web
```bash
cd apps/web
npm install
npm run dev
```

Web default: `http://localhost:3000`

### 3. Variáveis de ambiente
- API: `apps/api/.env` com `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `API_PORT`, `CORS_ORIGINS`.
- Web: `apps/web/.env.local` com `NEXT_PUBLIC_API_BASE_URL`.

## Documentação
- Visão geral: [docs/README.md](docs/README.md)
- Escopo funcional: [docs/produto/escopo-funcional.md](docs/produto/escopo-funcional.md)
- Contratos de API: [docs/api/contratos-rest.md](docs/api/contratos-rest.md)
- Arquitetura frontend: [docs/arquitetura/frontend-web.md](docs/arquitetura/frontend-web.md)
- Modelo de dados: [docs/dados/modelo-de-dados.md](docs/dados/modelo-de-dados.md)
- Roadmap: [docs/roadmap/fases-entrega.md](docs/roadmap/fases-entrega.md)

## Qualidade e validação
- Web: `npm run lint` e `npm run build`
- API: `npm run build` e `npm run test -- --runInBand`

## Contribuição
Siga [CONTRIBUTING.md](CONTRIBUTING.md) e o padrão Conventional Commits adotado no projeto.
