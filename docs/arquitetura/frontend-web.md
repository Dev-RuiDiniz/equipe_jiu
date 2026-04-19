# Frontend Web - Arquitetura e Convenções

Referência técnica de organização do `apps/web`.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

## Arquitetura por domínio
- `src/app`: camada fina de rotas, sem regra de negócio.
- `src/publicas`: UI e conteúdo das páginas públicas.
- `src/adm`: UI administrativa, sessão e integrações da área restrita.
- `src/lib`: infraestrutura de cliente HTTP compartilhado.

Fluxo padrão de rota:
- `src/app/rota/page.tsx` importa `src/publicas/pages/*` ou `src/adm/pages/*`.

## Organização administrativa

### Componentes base
- `adm-shell`: layout lateral + topo + validação de sessão.
- `adm-form-field`: campos de formulário.
- `adm-table`: tabela visual reutilizável.
- `adm-kpi-card`: cards de indicadores.
- `adm-status-badge`: badges de status.
- `adm-state-panel`: estados de loading/empty/error.

### Sessão
- Hook `use-adm-session` chama `GET /auth/me`.
- Rotas administrativas usam `AdmShell` com `requireAuth=true` (default).
- Login usa `requireAuth=false` e redireciona autenticado para `/adm/dashboard`.
- Logout via `POST /auth/logout`.

## Cliente HTTP
- Arquivo: `src/lib/api-client.ts`
- Responsabilidades:
  - base URL por `NEXT_PUBLIC_API_BASE_URL`;
  - envio com `credentials: include` para cookies `httpOnly`;
  - tratamento central de erros (`ApiError`);
  - helper de query string (`withQuery`);
  - normalização de mensagem de erro (`extractApiErrorMessage`).

## Rotas e estado funcional

### Públicas
- `/`, `/sobre`, `/modalidades`, `/galeria`
- `/contato` com integração ativa (`POST /contatos`)

### Administrativas
- `/adm/login`: login real + recuperação de senha (request API)
- `/adm/dashboard`: leitura de agregações (`/dashboard/*`)
- `/adm/aulas`: listagem/filtros + cancelamento
- `/adm/presencas`: chamada por aula + exportação CSV
- `/adm/alunos`: cadastro + ativação/inativação

## Convenções de implementação
- Estados assíncronos obrigatórios: `loading`, `empty`, `error`.
- Textos e labels do produto em pt-BR.
- Preferir tipos de contrato em `src/adm/types/api.ts` para alinhar com backend.
- Evitar duplicar regra de negócio da API no frontend.

## Pendências arquiteturais
- Extrair camada de estado (ex.: React Query) para cache e invalidação.
- Centralizar guard de rota com middleware quando sessão estiver estável em produção.
- Adicionar testes de interface para fluxos críticos da área administrativa.
