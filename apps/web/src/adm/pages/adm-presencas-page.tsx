import { AdmSelectInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
import type { PresencaRow } from "@/adm/types";

const chamada = [
  { aluno: "Larissa M.", presente: true },
  { aluno: "Gustavo A.", presente: true },
  { aluno: "Carlos R.", presente: false },
  { aluno: "Julia C.", presente: true },
  { aluno: "Paulo T.", presente: false },
];

const historico: PresencaRow[] = [
  {
    aluno: "Larissa M.",
    aula: "No-Gi Avancado",
    confirmadoEm: "18/04 19:03",
    frequencia: "91%",
    status: "Presente",
  },
  {
    aluno: "Carlos R.",
    aula: "No-Gi Avancado",
    confirmadoEm: "18/04 19:03",
    frequencia: "73%",
    status: "Falta",
  },
  {
    aluno: "Julia C.",
    aula: "Fundamentos Kids",
    confirmadoEm: "18/04 18:04",
    frequencia: "88%",
    status: "Atraso",
  },
];

const columns = [
  { key: "aluno", label: "Aluno" },
  { key: "aula", label: "Aula" },
  { key: "confirmadoEm", label: "Timestamp" },
  { key: "frequencia", label: "Frequencia" },
  { key: "status", label: "Status" },
];

export function AdmPresencasPage() {
  return (
    <AdmShell
      title="Presencas"
      subtitle="Controle de chamada por aula com historico consolidado e exportacao visual de relatorio."
      actions={
        <>
          <button type="button" className="btn-outline">
            Exportar CSV
          </button>
          <button type="button" className="btn-primary">
            Salvar chamada
          </button>
        </>
      }
    >
      <section className="grid gap-5 xl:grid-cols-[1fr,1fr]">
        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Chamada da aula</p>
          <h2 className="mt-2 text-2xl font-bold text-white">No-Gi Avancado • 19:00</h2>

          <div className="mt-4">
            <AdmSelectInput label="Selecionar aula" name="aula" defaultValue="nogi-avancado">
              <option value="nogi-avancado">No-Gi Avancado • 19:00</option>
              <option value="kids-fundamentos">Fundamentos Kids • 18:00</option>
              <option value="competicao">Treino Competicao • 20:15</option>
            </AdmSelectInput>
          </div>

          <ul className="mt-5 space-y-3">
            {chamada.map((item) => (
              <li key={item.aluno} className="card flex items-center justify-between gap-3 p-3">
                <p className="font-semibold text-white">{item.aluno}</p>
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    defaultChecked={item.presente}
                    className="size-4 rounded border-slate-500 bg-slate-800"
                  />
                  Presente
                </label>
              </li>
            ))}
          </ul>
        </article>

        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Resumo da aula</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Presentes</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-200">18</p>
            </div>
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Faltas</p>
              <p className="mt-1 text-2xl font-extrabold text-orange-200">4</p>
            </div>
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Taxa</p>
              <p className="mt-1 text-2xl font-extrabold text-sky-200">82%</p>
            </div>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-orange-300">Historico recente</p>
          <div className="mt-3">
            <AdmTable
              columns={columns}
              rows={historico.map((item) => ({
                aluno: <span className="font-semibold text-white">{item.aluno}</span>,
                aula: item.aula,
                confirmadoEm: item.confirmadoEm,
                frequencia: item.frequencia,
                status: <AdmStatusBadge status={item.status} />,
              }))}
            />
          </div>
        </article>
      </section>
    </AdmShell>
  );
}
