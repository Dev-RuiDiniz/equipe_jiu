# Relatório Funcional do Sistema

## 1. Visão Geral
- Objetivo aparente do sistema: plataforma web da equipe de jiu-jitsu para captação pública de leads e operação administrativa (aulas, presenças, alunos, dashboard).
- Tecnologias utilizadas:
  - Frontend: Next.js 14 (App Router), React 18, TypeScript, Tailwind.
  - Backend: NestJS 10, JWT + Passport, class-validator, Prisma.
  - Banco: PostgreSQL (schema Prisma + migration inicial).
  - Infra: Docker Compose (dev/prod), Nginx, workflow GitHub Actions focado em estrutura/documentação.
- Estrutura geral:
  - `apps/web`: páginas públicas e painel administrativo.
  - `apps/api`: API REST modular.
  - `apps/api/prisma`: modelo de dados, migrations e seed.
  - `infra`: compose + Nginx.
  - `docs`: contratos, escopo, arquitetura e roadmap.

## 2. Estado Atual do Sistema
- O que está funcionando:
  - Rotas públicas renderizando normalmente.
  - Login administrativo com cookie `httpOnly` e validação de sessão (`auth/me`).
  - Dashboard administrativo com dados reais de API.
  - Listagem/cancelamento de aulas.
  - Chamada de presenças por aula + exportação CSV.
  - Cadastro de aluno + ativar/inativar.
  - Persistência de contatos públicos.
- O que está parcial:
  - Recuperação de senha (token em memória; sem e-mail real).
  - Gestão de aulas e alunos no frontend (não cobre CRUD completo).
  - CI sem pipeline de build/test para web/api (apenas validação de estrutura docs).
- O que está quebrado:
  - `npm run lint` em `apps/api` falha por dependência/configuração (`Cannot find module 'typescript-eslint'`).
- O que está apenas visual/mockado:
  - Galeria pública usa dados estáticos e imagens repetidas (sem backend).
  - Parte institucional (home/sobre/modalidades) é conteúdo estático.
  - Botão “Esqueci minha senha” no login não abre/ancora fluxo adicional (fluxo separado em card lateral).

## 3. Mapa de Páginas e Telas
| Página | Rota | Objetivo | Status | Observações |
|---|---|---|---|---|
| Home | `/` | Landing institucional com CTA | Completa | Conteúdo estático; CTA para contato/WhatsApp |
| Sobre | `/sobre` | História, valores, professores | Completa | Conteúdo estático |
| Modalidades | `/modalidades` | Turmas, horários, faixas | Completa | Conteúdo estático |
| Galeria | `/galeria` | Mostrar mídia/resultados | Apenas visual | Dados locais em memória; sem integração API |
| Contato | `/contato` | Captar lead | Completa | POST real para `/contatos` |
| Redirecionador Adm | `/adm` | Direcionar para painel | Completa | Redirect server-side para `/adm/dashboard` |
| Login Adm | `/adm/login` | Autenticar usuário | Parcial | Login funciona; UX de recuperação ainda limitada |
| Dashboard Adm | `/adm/dashboard` | KPIs e agenda | Completa | Consome `/dashboard/*` e `/aulas` |
| Aulas Adm | `/adm/aulas` | Gestão de agenda | Parcial | Lista/filtro/cancela; sem create/update/delete na UI |
| Presenças Adm | `/adm/presencas` | Chamada e histórico | Completa | Registro e export CSV funcionais |
| Alunos Adm | `/adm/alunos` | Cadastro e status | Parcial | Cadastra/ativa/inativa; sem edição de ficha |
| Erro padrão Next | `/_not-found` | Fallback 404 | Completa | Padrão framework |

