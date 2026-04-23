"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdmSelectInput, AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatePanel } from "@/adm/components/adm-state-panel";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
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

export function AdmAulasPage() {
  const [modalidade, setModalidade] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [aulas, setAulas] = useState<AulaApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleCancelar = useCallback(
    async (aulaId: string) => {
      setIsMutating(true);
      setError(null);

      try {
        await apiClient.patch<AulaApi>(`aulas/${aulaId}/cancelar`, {});
        await loadAulas();
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Nao foi possivel cancelar a aula selecionada."));
      } finally {
        setIsMutating(false);
      }
    },
    [loadAulas],
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
      subtitle="Grade semanal conectada ao backend com filtros por modalidade, data e status."
      actions={
        <>
          <button type="button" className="btn-outline" onClick={() => void loadAulas()}>
            Atualizar agenda
          </button>
        </>
      }
    >
      <section className="section-shell p-5 md:p-6">
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
            <AdmStatePanel
              tone="loading"
              title="Buscando aulas"
              message="Carregando dados reais da grade para a equipe administrativa."
            />
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
            <AdmStatePanel
              tone="empty"
              title="Nenhuma aula encontrada"
              message="Ajuste os filtros ou cadastre uma nova aula para preencher a grade."
            />
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
                      className="rounded-full border border-secondary/40 px-2.5 py-1 text-xs font-semibold text-rose-100 disabled:opacity-50"
                      onClick={() => void handleCancelar(aula.id)}
                      disabled={aula.cancelada || isMutating}
                    >
                      {aula.cancelada ? "Ja cancelada" : isMutating ? "Salvando..." : "Cancelar"}
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
