# Guia de Contribuicao

## Estrutura do repositorio
- `apps/web`: front-end publico e area restrita.
- `apps/api`: API REST para autenticacao e painel.
- `packages`: pacotes compartilhados (tipos e configuracoes).
- `docs`: documentacao funcional e tecnica.
- `infra`: configuracoes e guias de deploy.

## Fluxo sugerido
1. Sincronize com a `main`.
2. Crie branch de trabalho quando necessario.
3. Faça commits pequenos e objetivos.
4. Execute validacoes locais antes de abrir PR.

## Padrao de commit
Formato Conventional Commits em pt-BR:
- `tipo(escopo): descricao`
- Tipos: feat, fix, refactor, chore, docs, test, style, perf, build, ci, revert