## 4. Mapa de Funcionalidades
| Funcionalidade | Módulo | Como funciona atualmente | O que deveria fazer | Status | Prioridade |
|---|---|---|---|---|---|
| Autenticação | `auth` | Login por email/senha, cookies access/refresh, `/auth/me` | Incluir hardening completo (secure cookie por ambiente, rotação/revogação robusta) | Parcialmente implementada | Alta |
| Refresh de sessão | `auth` | Reemite tokens validando JWT refresh | Persistir/revogar refresh tokens | Parcialmente implementada | Alta |
| Recuperação de senha | `auth` | Gera token em memória e redefine senha | Persistir token + envio SMTP + fluxo seguro de expiração/revogação | Parcialmente implementada | Alta |
| Controle de perfis | `auth` + `roles` | `JwtAuthGuard` + `RolesGuard` para admin/professor | Expandir papéis/casos finos se necessário | Implementada e funcional | Média |
| Contato público | `contatos` | Form envia para API e persiste | Adicionar painel admin para triagem | Implementada e funcional | Média |
| Gestão de contatos admin | `contatos` (API sem tela) | Endpoints existem | Tela para listar/marcar lido | Ausente no frontend | Média |
| CRUD de alunos | `alunos` | API tem create/list/get/update/status; UI faz create/list/status | Cobrir edição completa na UI e validações de negócio adicionais | Parcialmente implementada | Alta |
| CRUD de aulas | `aulas` | API completa; UI lista/filtra/cancela | UI para create/update/delete | Parcialmente implementada | Alta |
| Presenças | `presencas` | Chamada por aula via upsert/remove + histórico + CSV | Incluir filtros avançados e auditoria | Implementada e funcional | Média |
| Graduações | `graduacoes` | API para criar e histórico por aluno | Tela administrativa para operação | Parcialmente implementada | Média |
| Dashboard | `dashboard` | KPIs e frequência mensal agregada | Melhorar semântica de métricas e observabilidade | Implementada e funcional | Média |
| Logs/Auditoria | transversal | Logs básicos do runtime | Auditoria funcional (quem alterou o quê) | Ausente | Média |
| Pagamentos | - | Não identificado | Se parte do escopo futuro, inexistente | Ausente | Baixa |

## 5. Backend/API
| Método | Endpoint | Objetivo | Status | Observações |
|---|---|---|---|---|
| GET | `/api/v1/health` | Health check | Funcional | Sem autenticação |
| POST | `/api/v1/auth/login` | Login e cookies | Funcional | Rate limit in-memory |
| POST | `/api/v1/auth/refresh` | Renovar sessão | Parcial | Sem revogação persistente de refresh token |
| POST | `/api/v1/auth/logout` | Encerrar sessão | Funcional | Limpa cookies |
| POST | `/api/v1/auth/forgot-password` | Iniciar recuperação | Parcial | Sem SMTP; token só em memória |
| POST | `/api/v1/auth/reset-password` | Redefinir senha | Parcial | Depende do token in-memory |
| GET | `/api/v1/auth/me` | Sessão atual | Funcional | Protegido por JWT |
| POST | `/api/v1/contatos` | Criar contato público | Funcional | Sem auth |
| GET | `/api/v1/contatos` | Listar contatos | Funcional | Protegido |
| PATCH | `/api/v1/contatos/:id/lido` | Marcar lido | Funcional | Protegido |
| POST | `/api/v1/alunos` | Criar aluno | Funcional | Protegido |
| GET | `/api/v1/alunos` | Listar alunos com filtros | Funcional | Protegido |
| GET | `/api/v1/alunos/:id` | Detalhar aluno | Funcional | Inclui graduações |
| PATCH | `/api/v1/alunos/:id` | Atualizar aluno | Funcional | Protegido |
| PATCH | `/api/v1/alunos/:id/status` | Ativar/inativar | Funcional | Protegido |
| POST | `/api/v1/aulas` | Criar aula | Funcional | Protegido |
| GET | `/api/v1/aulas` | Listar aulas com filtros | Funcional | Protegido |
| GET | `/api/v1/aulas/:id` | Detalhar aula | Funcional | Protegido |
| PATCH | `/api/v1/aulas/:id` | Atualizar aula | Funcional | Protegido |
| PATCH | `/api/v1/aulas/:id/cancelar` | Cancelar aula | Funcional | DTO aceita motivo, mas serviço ignora motivo |
| DELETE | `/api/v1/aulas/:id` | Excluir aula | Funcional | Protegido |
| POST | `/api/v1/presencas` | Registrar presença | Funcional | Usa upsert/deleteMany |
| GET | `/api/v1/presencas/aula/:aulaId` | Histórico por aula | Funcional | Protegido |
| GET | `/api/v1/presencas/aluno/:alunoId` | Histórico por aluno | Funcional | Protegido |
| GET | `/api/v1/presencas/export` | Exportar CSV | Funcional | Retorna 404 quando vazio |
| POST | `/api/v1/graduacoes` | Criar graduação | Funcional | Protegido |
| GET | `/api/v1/graduacoes/aluno/:alunoId` | Histórico graduação | Funcional | Protegido |
| GET | `/api/v1/dashboard/resumo` | KPIs | Funcional | Protegido |
| GET | `/api/v1/dashboard/frequencia-mensal` | Série mensal | Funcional | Protegido |

