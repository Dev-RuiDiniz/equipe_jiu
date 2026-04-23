"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdmKpiCard } from "@/adm/components/adm-kpi-card";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatePanel } from "@/adm/components/adm-state-panel";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import type { KpiCard } from "@/adm/types";
import type { AulaApi, DashboardFrequenciaItem, DashboardResumoResponse } from "@/adm/types/api";
import { apiClient, extractApiErrorMessage, withQuery } from "@/lib/api-client";

function formatDateTime(dateTime: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateTime));
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  if (!year || !month) {
    return monthKey;
  }

  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date);
}

export function AdmDashboardPage() {
  const [resumo, setResumo] = useState<DashboardResumoResponse | null>(null);
  const [frequencia, setFrequencia] = useState<DashboardFrequenciaItem[]>([]);
  const [proximasAulas, setProximasAulas] = useState<AulaApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [resumoResponse, frequenciaResponse, aulasResponse] = await Promise.all([
        apiClient.get<DashboardResumoResponse>("dashboard/resumo"),
        apiClient.get<DashboardFrequenciaItem[]>("dashboard/frequencia-mensal"),
        apiClient.get<AulaApi[]>(
          withQuery("aulas", {
            dataInicio: new Date().toISOString(),
            cancelada: false,
          }),
        ),
      ]);

      const aulasOrdenadas = [...aulasResponse].sort(
        (left, right) => new Date(left.dataHora).getTime() - new Date(right.dataHora).getTime(),
      );

      setResumo(resumoResponse);
      setFrequencia(frequenciaResponse);
      setProximasAulas(aulasOrdenadas.slice(0, 3));
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel carregar o dashboard no momento."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const kpis = useMemo<KpiCard[]>(() => {
    if (!resumo) {
      return [];
    }

    return [
      { label: "Alunos ativos", value: String(resumo.alunosAtivos), trend: "Base atual", tone: "up" },
      { label: "Presenca media", value: `${resumo.presencaMediaSemana}%`, trend: "Ultimos 7 dias", tone: "up" },
      { label: "Aulas futuras", value: String(resumo.proximasAulas), trend: "Agenda ativa", tone: "neutral" },
      { label: "Alertas de faixa", value: String(resumo.alertasGraduacao), trend: "Revisar progresso", tone: "alert" },
    ];
  }, [resumo]);

  const maxPresencas = useMemo(() => {
    const values = frequencia.map((item) => item.totalPresencas);
    return values.length > 0 ? Math.max(...values, 1) : 1;
  }, [frequencia]);

  return (
    <AdmShell
      title="Dashboard"
      subtitle="Resumo operacional da equipe com indicadores reais de alunos, aulas e presencas."
      actions={
        <>
          <button type="button" className="btn-outline" onClick={() => void loadDashboard()}>
            Atualizar dados
          </button>
        </>
      }
    >
      {isLoading ? (
        <AdmStatePanel
          tone="loading"
          title="Carregando indicadores"
          message="Buscando dados reais de frequencia e agenda para montar o dashboard."
        />
      ) : error ? (
        <AdmStatePanel
          tone="error"
          title="Falha ao carregar dashboard"
          message={error}
          action={
            <button type="button" className="btn-outline" onClick={() => void loadDashboard()}>
              Tentar novamente
            </button>
          }
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((item) => (
              <AdmKpiCard key={item.label} item={item} />
            ))}
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
            <article className="section-shell p-5 md:p-6">
              <p className="eyebrow">Frequencia mensal</p>
              <h2 className="display-font mt-3 text-3xl text-white">Registros de presenca por mes</h2>

              {frequencia.length === 0 ? (
                <div className="mt-5">
                  <AdmStatePanel
                    tone="empty"
                    title="Sem historico no periodo"
                    message="Nenhuma presenca foi registrada nos ultimos meses."
                  />
                </div>
              ) : (
                <div className="mt-6 grid h-56 grid-cols-6 items-end gap-3 rounded-[24px] border border-accent/12 bg-black/35 p-4">
                  {frequencia.map((item) => {
                    const height = Math.max((item.totalPresencas / maxPresencas) * 100, 6);
                    return (
                      <div key={item.mes} className="group flex h-full flex-col items-center justify-end gap-2">
                        <div
                          className="w-full rounded-md bg-gradient-to-t from-[#a87b10] via-[#fbc02d] to-[#ffe08b]"
                          style={{ height: `${height}%` }}
                          aria-label={`${item.mes}: ${item.totalPresencas} presencas`}
                        />
                        <p className="text-[11px] uppercase tracking-[0.08em] text-white/62">
                          {formatMonthLabel(item.mes)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>

            <article className="section-shell p-5 md:p-6">
              <p className="eyebrow">Proximas aulas</p>
              <h2 className="display-font mt-3 text-3xl text-white">Agenda operacional</h2>

              {proximasAulas.length === 0 ? (
                <div className="mt-5">
                  <AdmStatePanel
                    tone="empty"
                    title="Sem aulas programadas"
                    message="Cadastre novas aulas para preencher a agenda administrativa."
                  />
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {proximasAulas.map((aula) => (
                    <li key={aula.id} className="adm-card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{aula.titulo}</p>
                          <p className="text-sm text-white/66">
                            {formatDateTime(aula.dataHora)} • {aula.modalidade}
                          </p>
                        </div>
                        <AdmStatusBadge status={aula.cancelada ? "Cancelada" : "Confirmada"} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>

          <section className="mt-6 section-shell p-5 md:p-6">
            <p className="eyebrow">Alertas operacionais</p>
            <h2 className="display-font mt-3 text-3xl text-white">Indicadores de acompanhamento</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <article className="adm-card p-4">
                <p className="font-semibold text-white">Alertas de graduacao</p>
                <p className="text-sm text-white/62">Alunos sem graduacao recente</p>
                <p className="mt-2 text-sm text-accent">{resumo?.alertasGraduacao ?? 0} sinalizados</p>
              </article>
              <article className="adm-card p-4">
                <p className="font-semibold text-white">Presencas da semana</p>
                <p className="text-sm text-white/62">Percentual de participacao geral</p>
                <p className="mt-2 text-sm text-emerald-200">{resumo?.presencaMediaSemana ?? 0}% de media</p>
              </article>
              <article className="adm-card p-4">
                <p className="font-semibold text-white">Agenda futura</p>
                <p className="text-sm text-white/62">Aulas confirmadas na fila</p>
                <p className="mt-2 text-sm text-accent">{resumo?.proximasAulas ?? 0} aulas programadas</p>
              </article>
            </div>
          </section>
        </>
      )}
    </AdmShell>
  );
}
