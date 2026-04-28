"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdmSelectInput, AdmTextArea, AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatePanel } from "@/adm/components/adm-state-panel";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
import type { AlunoApi } from "@/adm/types/api";
import { apiClient, extractApiErrorMessage, withQuery } from "@/lib/api-client";

type AlunoPayload = {
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
  const [editingAlunoId, setEditingAlunoId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    faixa: "Branca",
    grau: "0",
    telefone: "",
    dataNascimento: "",
    fotoUrl: "",
    observacoes: "",
  });

  const resetForm = useCallback(() => {
    setEditingAlunoId(null);
    setForm({
      nome: "",
      cpf: "",
      faixa: "Branca",
      grau: "0",
      telefone: "",
      dataNascimento: "",
      fotoUrl: "",
      observacoes: "",
    });
  }, []);

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

      const payload: AlunoPayload = {
        nome: form.nome.trim(),
        cpf: form.cpf.trim(),
        faixa: form.faixa,
        grau: Number(form.grau),
        telefone: form.telefone.trim() || undefined,
        dataNascimento: form.dataNascimento || undefined,
        fotoUrl: form.fotoUrl.trim() || undefined,
      };

      try {
        if (editingAlunoId) {
          await apiClient.patch<AlunoApi>(`alunos/${editingAlunoId}`, payload);
          setFeedback("Aluno atualizado com sucesso.");
        } else {
          await apiClient.post<AlunoApi>("alunos", payload);
          setFeedback("Aluno cadastrado com sucesso.");
        }
        resetForm();
        await loadAlunos();
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Falha ao salvar aluno."));
      } finally {
        setIsSaving(false);
      }
    },
    [editingAlunoId, form, loadAlunos, resetForm],
  );

  const handleEditar = useCallback((aluno: AlunoApi) => {
    setEditingAlunoId(aluno.id);
    setForm({
      nome: aluno.nome,
      cpf: aluno.cpf,
      faixa: aluno.faixa,
      grau: String(aluno.grau),
      telefone: aluno.telefone || "",
      dataNascimento: aluno.dataNascimento ? aluno.dataNascimento.slice(0, 10) : "",
      fotoUrl: aluno.fotoUrl || "",
      observacoes: "",
    });
  }, []);

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
    { key: "telefone", label: "Telefone" },
    { key: "status", label: "Status" },
    { key: "acoes", label: "Acoes" },
  ];

  return (
    <AdmShell
      title="Cadastro e Acompanhamento"
      subtitle="Gestao de alunos conectada ao backend com cadastro, edicao e status."
      actions={
        <button type="button" className="btn-outline" onClick={() => void loadAlunos()}>
          Atualizar alunos
        </button>
      }
    >
      <section className="grid gap-5 xl:grid-cols-[1fr,1fr]">
        <article className="section-shell p-5 md:p-6">
          <p className="eyebrow">Ficha do aluno</p>
          <h2 className="display-font mt-3 text-3xl text-white">{editingAlunoId ? "Editar aluno" : "Cadastro funcional"}</h2>

          <form className="mt-5 grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
            <div className="grid gap-4 md:grid-cols-2">
              <AdmTextInput
                label="Nome"
                name="nome"
                placeholder="Nome completo"
                value={form.nome}
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                required
              />
              <AdmTextInput
                label="CPF"
                name="cpf"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(event) => setForm((current) => ({ ...current, cpf: event.target.value }))}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <AdmSelectInput
                label="Faixa"
                name="faixa"
                value={form.faixa}
                onChange={(event) => setForm((current) => ({ ...current, faixa: event.target.value }))}
              >
                <option value="Branca">Branca</option>
                <option value="Azul">Azul</option>
                <option value="Roxa">Roxa</option>
                <option value="Marrom">Marrom</option>
                <option value="Preta">Preta</option>
              </AdmSelectInput>

              <AdmSelectInput
                label="Grau"
                name="grau"
                value={form.grau}
                onChange={(event) => setForm((current) => ({ ...current, grau: event.target.value }))}
              >
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
              <AdmTextInput
                label="Telefone"
                name="telefone"
                placeholder="(11) 90000-0000"
                value={form.telefone}
                onChange={(event) => setForm((current) => ({ ...current, telefone: event.target.value }))}
              />
              <AdmTextInput
                label="Data de nascimento"
                type="date"
                name="data_nascimento"
                value={form.dataNascimento}
                onChange={(event) => setForm((current) => ({ ...current, dataNascimento: event.target.value }))}
              />
            </div>

            <AdmTextInput
              label="Foto URL"
              name="fotoUrl"
              placeholder="https://..."
              value={form.fotoUrl}
              onChange={(event) => setForm((current) => ({ ...current, fotoUrl: event.target.value }))}
            />

            <AdmTextArea
              label="Observacoes"
              name="observacoes"
              value={form.observacoes}
              onChange={(event) => setForm((current) => ({ ...current, observacoes: event.target.value }))}
              placeholder="Anotacoes internas sobre evolucao tecnica."
            />

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? "Salvando..." : editingAlunoId ? "Atualizar aluno" : "Salvar aluno"}
              </button>
              {editingAlunoId ? (
                <button type="button" className="btn-outline" onClick={resetForm}>
                  Cancelar edicao
                </button>
              ) : null}
            </div>
          </form>
          {feedback ? <p className="mt-3 text-sm text-emerald-200">{feedback}</p> : null}
          {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
        </article>

        <article className="section-shell p-5 md:p-6">
          <p className="eyebrow">Acompanhamento</p>
          <h2 className="display-font mt-3 text-3xl text-white">Resumo de alunos</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="adm-card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-white/45">Ativos</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-200">{ativos}</p>
            </div>
            <div className="adm-card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-white/45">Inativos</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-200">{inativos}</p>
            </div>
            <div className="adm-card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-white/45">Total</p>
              <p className="mt-1 text-2xl font-extrabold text-accent">{alunos.length}</p>
            </div>
          </div>

          <div className="mt-5">
            {isLoading ? (
              <AdmStatePanel tone="loading" title="Carregando alunos" message="Buscando cadastro completo." />
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
                message="Use o formulario ao lado para criar o primeiro aluno."
              />
            ) : (
              <AdmTable
                columns={columns}
                rows={alunos.map((aluno) => ({
                  nome: <span className="font-semibold text-white">{aluno.nome}</span>,
                  faixa: aluno.faixa,
                  grau: `${aluno.grau}o`,
                  telefone: aluno.telefone || "--",
                  status: <AdmStatusBadge status={aluno.ativo ? "Ativo" : "Inativo"} />,
                  acoes: (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-accent/30 px-2.5 py-1 text-xs font-semibold text-accent"
                        onClick={() => handleEditar(aluno)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-accent/30 px-2.5 py-1 text-xs font-semibold text-accent disabled:opacity-50"
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
