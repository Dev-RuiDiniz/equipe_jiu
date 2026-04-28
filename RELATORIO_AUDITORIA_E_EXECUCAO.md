# Auditoria Técnica e Plano de Execução

## Visão geral do sistema
- Monorepo com duas aplicações principais:
  - `apps/api`: API NestJS modular com Prisma/PostgreSQL.
  - `apps/web`: frontend Next.js (App Router) com área pública e administrativa.
- Domínio principal: operação de academia/equipe de jiu-jitsu (alunos, aulas, presença, graduação, leads, dashboard).
- Arquitetura atual:
  - Boa separação por módulos no backend.
  - Frontend separado por domínios (`publicas` e `adm`).
  - Infra e docs presentes no mesmo repositório.

## Pontos fortes
- API com módulos coesos e DTOs com validação.
- Proteção de rotas com autenticação e autorização por papel.
- Frontend com componentes reutilizáveis no painel admin.
- Integração real entre web e api para os fluxos centrais.
- Build e lint do frontend estáveis.

## Problemas críticos
1. Recuperação de senha não robusta (anteriormente em memória, sem persistência).
2. Refresh token sem persistência/revogação robusta.
3. Cookie de sessão inseguro em produção (`secure` fixo em `false` na versão anterior).

## Problemas médios
1. Lint da API quebrado por configuração inconsistente.
2. Fluxos administrativos incompletos (contatos e graduações ausentes na UI na versão anterior).
3. Divergência de contrato frontend-backend (`atualizadoEm` inexistente no payload real).
4. Cobertura de testes de regras de negócio limitada.
5. CI sem validação contínua de apps.

## Melhorias recomendadas
- Concluir integração SMTP real no fluxo de recuperação.
- Finalizar CRUD completo de aulas e edição completa de alunos no frontend.
- Ampliar testes unitários e E2E de auth e módulos administrativos.
- Adicionar auditoria de ações administrativas.

---

## 5 Tarefas prioritárias

### 1) Hardening de autenticação e sessão
- Objetivo: aumentar segurança e previsibilidade do ciclo de sessão.
- Descrição técnica:
  - Persistir refresh tokens em banco com rotação/revogação.
  - Persistir tokens de recuperação com expiração e marcação de uso.
  - Tornar cookie `secure` condicionado ao ambiente.
- Módulos impactados:
  - `apps/api/src/auth/*`
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/migrations/*`
- Critérios de aceite:
  - Login cria refresh token persistido.
  - Refresh revoga token anterior e emite novo.
  - Logout revoga token atual quando presente.
  - Reset de senha valida token persistido e vencimento.
  - Cookie seguro em produção.
- Esforço: Alto.
- Status: **Concluída nesta execução**.

### 2) Correção do lint da API
- Objetivo: restaurar qualidade estática e evitar regressões.
- Descrição técnica:
  - Ajustar configuração ESLint para funcionar com dependências existentes.
  - Corrigir contexto de testes (`jest`, `describe`, `beforeEach`, etc.).
- Módulos impactados:
  - `apps/api/eslint.config.js`
- Critérios de aceite:
  - `npm run lint` da API executa sem erros.
- Esforço: Baixo.
- Status: **Concluída nesta execução**.

### 3) Pipeline CI para web e api
- Objetivo: garantir validação automática em PR/push.
- Descrição técnica:
  - Adicionar workflow com jobs separados para API e Web.
  - Rodar `install`, `lint`, `build` e `test` (API).
- Módulos impactados:
  - `.github/workflows/ci-apps.yml`
- Critérios de aceite:
  - Workflow disparado em push/PR com comandos dos apps.
- Esforço: Médio.
- Status: **Concluída nesta execução**.

### 4) Completar fluxos admin pendentes (contatos e graduações)
- Objetivo: reduzir gap funcional do painel administrativo.
- Descrição técnica:
  - Criar tela de contatos para listar e marcar lido.
  - Criar tela de graduações para registrar e visualizar histórico.
  - Integrar rotas App Router e menu administrativo.
- Módulos impactados:
  - `apps/web/src/adm/pages/*`
  - `apps/web/src/app/adm/*`
  - `apps/web/src/adm/components/adm-shell.tsx`
  - `apps/web/src/adm/types.ts`
- Critérios de aceite:
  - Rotas novas disponíveis no painel.
  - Operações funcionais usando endpoints existentes.
- Esforço: Médio.
- Status: **Concluída nesta execução**.

### 5) Alinhamento de contratos frontend-backend + aumento de testes
- Objetivo: evitar inconsistências de tipagem e melhorar segurança de evolução.
- Descrição técnica:
  - Remover campos não existentes (`atualizadoEm`) dos tipos API frontend.
  - Adicionar tipos para contatos e graduações.
  - Incluir testes unitários de regra de presença.
- Módulos impactados:
  - `apps/web/src/adm/types/api.ts`
  - `apps/api/src/presencas/presencas.service.spec.ts`
- Critérios de aceite:
  - Build web sem inconsistências de contrato.
  - Testes da API contemplando regra de presença.
- Esforço: Médio.
- Status: **Concluída nesta execução**.

---

## Execução prática realizada
- Implementação de hardening em auth (persistência de tokens e cookie seguro por ambiente).
- Criação de migration de tokens (`refresh_tokens` e `password_reset_tokens`).
- Correção de ESLint da API.
- Criação de CI para API e Web.
- Implementação das telas admin `/adm/contatos` e `/adm/graduacoes`.
- Alinhamento de tipos entre frontend e backend.
- Inclusão de testes unitários em `PresencasService`.

## Validações executadas
- API:
  - `npm run prisma:generate` ✅
  - `npm run lint` ✅
  - `npm run build` ✅
  - `npm run test -- --runInBand` ✅
- Web:
  - `npm run lint` ✅
  - `npm run build` ✅

## Pendências remanescentes
- Implementar envio SMTP real para recuperação de senha.
- CRUD completo de aulas e edição completa de alunos no frontend.
- Expandir cobertura de testes para auth, alunos, aulas e graduações.
