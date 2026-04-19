"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdmSelectInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatePanel } from "@/adm/components/adm-state-panel";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
import type { AlunoApi, AulaApi, PresencaPorAulaApi } from "@/adm/types/api";
import { apiClient, extractApiErrorMessage, withQuery } from "@/lib/api-client";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdmPresencasPage() {
  const [aulas, setAulas] = useState<AulaApi[]>([]);
  const [alunos, setAlunos] = useState<AlunoApi[]>([]);
  const [selectedAulaId, setSelectedAulaId] = useState("");
  const [presencas, setPresencas] = useState<PresencaPorAulaApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadBase = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [aulasResponse, alunosResponse] = await Promise.all([
        apiClient.get<AulaApi[]>(withQuery("aulas", { cancelada: false })),
        apiClient.get<AlunoApi[]>(withQuery("alunos", { ativo: true })),
      ]);

      const aulasOrdenadas = [...aulasResponse].sort(
        (left, right) => new Date(left.dataHora).getTime() - new Date(right.dataHora).getTime(),
      );
      setAulas(aulasOrdenadas);
      setAlunos(alunosResponse);

      if (!selectedAulaId && aulasOrdenadas.length > 0) {
        setSelectedAulaId(aulasOrdenadas[0].id);
      }
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel carregar aulas e alunos."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedAulaId]);

  const loadPresencas = useCallback(async (aulaId: string) => {
    if (!aulaId) {
      setPresencas([]);
      return;
    }

    setError(null);
    try {
      const response = await apiClient.get<PresencaPorAulaApi[]>(`presencas/aula/${aulaId}`);
      setPresencas(response);
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel carregar o historico de presencas."));
    }
  }, []);

  useEffect(() => {
    void loadBase();
  }, [loadBase]);

  useEffect(() => {
    if (!selectedAulaId) {
      return;
    }
    void loadPresencas(selectedAulaId);
  }, [loadPresencas, selectedAulaId]);

  const selectedAula = useMemo(() => aulas.find((aula) => aula.id === selectedAulaId) ?? null, [aulas, selectedAulaId]);
  const presentesIds = useMemo(() => new Set(presencas.map((item) => item.alunoId)), [presencas]);
  const presentes = presentesIds.size;
  const faltas = Math.max(alunos.length - presentes, 0);
  const taxa = alunos.length > 0 ? Math.round((presentes / alunos.length) * 100) : 0;

  const registrarPresenca = useCallback(
    async (alunoId: string, presente: boolean) => {
      if (!selectedAulaId) {
        return;
      }

      setIsSaving(true);
      setError(null);
      setFeedback(null);

      try {
        await apiClient.post("presencas", {
          aulaId: selectedAulaId,
          alunoId,
          presente,
        });
        await loadPresencas(selectedAulaId);
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Falha ao registrar presenca."));
      } finally {
        setIsSaving(false);
      }
    },
    [loadPresencas, selectedAulaId],
  );

  const handleExportCsv = useCallback(async () => {
    setIsExporting(true);
    setError(null);
    setFeedback(null);

    try {
      const csv = await apiClient.get<string>("presencas/export");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "presencas.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setFeedback("Arquivo CSV exportado com sucesso.");
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel exportar o CSV de presencas."));
    } finally {
      setIsExporting(false);
    }
  }, []);

  const columns = [
    { key: "aluno", label: "Aluno" },
    { key: "aula", label: "Aula" },
    { key: "confirmadoEm", label: "Timestamp" },
    { key: "status", label: "Status" },
  ];

  return (
    <AdmShell
      title="Presencas"
      subtitle="Chamada por aula conectada ao backend com historico e exportacao em CSV."
      actions={
        <>
          <button type="button" className="btn-outline" onClick={() => void handleExportCsv()} disabled={isExporting}>
            {isExporting ? "Exportando..." : "Exportar CSV"}
          </button>
          <button type="button" className="btn-primary" onClick={() => void loadPresencas(selectedAulaId)}>
            Atualizar chamada
          </button>
        </>
      }
    >
      {isLoading ? (
        <AdmStatePanel
          tone="loading"
          title="Carregando presencas"
          message="Buscando aulas e alunos para iniciar a chamada."
        />
      ) : error ? (
        <AdmStatePanel
          tone="error"
          title="Falha na carga de presencas"
          message={error}
          action={
            <button type="button" className="btn-outline" onClick={() => void loadBase()}>
              Tentar novamente
            </button>
          }
        />
      ) : aulas.length === 0 || alunos.length === 0 ? (
        <AdmStatePanel
          tone="empty"
          title="Dados insuficientes para chamada"
          message="Cadastre aulas e mantenha alunos ativos para registrar presencas."
        />
      ) : (
        <section className="grid gap-5 xl:grid-cols-[1fr,1fr]">
          <article className="section-shell p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Chamada da aula</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {selectedAula ? `${selectedAula.titulo} • ${formatDateTime(selectedAula.dataHora)}` : "Selecionar aula"}
            </h2>

            <div className="mt-4">
              <AdmSelectInput
                label="Selecionar aula"
                name="aula"
                value={selectedAulaId}
                onChange={(event) => setSelectedAulaId(event.target.value)}
              >
                {aulas.map((aula) => (
                  <option key={aula.id} value={aula.id}>
                    {aula.titulo} • {formatDateTime(aula.dataHora)}
                  </option>
                ))}
              </AdmSelectInput>
            </div>

            <ul className="mt-5 space-y-3">
              {alunos.map((aluno) => {
                const presente = presentesIds.has(aluno.id);
                return (
                  <li key={aluno.id} className="card flex items-center justify-between gap-3 p-3">
                    <div>
                      <p className="font-semibold text-white">{aluno.nome}</p>
                      <p className="text-xs text-slate-400">
                        {aluno.faixa} • {aluno.grau}o grau
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={presente}
                        onChange={(event) => void registrarPresenca(aluno.id, event.target.checked)}
                        className="size-4 rounded border-slate-500 bg-slate-800"
                        disabled={isSaving}
                      />
                      Presente
                    </label>
                  </li>
                );
              })}
            </ul>
          </article>

          <article className="section-shell p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Resumo da aula</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="card p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Presentes</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-200">{presentes}</p>
              </div>
              <div className="card p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Faltas</p>
                <p className="mt-1 text-2xl font-extrabold text-orange-200">{faltas}</p>
              </div>
              <div className="card p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Taxa</p>
                <p className="mt-1 text-2xl font-extrabold text-sky-200">{taxa}%</p>
              </div>
            </div>

            {feedback ? <p className="mt-4 text-sm text-emerald-200">{feedback}</p> : null}

            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-orange-300">Historico recente</p>
            <div className="mt-3">
              {presencas.length === 0 ? (
                <AdmStatePanel
                  tone="empty"
                  title="Sem registros para a aula"
                  message="Marque a presenca dos alunos para gerar historico no painel."
                />
              ) : (
                <AdmTable
                  columns={columns}
                  rows={presencas.map((item) => ({
                    aluno: <span className="font-semibold text-white">{item.aluno.nome}</span>,
                    aula: selectedAula?.titulo ?? "Aula",
                    confirmadoEm: formatDateTime(item.confirmadoEm),
                    status: <AdmStatusBadge status="Presente" />,
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
