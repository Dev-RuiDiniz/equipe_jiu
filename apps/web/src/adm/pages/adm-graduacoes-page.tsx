"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdmSelectInput, AdmTextArea, AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatePanel } from "@/adm/components/adm-state-panel";
import { AdmTable } from "@/adm/components/adm-table";
import type { AdmSessionUser } from "@/adm/types";
import type { AlunoApi, GraduacaoApi } from "@/adm/types/api";
import { useAdmSession } from "@/adm/hooks/use-adm-session";
import { apiClient, extractApiErrorMessage } from "@/lib/api-client";

type CreateGraduacaoPayload = {
  alunoId: string;
  faixa: string;
  grau: number;
  dataGraduacao: string;
  professorId: string;
  observacao?: string;
};

export function AdmGraduacoesPage() {
  const { user } = useAdmSession();
  const [alunos, setAlunos] = useState<AlunoApi[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [historico, setHistorico] = useState<GraduacaoApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadAlunos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<AlunoApi[]>("alunos");
      setAlunos(response);
      if (!alunoSelecionado && response.length > 0) {
        setAlunoSelecionado(response[0].id);
      }
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel carregar os alunos."));
    } finally {
      setIsLoading(false);
    }
  }, [alunoSelecionado]);

  const loadHistorico = useCallback(async (alunoId: string) => {
    if (!alunoId) {
      setHistorico([]);
      return;
    }

    setError(null);
    try {
      const response = await apiClient.get<GraduacaoApi[]>(`graduacoes/aluno/${alunoId}`);
      setHistorico(response);
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel carregar o historico de graduacoes."));
    }
  }, []);

  useEffect(() => {
    void loadAlunos();
  }, [loadAlunos]);

  useEffect(() => {
    if (!alunoSelecionado) {
      return;
    }
    void loadHistorico(alunoSelecionado);
  }, [alunoSelecionado, loadHistorico]);

  const alunoAtual = useMemo(() => alunos.find((aluno) => aluno.id === alunoSelecionado) ?? null, [alunos, alunoSelecionado]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSaving(true);
      setError(null);
      setFeedback(null);

      const formData = new FormData(event.currentTarget);
      const professor = user as AdmSessionUser | null;

      if (!professor?.id) {
        setError("Sessao administrativa invalida para registrar graduacao.");
        setIsSaving(false);
        return;
      }

      const payload: CreateGraduacaoPayload = {
        alunoId: String(formData.get("alunoId") ?? ""),
        faixa: String(formData.get("faixa") ?? "Branca"),
        grau: Number(formData.get("grau") ?? 0),
        dataGraduacao: String(formData.get("dataGraduacao") ?? ""),
        professorId: professor.id,
        observacao: String(formData.get("observacao") ?? "").trim() || undefined,
      };

      try {
        await apiClient.post<GraduacaoApi>("graduacoes", payload);
        setFeedback("Graduacao registrada com sucesso.");
        await loadHistorico(payload.alunoId);
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Nao foi possivel registrar a graduacao."));
      } finally {
        setIsSaving(false);
      }
    },
    [loadHistorico, user],
  );

  return (
    <AdmShell
      title="Graduacoes"
      subtitle="Registro de evolucao tecnica por aluno com historico cronologico."
      actions={
        <button type="button" className="btn-outline" onClick={() => void loadHistorico(alunoSelecionado)}>
          Atualizar historico
        </button>
      }
    >
      {isLoading ? (
        <AdmStatePanel tone="loading" title="Carregando alunos" message="Preparando cadastro de graduacoes." />
      ) : error && alunos.length === 0 ? (
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
      ) : (
        <section className="grid gap-5 xl:grid-cols-[1fr,1fr]">
          <article className="section-shell p-5 md:p-6">
            <p className="eyebrow">Novo registro</p>
            <h2 className="display-font mt-3 text-3xl text-white">Cadastrar graduacao</h2>

            <form className="mt-5 grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
              <AdmSelectInput
                label="Aluno"
                name="alunoId"
                value={alunoSelecionado}
                onChange={(event) => setAlunoSelecionado(event.target.value)}
              >
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome} • {aluno.faixa} {aluno.grau}o
                  </option>
                ))}
              </AdmSelectInput>

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

                <AdmTextInput label="Data" type="date" name="dataGraduacao" required />
              </div>

              <AdmTextArea label="Observacao" name="observacao" placeholder="Observacoes da banca de graduacao." />

              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Registrar graduacao"}
              </button>
            </form>
            {feedback ? <p className="mt-3 text-sm text-emerald-200">{feedback}</p> : null}
            {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
          </article>

          <article className="section-shell p-5 md:p-6">
            <p className="eyebrow">Historico</p>
            <h2 className="display-font mt-3 text-3xl text-white">
              {alunoAtual ? `Graduacoes de ${alunoAtual.nome}` : "Selecione um aluno"}
            </h2>

            <div className="mt-5">
              {historico.length === 0 ? (
                <AdmStatePanel
                  tone="empty"
                  title="Sem graduacoes registradas"
                  message="Registre a primeira graduacao para iniciar o historico do aluno."
                />
              ) : (
                <AdmTable
                  columns={[
                    { key: "faixa", label: "Faixa" },
                    { key: "grau", label: "Grau" },
                    { key: "data", label: "Data" },
                    { key: "professor", label: "Professor" },
                    { key: "observacao", label: "Observacao" },
                  ]}
                  rows={historico.map((item) => ({
                    faixa: <span className="font-semibold text-white">{item.faixa}</span>,
                    grau: `${item.grau}o`,
                    data: new Date(item.dataGraduacao).toLocaleDateString("pt-BR"),
                    professor: item.professor?.nome ?? "--",
                    observacao: item.observacao || "--",
                  }))}
                />
              )}
            </div>
          </article>
        </section>
      )}
    </AdmShell>
  );
}
