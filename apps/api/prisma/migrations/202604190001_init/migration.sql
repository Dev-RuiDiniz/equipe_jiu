-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('admin', 'professor');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "papel" "Papel" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_login" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "data_nascimento" DATE,
    "faixa" VARCHAR(30) NOT NULL,
    "grau" SMALLINT NOT NULL,
    "foto_url" TEXT,
    "telefone" VARCHAR(20),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aulas" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "descricao" TEXT,
    "professor_id" UUID NOT NULL,
    "modalidade" VARCHAR(50) NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "duracao_min" SMALLINT NOT NULL,
    "vagas" SMALLINT,
    "cancelada" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presencas" (
    "id" UUID NOT NULL,
    "aula_id" UUID NOT NULL,
    "aluno_id" UUID NOT NULL,
    "confirmado_em" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "presencas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graduacoes" (
    "id" UUID NOT NULL,
    "aluno_id" UUID NOT NULL,
    "faixa" VARCHAR(30) NOT NULL,
    "grau" SMALLINT NOT NULL,
    "data_graduacao" DATE NOT NULL,
    "professor_id" UUID NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "graduacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "interesse" VARCHAR(50),
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_cpf_key" ON "alunos"("cpf");

-- CreateIndex
CREATE INDEX "aulas_professor_id_data_hora_idx" ON "aulas"("professor_id", "data_hora");

-- CreateIndex
CREATE INDEX "aulas_modalidade_data_hora_idx" ON "aulas"("modalidade", "data_hora");

-- CreateIndex
CREATE UNIQUE INDEX "presencas_aula_id_aluno_id_key" ON "presencas"("aula_id", "aluno_id");

-- CreateIndex
CREATE INDEX "presencas_aluno_id_confirmado_em_idx" ON "presencas"("aluno_id", "confirmado_em");

-- CreateIndex
CREATE INDEX "graduacoes_aluno_id_data_graduacao_idx" ON "graduacoes"("aluno_id", "data_graduacao" DESC);

-- CreateIndex
CREATE INDEX "contatos_lido_criado_em_idx" ON "contatos"("lido", "criado_em" DESC);

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "aulas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduacoes" ADD CONSTRAINT "graduacoes_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduacoes" ADD CONSTRAINT "graduacoes_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
