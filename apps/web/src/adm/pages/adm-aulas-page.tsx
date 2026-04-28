"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdmSelectInput, AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatePanel } from "@/adm/components/adm-state-panel";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
import { useAdmSession } from "@/adm/hooks/use-adm-session";
import type { AulaApi } from "@/adm/types/api";
import { apiClient, extractApiErrorMessage, withQuery } from "@/lib/api-client";

function formatDateTime(dateTime: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateTime));
}

function toInputDateTime(dateTime: string) {
  const date = new Date(dateTime);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function AdmAulasPage() {
  const { user } = useAdmSession();
  const [modalidade, setModalidade] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [aulas, setAulas] = useState<AulaApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [editingAulaId, setEditingAulaId] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    modalidade: "Adulto",
    dataHora: "",
    duracaoMin: "60",
    vagas: "",
    descricao: "",
  });

  const loadAulas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const canceladaFilter =
        status === "cancelada" ? true : status === "confirmada" || status === "agendada" ? false : undefined;

      const response = await apiClient.get<AulaApi[]>(
        withQuery("aulas", {
          modalidade: modalidade === "todos" ? undefined : modalidade,
          cancelada: canceladaFilter,
          dataInicio: inicio || undefined,
          dataFim: fim || undefined,
        }),
      );

      setAulas(response);
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel carregar as aulas."));
    } finally {
      setIsLoading(false);
    }
  }, [fim, inicio, modalidade, status]);

  useEffect(() => {
    void loadAulas();
  }, [loadAulas]);

  const resetForm = useCallback(() => {
    setEditingAulaId(null);
    setForm({
      titulo: "",
      modalidade: "Adulto",
      dataHora: "",
      duracaoMin: "60",
      vagas: "",
      descricao: "",
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsMutating(true);
      setError(null);
      setFeedback(null);

      if (!user?.id) {
        setError("Sessao invalida para gerenciar aulas.");
        setIsMutating(false);
        return;
      }

      try {
        const payload = {
          titulo: form.titulo.trim(),
          modalidade: form.modalidade,
          dataHora: new Date(form.dataHora).toISOString(),
          duracaoMin: Number(form.duracaoMin),
          vagas: form.vagas ? Number(form.vagas) : undefined,
          descricao: form.descricao.trim() || undefined,
          professorId: user.id,
        };

        if (editingAulaId) {
          await apiClient.patch<AulaApi>(`aulas/${editingAulaId}`, payload);
          setFeedback("Aula atualizada com sucesso.");
        } else {
          await apiClient.post<AulaApi>("aulas", payload);
          setFeedback("Aula cadastrada com sucesso.");
        }

        resetForm();
        await loadAulas();
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Nao foi possivel salvar a aula."));
      } finally {
        setIsMutating(false);
      }
    },
    [editingAulaId, form, loadAulas, resetForm, user],
  );

  const handleEditar = useCallback((aula: AulaApi) => {
    setEditingAulaId(aula.id);
    setForm({
      titulo: aula.titulo,
      modalidade: aula.modalidade,
      dataHora: toInputDateTime(aula.dataHora),
      duracaoMin: String(aula.duracaoMin),
      vagas: aula.vagas ? String(aula.vagas) : "",
      descricao: aula.descricao || "",
    });
  }, []);

  const handleCancelar = useCallback(
    async (aulaId: string) => {
      setIsMutating(true);
      setError(null);
      setFeedback(null);

      try {
        await apiClient.patch<AulaApi>(`aulas/${aulaId}/cancelar`, {});
        setFeedback("Aula cancelada com sucesso.");
        await loadAulas();
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Nao foi possivel cancelar a aula selecionada."));
      } finally {
        setIsMutating(false);
      }
    },
    [loadAulas],
  );

  const handleExcluir = useCallback(
    async (aulaId: string) => {
      setIsMutating(true);
      setError(null);
      setFeedback(null);

      try {
        await apiClient.delete<{ id: string }>(`aulas/${aulaId}`);
        setFeedback("Aula excluida com sucesso.");
        if (editingAulaId === aulaId) {
          resetForm();
        }
        await loadAulas();
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Nao foi possivel excluir a aula selecionada."));
      } finally {
        setIsMutating(false);
      }
    },
    [editingAulaId, loadAulas, resetForm],
  );

  const aulasOrdenadas = useMemo(
    () => [...aulas].sort((left, right) => new Date(right.dataHora).getTime() - new Date(left.dataHora).getTime()),
    [aulas],
  );

  const columns = [
    { key: "titulo", label: "Titulo" },
    { key: "modalidade", label: "Modalidade" },
    { key: "dataHora", label: "Data/Hora" },
    { key: "vagas", label: "Vagas" },
    { key: "status", label: "Status" },
    { key: "acoes", label: "Acoes" },
  ];

  return (
    <AdmShell
      title="Controle de Aulas"
      subtitle="Grade semanal conectada ao backend com CRUD completo, filtros e status."
      actions={
        <button type="button" className="btn-outline" onClick={() => void loadAulas()}>
          Atualizar agenda
        </button>
      }
    >
      <section className="section-shell p-5 md:p-6">
        <p className="eyebrow">Cadastro de aulas</p>
        <h2 className="display-font mt-3 text-3xl text-white">{editingAulaId ? "Editar aula" : "Nova aula"}</h2>
        <form className="mt-5 grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdmTextInput
              label="Titulo"
              name="titulo"
              value={form.titulo}
              onChange={(event) => setForm((current) => ({ ...current, titulo: event.target.value }))}
              required
            />
            <AdmSelectInput
              label="Modalidade"
              name="modalidade"
              value={form.modalidade}
              onChange={(event) => setForm((current) => ({ ...current, modalidade: event.target.value }))}
            >
              <option value="Adulto">Adulto</option>
              <option value="Kids">Kids</option>
              <option value="Competicao">Competicao</option>
            </AdmSelectInput>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AdmTextInput
              label="Data e hora"
              type="datetime-local"
              name="dataHora"
              value={form.dataHora}
              onChange={(event) => setForm((current) => ({ ...current, dataHora: event.target.value }))}
              required
            />
            <AdmTextInput
              label="Duracao (min)"
              type="number"
              min={1}
              name="duracaoMin"
              value={form.duracaoMin}
              onChange={(event) => setForm((current) => ({ ...current, duracaoMin: event.target.value }))}
              required
            />
            <AdmTextInput
              label="Vagas"
              type="number"
              min={1}
              name="vagas"
              value={form.vagas}
              onChange={(event) => setForm((current) => ({ ...current, vagas: event.target.value }))}
            />
          </div>

          <AdmTextInput
            label="Descricao"
            name="descricao"
            value={form.descricao}
            onChange={(event) => setForm((current) => ({ ...current, descricao: event.target.value }))}
          />

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={isMutating}>
              {isMutating ? "Salvando..." : editingAulaId ? "Atualizar aula" : "Cadastrar aula"}
            </button>
            {editingAulaId ? (
              <button type="button" className="btn-outline" onClick={resetForm}>
                Cancelar edicao
              </button>
            ) : null}
          </div>
        </form>
        {feedback ? <p className="mt-3 text-sm text-emerald-200">{feedback}</p> : null}
        {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
      </section>

      <section className="mt-6 section-shell p-5 md:p-6">
        <p className="eyebrow">Filtros rapidos</p>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <AdmSelectInput
            label="Modalidade"
            name="modalidade"
            value={modalidade}
            onChange={(event) => setModalidade(event.target.value)}
          >
            <option value="todos">Todas</option>
            <option value="Adulto">Adulto</option>
            <option value="Kids">Kids</option>
            <option value="Competicao">Competicao</option>
          </AdmSelectInput>

          <AdmSelectInput label="Status" name="status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="todos">Todos</option>
            <option value="confirmada">Confirmada</option>
            <option value="agendada">Agendada</option>
            <option value="cancelada">Cancelada</option>
          </AdmSelectInput>

          <AdmTextInput label="Data inicial" type="date" name="inicio" value={inicio} onChange={(event) => setInicio(event.target.value)} />
          <AdmTextInput label="Data final" type="date" name="fim" value={fim} onChange={(event) => setFim(event.target.value)} />
        </div>
      </section>

      <section className="mt-6 section-shell p-5 md:p-6">
        <p className="eyebrow">Grade operacional</p>
        <h2 className="display-font mt-3 text-3xl text-white">Aulas cadastradas</h2>

        <div className="mt-5">
          {isLoading ? (
            <AdmStatePanel tone="loading" title="Buscando aulas" message="Carregando dados reais da grade." />
          ) : error ? (
            <AdmStatePanel
              tone="error"
              title="Falha ao carregar aulas"
              message={error}
              action={
                <button type="button" className="btn-outline" onClick={() => void loadAulas()}>
                  Tentar novamente
                </button>
              }
            />
          ) : aulasOrdenadas.length === 0 ? (
            <AdmStatePanel tone="empty" title="Nenhuma aula encontrada" message="Ajuste os filtros ou cadastre uma nova aula." />
          ) : (
            <AdmTable
              columns={columns}
              rows={aulasOrdenadas.map((aula) => ({
                titulo: <span className="font-semibold text-white">{aula.titulo}</span>,
                modalidade: aula.modalidade,
                dataHora: formatDateTime(aula.dataHora),
                vagas: aula.vagas ? `${aula.vagas}` : "N/D",
                status: <AdmStatusBadge status={aula.cancelada ? "Cancelada" : "Confirmada"} />,
                acoes: (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-accent/30 px-2.5 py-1 text-xs font-semibold text-accent"
                      onClick={() => handleEditar(aula)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-secondary/40 px-2.5 py-1 text-xs font-semibold text-rose-100 disabled:opacity-50"
                      onClick={() => void handleCancelar(aula.id)}
                      disabled={aula.cancelada || isMutating}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-white/30 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50"
                      onClick={() => void handleExcluir(aula.id)}
                      disabled={isMutating}
                    >
                      Excluir
                    </button>
                  </div>
                ),
              }))}
            />
          )}
        </div>
      </section>
    </AdmShell>
  );
}