## 6. Frontend
- Páginas implementadas:
  - Públicas: `/`, `/sobre`, `/modalidades`, `/galeria`, `/contato`.
  - Admin: `/adm/login`, `/adm/dashboard`, `/adm/aulas`, `/adm/presencas`, `/adm/alunos`.
- Componentes principais:
  - Shells (`PublicShell`, `AdmShell`), formulários admin, tabela, badges, estados de loading/erro/vazio.
- Integração com API:
  - Cliente central `api-client` com `credentials: include`.
  - Integrações reais: auth, dashboard, aulas, presenças, alunos, contato.
  - Não integrada: galeria e gestão administrativa de contatos/graduacoes na UI.
- Problemas encontrados:
  - Tipos frontend (`AulaApi`, `AlunoApi`) esperam `atualizadoEm`, mas schema/backend não expõe esse campo.
  - Fluxos de edição completos de aulas/alunos não presentes na interface.
  - Recuperação de senha com UX parcial (solicitação existe, mas fluxo de redefinição não está representado na UI).

## 7. Banco de Dados
- Entidades identificadas:
  - `usuarios`, `alunos`, `aulas`, `presencas`, `graduacoes`, `contatos`.
- Relacionamentos:
  - `usuarios -> aulas`, `usuarios -> graduacoes`, `alunos -> presencas`, `alunos -> graduacoes`, `aulas -> presencas`.
- Migrações:
  - 1 migration inicial (`202604190001_init`) coerente com schema Prisma.
- Inconsistências:
  - Não há campos de atualização (`updated_at`/`atualizadoEm`) apesar de tipos frontend sugerirem existência.
  - Sem tabela/estrutura para refresh tokens persistentes e recuperação de senha persistida.

## 8. Integrações Externas
- Integrações existentes:
  - PostgreSQL (ativa por Prisma).
  - WhatsApp (links estáticos na UI).
  - Google Maps Embed (iframe na página de contato).
- Integrações previstas/pendentes:
  - SMTP configurável em `.env.example`, porém sem implementação real de envio de e-mail.
- Variáveis necessárias:
  - API: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `API_PORT`, `CORS_ORIGINS`.
  - Web: `NEXT_PUBLIC_API_BASE_URL` (+ variáveis de branding).
  - SMTP (não usado no código atual): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- Pendências:
  - Implementar provedor de e-mail, template e fluxo de token persistido para recuperação.

## 9. Segurança
- Pontos positivos:
  - Hash de senha com bcryptjs.
  - Cookies `httpOnly` para sessão.
  - Guards de autenticação e autorização por papel.
  - Validação de DTOs com `class-validator` e `ValidationPipe` global.
- Vulnerabilidades/riscos:
  - Crítico: recuperação de senha e rate limit em memória (não resiliente, não escalável, perde estado em restart).
  - Alto: refresh token sem persistência/revogação robusta.
  - Alto: `cookieOptions.secure = false` fixo no backend, inadequado para produção HTTPS.
  - Médio: ausência de auditoria de ações administrativas.
  - Médio: ausência explícita de rate limiting global por middleware/proxy.
  - Baixo: mensagens e convenções sem padronização completa de erro por domínio.
- Recomendações:
  - Persistir/revogar refresh tokens e tokens de recuperação em banco com expiração.
  - Ativar `secure` por ambiente e reforçar política de cookies.
  - Adicionar rate limit em camada compartilhada (Redis/proxy).
  - Incluir logs de auditoria por ação sensível.

