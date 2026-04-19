# Equipe Jiu - Plataforma Web e Painel de Professores

Repositorio monorepo do projeto full-stack do time de jiu-jitsu, com site publico e area restrita para professores.

## Objetivo
Organizar a base tecnica e evoluir por fases, com entregas versionadas de frontend, backend, dados e infraestrutura.

## Arquitetura proposta
- Frontend: Next.js 14 + React + Tailwind CSS
- Backend: NestJS + JWT + Passport + Prisma ORM
- Banco de dados: PostgreSQL
- Infraestrutura: Docker Compose + Nginx + SSL (Certbot) + GitHub Actions

## Estrutura do repositorio
```text
.
|-- apps/
|   |-- web/
|   |   `-- src/
|   |       |-- app/
|   |       |-- publicas/
|   |       `-- adm/
|   `-- api/
|-- packages/
|   |-- shared-types/
|   `-- config/
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

## Rotas atuais do frontend
### Publicas
- `/`
- `/sobre`
- `/modalidades`
- `/galeria`
- `/contato`

### Administrativas
- `/adm` (redireciona para `/adm/dashboard`)
- `/adm/login`
- `/adm/dashboard`
- `/adm/aulas`
- `/adm/presencas`
- `/adm/alunos`

## Como executar o frontend
```bash
cd apps/web
npm install
npm run dev
```

## Documentacao
- Visao da documentacao: [docs/README.md](docs/README.md)
- Escopo funcional: [docs/produto/escopo-funcional.md](docs/produto/escopo-funcional.md)
- Banco de dados: [docs/dados/modelo-de-dados.md](docs/dados/modelo-de-dados.md)
- API e autenticacao: [docs/api/contratos-rest.md](docs/api/contratos-rest.md)
- Deploy e operacao: [docs/infra/deploy-vps-docker-nginx.md](docs/infra/deploy-vps-docker-nginx.md)
- Roadmap: [docs/roadmap/fases-entrega.md](docs/roadmap/fases-entrega.md)

## Estado atual
- Frontend visual das 5 paginas publicas implementado.
- Frontend visual das 5 paginas administrativas implementado.
- Estrutura de dominio separada entre `publicas` e `adm` no `apps/web`.
- Area `adm` com telas visuais completas e dados mockados (sem autenticacao funcional).
- Backend/API ainda nao integrados ao frontend nesta fase.

## Contribuicao
Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para fluxo e padrao de commit.
