-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "usuario_id" UUID,
    "acao" VARCHAR(80) NOT NULL,
    "recurso" VARCHAR(80) NOT NULL,
    "recurso_id" TEXT,
    "detalhes" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_usuario_id_criado_em_idx" ON "audit_logs"("usuario_id", "criado_em");

-- CreateIndex
CREATE INDEX "audit_logs_recurso_criado_em_idx" ON "audit_logs"("recurso", "criado_em");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
