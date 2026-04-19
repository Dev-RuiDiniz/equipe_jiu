# apps/web

Frontend Next.js da plataforma Equipe Jiu.

## Escopo atual do frontend

### Área pública
- `/`
- `/sobre`
- `/modalidades`
- `/galeria`
- `/contato`

Integração ativa:
- envio do formulário de contato para `POST /contatos`.

### Área administrativa
- `/adm/login`
- `/adm/dashboard`
- `/adm/aulas`
- `/adm/presencas`
- `/adm/alunos`

Integrações ativas:
- login administrativo com sessão em cookie `httpOnly`;
- dashboard com dados reais (`/dashboard/resumo` e `/dashboard/frequencia-mensal`);
- listagem e cancelamento de aulas;
- chamada e exportação CSV de presenças;
- cadastro e ativação/inativação de alunos.

## Organização de pastas
```text
src/
|-- app/         # wrappers de rotas (URLs limpas)
|-- publicas/    # páginas e componentes públicos
|-- adm/         # páginas e componentes administrativos
`-- lib/         # cliente HTTP e utilitários compartilhados
```

## Convenções principais
- `src/app/*` deve manter somente composição de rota.
- Lógica de domínio da UI fica em `src/publicas/*` e `src/adm/*`.
- `apiClient` centraliza chamadas HTTP, tratamento de erro e query params.
- Componentes administrativos reutilizáveis:
  - `adm-shell`
  - `adm-table`
  - `adm-kpi-card`
  - `adm-status-badge`
  - `adm-form-field`
  - `adm-state-panel`

## Variáveis de ambiente
Crie `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

## Execução local
```bash
cd apps/web
npm install
npm run dev
```

Aplicação: `http://localhost:3000`

## Qualidade
```bash
npm run lint
npm run build
```

## Pendências funcionais no frontend
- CRUD completo de aulas (create/update/delete na UI).
- Edição completa de ficha de alunos.
- Telas administrativas para `contatos` e `graduacoes`.
- Fluxo visual de reset de senha com token real.
