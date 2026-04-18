# Roadmap de Desenvolvimento

Planejamento de entregas em 4 fases (estimativa total de 7 semanas) para o projeto BJJ.

## Visao geral
- Duracao total: 7 semanas
- Time de referencia: 1 dev full-stack (ou 2 devs em paralelo)
- Entregas previstas: site publico, painel interno, autenticacao JWT e deploy em VPS

## Fase 1 - Fundacao (2 semanas)

### Objetivos
- Configurar base do monorepo e padroes de projeto.
- Definir banco de dados e migracoes iniciais.
- Implementar autenticacao (login + JWT + cookies httpOnly).
- Iniciar CRUD de alunos.

### Criterios de aceite
- Estrutura web/api funcionalmente inicializada.
- Migracoes executam com sucesso em ambiente local.
- Login autentica usuario valido e protege rotas privadas.
- Endpoints de alunos permitem criar, listar e atualizar.

## Fase 2 - Painel Admin (2 semanas)

### Objetivos
- Implementar CRUD de aulas.
- Implementar controle de presencas.
- Exibir dashboard com metricas principais.
- Registrar historico de graduacoes.
- Disponibilizar exportacao CSV de presencas.

### Criterios de aceite
- Professor consegue gerenciar agenda de aulas.
- Chamada por aula salva presencas sem duplicidade.
- Dashboard exibe indicadores consistentes com dados reais.
- Exportacao CSV funciona com filtros de periodo/modalidade.

## Fase 3 - Site Publico (2 semanas)

### Objetivos
- Implementar Home, Sobre e Modalidades/Graduacoes.
- Implementar Galeria/Resultados.
- Implementar Contato/Inscricao com envio para API.
- Garantir SEO basico e responsividade mobile-first.

### Criterios de aceite
- Todas as 5 paginas publicas navegaveis e responsivas.
- Formulario de contato persiste dados em `contatos`.
- Conteudo institucional e CTA de inscricao claros.
- Metadados SEO basicos presentes nas paginas publicas.

## Fase 4 - Deploy e Fechamento (1 semana)

### Objetivos
- Subir stack em VPS com Docker Compose.
- Configurar Nginx como proxy reverso.
- Configurar SSL com Certbot.
- Configurar CI/CD basico no GitHub Actions.
- Executar testes finais e ajustes de estabilidade.

### Criterios de aceite
- Aplicacao acessivel por dominio com HTTPS valido.
- API e front respondem por rotas esperadas.
- Pipeline CI valida estrutura e documentacao.
- Smoke tests principais aprovados apos deploy.

## Riscos e dependencias
- Definicao tardia de layout/brand pode impactar fase 3.
- Ajustes de infraestrutura da VPS podem deslocar fase 4.
- Volume real de dados pode exigir tuning de indices no banco.
- Integracao de email depende de provedor SMTP configurado.

## Marco final
Projeto considerado apto para operacao inicial quando:
- 10 paginas estiverem publicadas (5 publicas + 5 restritas).
- Controle academico (aulas, presencas, graduacoes) estiver estavel.
- Fluxo de autenticacao e seguranca basica estiver validado.
- Deploy em VPS com SSL e rotina de backup estiver ativo.
