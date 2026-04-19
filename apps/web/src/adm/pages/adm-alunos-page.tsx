"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdmSelectInput, AdmTextArea, AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatePanel } from "@/adm/components/adm-state-panel";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
import type { AlunoApi } from "@/adm/types/api";
import { apiClient, extractApiErrorMessage, withQuery } from "@/lib/api-client";

type CreateAlunoPayload = {
  nome: string;
  cpf: string;
  dataNascimento?: string;
  faixa: string;
  grau: number;
  telefone?: string;
  fotoUrl?: string;
};

export function AdmAlunosPage() {
  const [alunos, setAlunos] = useState<AlunoApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAlunos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<AlunoApi[]>(withQuery("alunos", {}));
      setAlunos(response);
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel carregar alunos."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAlunos();
  }, [loadAlunos]);

  const ativos = useMemo(() => alunos.filter((aluno) => aluno.ativo).length, [alunos]);
  const inativos = alunos.length - ativos;

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSaving(true);
      setError(null);
      setFeedback(null);

      const formData = new FormData(event.currentTarget);
      const payload: CreateAlunoPayload = {
        nome: String(formData.get("nome") ?? "").trim(),
        cpf: String(formData.get("cpf") ?? "").trim(),
        faixa: String(formData.get("faixa") ?? "Branca"),
        grau: Number(formData.get("grau") ?? 0),
        telefone: String(formData.get("telefone") ?? "").trim() || undefined,
        dataNascimento: String(formData.get("data_nascimento") ?? "").trim() || undefined,
      };

      try {
        await apiClient.post<AlunoApi>("alunos", payload);
        event.currentTarget.reset();
        setFeedback("Aluno cadastrado com sucesso.");
        await loadAlunos();
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Falha ao cadastrar aluno."));
      } finally {
        setIsSaving(false);
      }
    },
    [loadAlunos],
  );

  const toggleStatus = useCallback(
    async (aluno: AlunoApi) => {
      setError(null);
      setFeedback(null);
      setIsSaving(true);

      try {
        await apiClient.patch<AlunoApi>(`alunos/${aluno.id}/status`, { ativo: !aluno.ativo });
        setFeedback(`Status de ${aluno.nome} atualizado com sucesso.`);
        await loadAlunos();
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Falha ao atualizar status do aluno."));
      } finally {
        setIsSaving(false);
      }
    },
    [loadAlunos],
  );

  const columns = [
    { key: "nome", label: "Aluno" },
    { key: "faixa", label: "Faixa" },
    { key: "grau", label: "Grau" },
    { key: "frequencia", label: "Frequencia" },
    { key: "status", label: "Status" },
    { key: "acoes", label: "Acoes" },
  ];

  return (
    <AdmShell
      title="Cadastro e Acompanhamento"
      subtitle="Gestao de alunos conectada ao backend com cadastro e ativacao/inativacao."
      actions={
        <>
          <button type="button" className="btn-outline" onClick={() => void loadAlunos()}>
            Atualizar alunos
          </button>
        </>
      }
    >
      <section className="grid gap-5 xl:grid-cols-[1fr,1fr]">
        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Ficha do aluno</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Cadastro funcional</h2>

          <form className="mt-5 grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdmTextInput label="Nome" name="nome" placeholder="Nome completo" required />
              <AdmTextInput label="CPF" name="cpf" placeholder="000.000.000-00" required />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <AdmSelectInput label="Faixa" name="faixa" defaultValue="Branca">
                <option value="Branca">Branca</option>
                <option value="Azul">Azul</option>
                <option value="Roxa">Roxa</option>
                <option value="Marrom">Marrom</option>
                <option value="Preta">Preta</option>
              </AdmSelectInput>

              <AdmSelectInput label="Grau" name="grau" defaultValue="0">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </AdmSelectInput>

              <AdmSelectInput label="Status inicial" name="status" defaultValue="ativo" disabled>
                <option value="ativo">Ativo</option>
              </AdmSelectInput>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AdmTextInput label="Telefone" name="telefone" placeholder="(11) 90000-0000" />
              <AdmTextInput label="Data de nascimento" type="date" name="data_nascimento" />
            </div>

            <AdmTextArea
              label="Observacoes"
              name="observacoes"
              placeholder="Anotacoes internas sobre evolucao tecnica (nao persistido nesta fase)."
            />

            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar aluno"}
            </button>
          </form>
          {feedback ? <p className="mt-3 text-sm text-emerald-200">{feedback}</p> : null}
          {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
        </article>

        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Acompanhamento</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Resumo de alunos</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Ativos</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-200">{ativos}</p>
            </div>
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Inativos</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-200">{inativos}</p>
            </div>
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Total</p>
              <p className="mt-1 text-2xl font-extrabold text-sky-200">{alunos.length}</p>
            </div>
          </div>

          <div className="mt-5">
            {isLoading ? (
              <AdmStatePanel
                tone="loading"
                title="Carregando alunos"
                message="Buscando cadastro completo para acompanhamento administrativo."
              />
            ) : error ? (
              <AdmStatePanel
                tone="error"
                title="Falha ao carregar alunos"
                message={error}
                action={
                  <button type="button" className="btn-outline" onClick={() => void loadAlunos()}>
                    Tentar novamente
                  </button>
                }
              />
            ) : alunos.length === 0 ? (
              <AdmStatePanel
                tone="empty"
                title="Nenhum aluno cadastrado"
                message="Use o formulario ao lado para criar o primeiro aluno da base."
              />
            ) : (
              <AdmTable
                columns={columns}
                rows={alunos.map((aluno) => ({
                  nome: <span className="font-semibold text-white">{aluno.nome}</span>,
                  faixa: aluno.faixa,
                  grau: `${aluno.grau}o`,
                  frequencia: "--",
                  status: <AdmStatusBadge status={aluno.ativo ? "Ativo" : "Inativo"} />,
                  acoes: (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-orange-300/40 px-2.5 py-1 text-xs font-semibold text-orange-200 disabled:opacity-50"
                        onClick={() => void toggleStatus(aluno)}
                        disabled={isSaving}
                      >
                        {aluno.ativo ? "Inativar" : "Ativar"}
                      </button>
                    </div>
                  ),
                }))}
              />
            )}
          </div>
        </article>
      </section>
    </AdmShell>
  );
}
