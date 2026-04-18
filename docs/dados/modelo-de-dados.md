# Modelo de Dados (PostgreSQL)

Documento de referencia para o banco principal do projeto BJJ.

## Tecnologias
- SGBD: PostgreSQL
- ORM alvo: Prisma
- Estrategia de migracoes: versionadas e auditaveis

## Tabelas Principais

### usuarios
| Campo | Tipo | Restricoes |
|---|---|---|
| id | UUID | PK |
| nome | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| senha_hash | TEXT | NOT NULL |
| papel | ENUM(admin, professor) | NOT NULL |
| ativo | BOOLEAN | DEFAULT true |
| criado_em | TIMESTAMP | NOT NULL |
| ultimo_login | TIMESTAMP | NULL |

### alunos
| Campo | Tipo | Restricoes |
|---|---|---|
| id | UUID | PK |
| nome | VARCHAR(100) | NOT NULL |
| cpf | VARCHAR(14) | UNIQUE, NOT NULL |
| data_nascimento | DATE | NULL |
| faixa | VARCHAR(30) | NOT NULL |
| grau | SMALLINT | NOT NULL |
| foto_url | TEXT | NULL |
| telefone | VARCHAR(20) | NULL |
| ativo | BOOLEAN | DEFAULT true |
| criado_em | TIMESTAMP | NOT NULL |

### aulas
| Campo | Tipo | Restricoes |
|---|---|---|
| id | UUID | PK |
| titulo | VARCHAR(150) | NOT NULL |
| descricao | TEXT | NULL |
| professor_id | UUID | FK -> usuarios.id |
| modalidade | VARCHAR(50) | NOT NULL |
| data_hora | TIMESTAMP | NOT NULL |
| duracao_min | SMALLINT | NOT NULL |
| vagas | SMALLINT | NULL |
| cancelada | BOOLEAN | DEFAULT false |
| criado_em | TIMESTAMP | NOT NULL |

### presencas
| Campo | Tipo | Restricoes |
|---|---|---|
| id | UUID | PK |
| aula_id | UUID | FK -> aulas.id |
| aluno_id | UUID | FK -> alunos.id |
| confirmado_em | TIMESTAMP | NOT NULL |
| observacao | TEXT | NULL |

### graduacoes
| Campo | Tipo | Restricoes |
|---|---|---|
| id | UUID | PK |
| aluno_id | UUID | FK -> alunos.id |
| faixa | VARCHAR(30) | NOT NULL |
| grau | SMALLINT | NOT NULL |
| data_graduacao | DATE | NOT NULL |
| professor_id | UUID | FK -> usuarios.id |
| observacao | TEXT | NULL |

### contatos
| Campo | Tipo | Restricoes |
|---|---|---|
| id | UUID | PK |
| nome | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL |
| mensagem | TEXT | NOT NULL |
| interesse | VARCHAR(50) | NULL |
| lido | BOOLEAN | DEFAULT false |
| criado_em | TIMESTAMP | NOT NULL |

## Relacionamentos
- `usuarios (1) -> (N) aulas` via `aulas.professor_id`.
- `aulas (1) -> (N) presencas` via `presencas.aula_id`.
- `alunos (1) -> (N) presencas` via `presencas.aluno_id`.
- `alunos (1) -> (N) graduacoes` via `graduacoes.aluno_id`.
- `usuarios (1) -> (N) graduacoes` via `graduacoes.professor_id`.

## Indices recomendados
- `usuarios(email)` UNIQUE.
- `alunos(cpf)` UNIQUE.
- `aulas(professor_id, data_hora)` para agenda e filtros.
- `aulas(modalidade, data_hora)` para consultas por modalidade e periodo.
- `presencas(aula_id, aluno_id)` UNIQUE para evitar duplicidade de chamada.
- `presencas(aluno_id, confirmado_em)` para historico de frequencia.
- `graduacoes(aluno_id, data_graduacao DESC)` para linha do tempo de faixas.
- `contatos(lido, criado_em DESC)` para fila de atendimento.

## Regras de integridade sugeridas
- `presencas`: impedir mais de um registro do mesmo aluno na mesma aula.
- `aulas`: `duracao_min > 0` e `vagas` nula ou positiva.
- `alunos`: manter historico de graduacao em `graduacoes` sem sobrescrever trilha.
- Soft delete preferencial por `ativo` em `usuarios` e `alunos`.

## Observacoes operacionais
- Backups diarios com retencao minima de 7 dias.
- Restauracao testada em ambiente de homologacao.
- Migracoes sempre versionadas e revisadas antes de deploy.
