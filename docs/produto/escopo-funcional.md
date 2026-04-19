# Escopo Funcional

Baseado no documento tecnico do projeto BJJ (versao 1.0), este arquivo consolida as 10 paginas previstas e os principais comportamentos esperados.

## Visao Geral
- Total de paginas: 10
- Area publica: 5 paginas (sem autenticacao)
- Area restrita: 5 paginas (acesso professor/admin com JWT)
- Objetivo: captar novos alunos, apresentar o time e permitir gestao academica basica

## Status da Entrega Visual (fase atual)
- Frontend das 5 paginas publicas implementado com foco exclusivamente visual.
- Frontend visual das 5 telas administrativas implementado com dados mockados.
- Rotas publicas ativas: `/`, `/sobre`, `/modalidades`, `/galeria`, `/contato`.
- Rotas administrativas ativas: `/adm/login`, `/adm/dashboard`, `/adm/aulas`, `/adm/presencas`, `/adm/alunos`.
- `/adm` redireciona para `/adm/dashboard`.
- Arquitetura de frontend separada por dominio:
  - `src/publicas` para componentes e paginas abertas.
  - `src/adm` para componentes e paginas da area restrita.
- Conteudo e dados nesta etapa sao estaticos (mockados), sem persistencia.
- Sem autenticacao funcional e sem integracao com API nesta entrega.

## Area Publica (sem login)

### 1. Home
- Hero com imagem do time.
- CTA de inscricao.
- Resumo de horarios e modalidades.
- Depoimentos de alunos.
- Link direto para WhatsApp.
- Conquistas e destaques recentes.

### 2. Sobre
- Historia do time e fundadores.
- Galeria de professores e graduacoes.
- Valores e filosofia da equipe.
- Indicadores: alunos, anos de atividade e medalhas.
- Fotos da academia e ambiente de treino.

### 3. Modalidades / Graduacoes
- Grade de horarios por turma.
- Turmas: Adulto, Kids e Competicao.
- Descricao de cada modalidade.
- Explicacao do sistema de faixas.
- Requisitos de graduacao.
- Tempo medio por faixa.

### 4. Galeria / Resultados
- Grid de fotos de treinos e eventos.
- Fotos de competicoes.
- Lista de resultados de campeonatos.
- Filtros por ano e evento.
- Lightbox para visualizacao ampliada.

### 5. Contato / Inscricao
- Formulario com nome, email, modalidade de interesse e mensagem.
- Botao com integracao para WhatsApp.
- Mapa incorporado (Google Maps embed).
- Endereco, telefone e horario de atendimento.

## Area Restrita (professores e admin)

### 6. Login
- Formulario com email e senha.
- Geracao de JWT em cookie `httpOnly`.
- Fluxo de recuperacao de senha por email.
- Redirecionamento para dashboard apos sucesso.
- Protecao de tentativa excessiva (rate limit).

### 7. Dashboard
- Total de alunos ativos.
- Presenca media semanal.
- Proximas aulas agendadas.
- Alertas de graduacoes/faixas.
- Grafico de frequencia mensal.
- Resumo de atividades recentes.

### 8. Controle de Aulas
- CRUD completo de aulas.
- Campos: titulo, modalidade, data/hora, duracao, vagas opcionais.
- Acao de cancelamento com aviso.
- Historico de aulas passadas.
- Filtros por periodo e modalidade.

### 9. Presenca de Alunos
- Lista de alunos por aula.
- Marcacao por checkbox.
- Registro com timestamp.
- Historico por aluno e por aula.
- Exportacao em CSV.
- Indicador percentual de frequencia.

### 10. Cadastro e Acompanhamento
- Ficha completa do aluno.
- Dados de faixa, grau e foto.
- Historico de graduacoes.
- Frequencia acumulada.
- Observacoes do professor.
- Ativacao e inativacao de aluno.

## Fluxo de Autenticacao
1. Usuario informa email e senha na pagina de login.
2. API valida credenciais e emite JWT.
3. Token e salvo em cookie `httpOnly`.
4. Middleware valida token em cada rota protegida.
5. Rotas privadas bloqueiam acesso sem token valido.

## Permissoes e Responsabilidades
- `admin`: acesso completo a dashboard, usuarios e operacao academica.
- `professor`: acesso a aulas, presenca, graduacoes e acompanhamento de alunos.
- Visitante publico: acesso somente a conteudo institucional e formulario de contato.

## Requisitos transversais
- Responsividade mobile-first em todas as paginas publicas.
- SEO basico para paginas abertas.
- Usabilidade e navegacao clara entre conteudo institucional e inscricao.