## 10. Problemas Encontrados
| Problema | Local | Severidade | Impacto | Recomendação |
|---|---|---|---|---|
| Lint da API falha por módulo ausente/config | `apps/api/eslint.config.js` | Alto | Quebra pipeline de qualidade estática | Corrigir dependência/config (`typescript-eslint`) e validar lockfile |
| Recuperação de senha sem persistência e sem SMTP | `apps/api/src/auth/auth.service.ts` | Crítico | Fluxo frágil e inseguro em produção | Persistir token com TTL + envio SMTP real |
| Refresh token sem blacklist/rotação persistente | `apps/api/src/auth/auth.service.ts` | Alto | Sessões não revogáveis de forma robusta | Implementar tabela de sessão/refresh e rotação |
| Cookie `secure` fixado em `false` | `apps/api/src/auth/auth.controller.ts` | Alto | Risco em ambiente HTTPS/produção | Tornar condicional por ambiente (`NODE_ENV`) |
| UI sem CRUD completo de aulas | `apps/web/src/adm/pages/adm-aulas-page.tsx` | Médio | Operação administrativa incompleta | Adicionar criar/editar/excluir com validação |
| UI sem edição completa de aluno | `apps/web/src/adm/pages/adm-alunos-page.tsx` | Médio | Fluxo acadêmico incompleto | Incluir edição de ficha e histórico |
| Gestão de contatos sem tela admin | `apps/web/src/adm/*` | Médio | Leads sem triagem operacional no painel | Implementar listagem/marcação de contato |
| Gestão de graduações sem tela admin | `apps/web/src/adm/*` | Médio | Processo de graduação dependente de chamadas manuais | Implementar UI de graduação |
| Divergência de tipos (`atualizadoEm`) | `apps/web/src/adm/types/api.ts` vs schema/api | Médio | Risco de inconsistência e bugs de tipagem | Alinhar contrato frontend-backend |

## 11. O Que Falta Para Concluir o Projeto
- Funcionalidades pendentes:
  - Tela admin para contatos.
  - Tela admin para graduações.
  - CRUD completo de aulas no frontend.
  - Edição completa de alunos no frontend.
- Ajustes técnicos necessários:
  - Consertar lint da API.
  - Implementar sessão robusta com refresh token persistido.
  - Implementar recuperação de senha com SMTP e persistência.
  - Ajustar segurança de cookies por ambiente.
- Ajustes visuais necessários:
  - Melhorar UX do fluxo de recuperação de senha no login.
- Integrações pendentes:
  - Provedor SMTP real e templates de e-mail.
- Testes necessários:
  - Cobertura de auth (login/refresh/recovery).
  - Regras de presença (upsert/remoção).
  - Regras de cancelamento de aula e status de aluno.
  - Testes E2E de fluxos administrativos críticos.
- Documentações pendentes:
  - Playbook de segurança e operação (tokens, rotação, incidentes).
  - Runbook de deploy real com validações pós-subida.

## 12. Próximas Recomendações
1. Corrigir base de segurança (refresh/recovery persistentes + cookie secure por ambiente).
2. Restabelecer qualidade estática da API (lint funcional e travado no CI).
3. Completar UI administrativa pendente (contatos, graduações, CRUD de aulas/alunos).
4. Alinhar contratos de tipos frontend/backend e revisar DTOs de campos não utilizados.
5. Expandir cobertura de testes automatizados para regras de negócio críticas.
6. Evoluir pipeline CI para build/test/lint de web e api.

## Execução de testes desta auditoria
- Comandos executados:
  - `apps/api`: `npm run build` (OK), `npm run test -- --runInBand` (OK), `npm run lint` (FALHA).
  - `apps/web`: `npm run lint` (OK), `npm run build` (OK).
- Resultado objetivo:
  - Build e testes principais passam.
  - Lint da API falha por configuração/dependência de ESLint.
- Observação:
  - Não foi executado smoke test HTTP manual de endpoints com servidor + banco ativos nesta auditoria.
