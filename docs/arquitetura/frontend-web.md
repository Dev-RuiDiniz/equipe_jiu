# Frontend Web - Convencoes e Organizacao

Guia de referencia para evolucao do `apps/web`.

## Stack atual
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

## Estrutura de dominio
- `src/app`: camada de rotas (wrappers curtos por URL)
- `src/publicas`: paginas abertas e componentes de conteudo institucional
- `src/adm`: shell e placeholders da area restrita

Exemplo de fluxo de roteamento:
- `src/app/sobre/page.tsx` importa `src/publicas/pages/sobre-page.tsx`
- `src/app/adm/page.tsx` importa `src/adm/pages/adm-home-page.tsx`

## Convencoes de implementacao
- Cada rota publica deve manter composicao por secoes reutilizaveis.
- Evitar logica de negocio no `src/app`; usar apenas montagem de pagina.
- Conteudo visual estatico/mocado permanece em cada pagina enquanto nao houver API.
- Componentes de layout compartilhado:
  - `public-shell` para area publica
  - `adm-shell` para area administrativa

## Sistema visual (v1)
- Tokens de cor, raio e sombra em `src/app/globals.css`.
- Tipografia:
  - Display: Bebas Neue
  - Texto: Manrope
- Classes utilitarias proprietarias:
  - `section-shell`
  - `card`
  - `btn-primary`
  - `btn-outline`
  - `signal`

## Rotas existentes
### Publicas
- `/`
- `/sobre`
- `/modalidades`
- `/galeria`
- `/contato`

### Adm
- `/adm` (placeholder visual)

## Proximos passos recomendados
- Integrar conteudo dinamico com API NestJS.
- Implementar fluxo de autenticacao real para `adm`.
- Extrair componentes de secao para biblioteca interna conforme repeticao.
- Adicionar testes de interface e regressao visual.
