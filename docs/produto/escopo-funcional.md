# Escopo Funcional

Consolidação do escopo do produto com status real da implementação atual.

## Visão geral
- Total previsto: 10 páginas
- Área pública: 5 páginas
- Área administrativa: 5 páginas
- Objetivo: captação de novos alunos + gestão acadêmica básica

## Status atual por área

### Área pública
- UI completa entregue.
- Fluxo funcional entregue em produção local:
  - `/contato` persistindo em `contatos` via API.
- Páginas:
  - `/`
  - `/sobre`
  - `/modalidades`
  - `/galeria`
  - `/contato`

### Área administrativa
- UI completa entregue.
- Fluxo funcional parcialmente entregue:
  - `/adm/login`: autenticação real (JWT em cookie `httpOnly`).
  - `/adm/dashboard`: KPIs e gráfico com agregações reais.
  - `/adm/aulas`: leitura/filtros e cancelamento.
  - `/adm/presencas`: chamada por aula e exportação CSV.
  - `/adm/alunos`: cadastro e ativação/inativação.

- Rotas:
  - `/adm` redireciona para `/adm/dashboard`
  - `/adm/login`
  - `/adm/dashboard`
  - `/adm/aulas`
  - `/adm/presencas`
  - `/adm/alunos`

## Escopo detalhado por página

### 1. Home
- Hero do time
- CTA de inscrição
- Resumo de horários e modalidades
- Depoimentos e destaques
- Link para WhatsApp

### 2. Sobre
- História da equipe
- Professores e graduações
- Valores e cultura
- Indicadores institucionais

### 3. Modalidades/Graduações
- Grade de turmas
- Descrição de modalidades (Adulto, Kids, Competição)
- Explicação de faixas e graus

### 4. Galeria/Resultados
- Grid responsivo
- Filtros visuais
- Lightbox visual

### 5. Contato/Inscrição
- Formulário
- WhatsApp
- Mapa e dados de atendimento

### 6. Login administrativo
- Login real com API
- Recuperação de senha (request funcional)
- Redirecionamento pós-login

### 7. Dashboard administrativo
- Total de alunos ativos
- Média de presença semanal
- Próximas aulas
- Alertas de graduação
- Frequência mensal agregada

### 8. Controle de aulas
- Listagem e filtros reais
- Cancelamento funcional
- Pendência: create/update/delete completo na UI

### 9. Presenças
- Chamada por aula
- Registro por aluno
- Histórico por aula
- Exportação CSV

### 10. Cadastro e acompanhamento de alunos
- Cadastro funcional
- Ativar/inativar funcional
- Pendência: edição completa da ficha

## Fluxo de autenticação
1. Usuário autentica em `/adm/login` via `POST /auth/login`.
2. API retorna usuário e define cookies `access_token` e `refresh_token`.
3. Área administrativa valida sessão por `GET /auth/me`.
4. Logout remove cookies em `POST /auth/logout`.

## Perfis e permissões
- `admin`: gestão completa de módulos administrativos.
- `professor`: acesso operacional à rotina de aulas, presenças e alunos.
- visitante: acesso apenas às páginas públicas.

## Pendências funcionais para fechar escopo
- Gestão de `contatos` na área administrativa (listar/marcar lido).
- Gestão de `graduacoes` no frontend administrativo.
- Fluxo completo de recuperação de senha com envio real de e-mail.
- Cobertura de testes automatizados para regras críticas.
