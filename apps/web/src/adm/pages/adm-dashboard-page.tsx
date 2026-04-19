import { AdmKpiCard } from "@/adm/components/adm-kpi-card";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import type { KpiCard } from "@/adm/types";

const kpis: KpiCard[] = [
  { label: "Alunos ativos", value: "128", trend: "+9 no mes", tone: "up" },
  { label: "Presenca media", value: "82%", trend: "+4 p.p.", tone: "up" },
  { label: "Aulas na semana", value: "22", trend: "Fluxo estavel", tone: "neutral" },
  { label: "Alertas de faixa", value: "6", trend: "Revisar hoje", tone: "alert" },
];

const aulas = [
  { titulo: "No-Gi Avancado", horario: "19:00", sala: "Tatame 1", status: "Confirmada" },
  { titulo: "Kids Intermediario", horario: "18:00", sala: "Tatame 2", status: "Agendada" },
  { titulo: "Competicao", horario: "20:15", sala: "Tatame 1", status: "Confirmada" },
];

const frequencia = [56, 72, 68, 80, 76, 84, 88, 82, 90, 86, 91, 89];

export function AdmDashboardPage() {
  return (
    <AdmShell
      title="Dashboard"
      subtitle="Resumo visual do desempenho semanal da equipe e dos principais alertas operacionais."
      actions={
        <>
          <button type="button" className="btn-outline">
            Exportar relatorio
          </button>
          <button type="button" className="btn-primary">
            Nova aula
          </button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <AdmKpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Frequencia mensal (mock)</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Tendencia de presenca por semana</h2>
          <div className="mt-6 grid h-56 grid-cols-12 items-end gap-2 rounded-2xl border border-white/10 bg-[#0f1628] p-3">
            {frequencia.map((valor, index) => (
              <div key={index} className="group flex h-full items-end justify-center">
                <div
                  className="w-full rounded-md bg-gradient-to-t from-orange-500 to-emerald-300/80"
                  style={{ height: `${valor}%` }}
                  aria-label={`Semana ${index + 1}: ${valor}%`}
                />
              </div>
            ))}
          </div>
        </article>

        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Proximas aulas</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Agenda de hoje</h2>
          <ul className="mt-4 space-y-3">
            {aulas.map((aula) => (
              <li key={`${aula.titulo}-${aula.horario}`} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{aula.titulo}</p>
                    <p className="text-sm text-slate-300">
                      {aula.horario} • {aula.sala}
                    </p>
                  </div>
                  <AdmStatusBadge status={aula.status} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-6 section-shell p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Alertas operacionais</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Faixas proximas de renovacao</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="card p-4">
            <p className="font-semibold text-white">Larissa M.</p>
            <p className="text-sm text-slate-300">Faixa azul • 1º grau</p>
            <p className="mt-2 text-sm text-amber-200">Revisar em 12 dias</p>
          </article>
          <article className="card p-4">
            <p className="font-semibold text-white">Paulo R.</p>
            <p className="text-sm text-slate-300">Faixa branca • 4º grau</p>
            <p className="mt-2 text-sm text-amber-200">Revisar em 9 dias</p>
          </article>
          <article className="card p-4">
            <p className="font-semibold text-white">Julia C.</p>
            <p className="text-sm text-slate-300">Faixa roxa • 2º grau</p>
            <p className="mt-2 text-sm text-amber-200">Revisar em 15 dias</p>
          </article>
        </div>
      </section>
    </AdmShell>
  );
}
