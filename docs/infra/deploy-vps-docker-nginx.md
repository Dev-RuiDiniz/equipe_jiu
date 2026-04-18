# Deploy e Operacao (VPS + Docker + Nginx)

Guia de referencia para deploy da plataforma em VPS com conteinerizacao e proxy reverso.

## Stack de infraestrutura
- VPS Linux (ex.: Contabo ou DigitalOcean)
- Docker Engine + Docker Compose
- Nginx como reverse proxy
- Certbot para SSL (HTTPS)
- GitHub Actions para CI/CD basico

## Arquitetura de runtime (alto nivel)
- `web` (Next.js): porta interna `3000`
- `api` (NestJS): porta interna `3001`
- `db` (PostgreSQL): porta interna `5432`, sem exposicao publica
- `nginx`: entrada HTTP/HTTPS e roteamento para `web` e `api`

## Ambientes

### Desenvolvimento
- Docker Compose local para subir web, api e db.
- Volumes para persistencia local e hot reload quando aplicavel.

### Producao
- Compose dedicado com restart policy.
- Variaveis sensiveis via `.env` fora do versionamento.
- SSL com renovacao automatica.

## Pipeline CI/CD (basico)
1. Validacao de estrutura e links da documentacao.
2. Build de imagens (web/api) em ambiente de CI.
3. Publicacao de imagens em registry (fase posterior).
4. Deploy na VPS com atualizacao controlada.

## Checklist de deploy
1. Provisionar VPS e atualizar pacotes do sistema.
2. Instalar Docker e Docker Compose.
3. Configurar firewall (`80`, `443`, `22`).
4. Configurar DNS para dominio principal.
5. Ajustar `.env` de producao.
6. Subir stack com Compose de producao.
7. Configurar Nginx e emitir certificado SSL.
8. Executar smoke tests (home, login, contatos, dashboard).

## Backup e recuperacao
- Backup diario do PostgreSQL.
- Retencao minima de 7 dias.
- Restauracao validada em ambiente de homologacao.
- Volumes persistentes documentados e monitorados.

## Observabilidade minima
- Logs de aplicacao (`web` e `api`).
- Logs de acesso e erro do Nginx.
- Alertas basicos de indisponibilidade.
- Healthcheck para API e pagina principal.

## Arquivos de apoio
- Compose de dev: [../../infra/docker/docker-compose.dev.yml](../../infra/docker/docker-compose.dev.yml)
- Compose de prod: [../../infra/docker/docker-compose.prod.yml](../../infra/docker/docker-compose.prod.yml)
- Template Nginx: [../../infra/nginx/nginx.conf.example](../../infra/nginx/nginx.conf.example)
