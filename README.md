# Equipe Jiu - Plataforma Web e Painel de Professores

Repositorio inicial do projeto full-stack do time de jiu-jitsu, com site publico e area restrita para professores.

## Objetivo
Entregar uma base organizada de monorepo com documentacao funcional e tecnica para orientar a implementacao das fases de desenvolvimento.

## Arquitetura proposta
- Frontend: Next.js 14 + React + Tailwind CSS + shadcn/ui
- Backend: NestJS + JWT + Passport + Prisma ORM
- Banco de dados: PostgreSQL
- Infraestrutura: Docker Compose + Nginx + SSL (Certbot) + GitHub Actions

## Estrutura do repositorio
```text
.
|-- apps/
|   |-- web/
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

## Documentacao
- Visao da documentacao: [docs/README.md](docs/README.md)
- Escopo funcional: [docs/produto/escopo-funcional.md](docs/produto/escopo-funcional.md)
- Banco de dados: [docs/dados/modelo-de-dados.md](docs/dados/modelo-de-dados.md)
- API e autenticacao: [docs/api/contratos-rest.md](docs/api/contratos-rest.md)
- Deploy e operacao: [docs/infra/deploy-vps-docker-nginx.md](docs/infra/deploy-vps-docker-nginx.md)
- Roadmap: [docs/roadmap/fases-entrega.md](docs/roadmap/fases-entrega.md)

## Paginas previstas
### Publicas (sem login)
1. Home
2. Sobre
3. Modalidades / Graduacoes
4. Galeria / Resultados
5. Contato / Inscricao

### Restritas (professores)
6. Login
7. Dashboard
8. Controle de Aulas
9. Presenca de Alunos
10. Cadastro e Acompanhamento

## Como iniciar a implementacao
1. Ajuste variaveis no arquivo `.env.example` conforme ambiente.
2. Implemente `apps/api` com modulos de auth, alunos, aulas, presencas e graduacoes.
3. Implemente `apps/web` com paginas publicas e painel protegido por autenticacao.
4. Suba stack local com Docker Compose (a ser consolidado em `infra/docker`).

## Estado atual
- Estrutura inicial do monorepo criada.
- Documentacao em andamento por dominio (produto, dados, api, infra e roadmap).
- Sem implementacao funcional de frontend/backend nesta rodada.

## Contribuicao
Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para fluxo e padrao de commit.
