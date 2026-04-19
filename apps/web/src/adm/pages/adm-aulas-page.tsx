import { AdmSelectInput, AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
import type { AulaRow } from "@/adm/types";

const aulas: AulaRow[] = [
  {
    titulo: "Fundamentos Kids",
    modalidade: "Kids",
    dataHora: "Seg • 18:00",
    vagas: "24/30",
    status: "Confirmada",
  },
  {
    titulo: "No-Gi Avancado",
    modalidade: "Adulto",
    dataHora: "Seg • 20:00",
    vagas: "18/25",
    status: "Agendada",
  },
  {
    titulo: "Treino Competicao",
    modalidade: "Competicao",
    dataHora: "Qua • 20:15",
    vagas: "16/20",
    status: "Confirmada",
  },
  {
    titulo: "Open Mat Especial",
    modalidade: "Adulto",
    dataHora: "Sab • 10:00",
    vagas: "0/35",
    status: "Cancelada",
  },
];

const columns = [
  { key: "titulo", label: "Titulo" },
  { key: "modalidade", label: "Modalidade" },
  { key: "dataHora", label: "Data/Hora" },
  { key: "vagas", label: "Vagas" },
  { key: "status", label: "Status" },
  { key: "acoes", label: "Acoes" },
];

export function AdmAulasPage() {
  return (
    <AdmShell
      title="Controle de Aulas"
      subtitle="Gestao visual da grade semanal com filtros, estado da turma e acoes de edicao."
      actions={
        <>
          <button type="button" className="btn-outline">
            Exportar agenda
          </button>
          <button type="button" className="btn-primary">
            Criar nova aula
          </button>
        </>
      }
    >
      <section className="section-shell p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Filtros rapidos</p>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <AdmSelectInput label="Modalidade" name="modalidade" defaultValue="todos">
            <option value="todos">Todas</option>
            <option value="adulto">Adulto</option>
            <option value="kids">Kids</option>
            <option value="competicao">Competicao</option>
          </AdmSelectInput>

          <AdmSelectInput label="Status" name="status" defaultValue="todos">
            <option value="todos">Todos</option>
            <option value="confirmada">Confirmada</option>
            <option value="agendada">Agendada</option>
            <option value="cancelada">Cancelada</option>
          </AdmSelectInput>

          <AdmTextInput label="Data inicial" type="date" name="inicio" />
          <AdmTextInput label="Data final" type="date" name="fim" />
        </div>
      </section>

      <section className="mt-6 section-shell p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Grade operacional</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Aulas cadastradas</h2>

        <div className="mt-5">
          <AdmTable
            columns={columns}
            rows={aulas.map((aula) => ({
              titulo: <span className="font-semibold text-white">{aula.titulo}</span>,
              modalidade: aula.modalidade,
              dataHora: aula.dataHora,
              vagas: aula.vagas,
              status: <AdmStatusBadge status={aula.status} />,
              acoes: (
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-slate-500 px-2.5 py-1 text-xs font-semibold">
                    Editar
                  </button>
                  <button type="button" className="rounded-full border border-orange-300/40 px-2.5 py-1 text-xs font-semibold text-orange-200">
                    Cancelar
                  </button>
                </div>
              ),
            }))}
          />
        </div>
      </section>
    </AdmShell>
  );
}
