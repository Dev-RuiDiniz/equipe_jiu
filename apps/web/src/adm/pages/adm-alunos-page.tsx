import { AdmSelectInput, AdmTextArea, AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
import type { AlunoResumo } from "@/adm/types";

const alunos: AlunoResumo[] = [
  { nome: "Larissa M.", faixa: "Azul", grau: "1º", frequencia: "91%", status: "Ativo" },
  { nome: "Carlos R.", faixa: "Branca", grau: "4º", frequencia: "73%", status: "Ativo" },
  { nome: "Julia C.", faixa: "Roxa", grau: "2º", frequencia: "88%", status: "Ativo" },
  { nome: "Paulo T.", faixa: "Azul", grau: "0º", frequencia: "52%", status: "Inativo" },
];

const columns = [
  { key: "nome", label: "Aluno" },
  { key: "faixa", label: "Faixa" },
  { key: "grau", label: "Grau" },
  { key: "frequencia", label: "Frequencia" },
  { key: "status", label: "Status" },
  { key: "acoes", label: "Acoes" },
];

export function AdmAlunosPage() {
  return (
    <AdmShell
      title="Cadastro e Acompanhamento"
      subtitle="Ficha visual de aluno com faixa, grau, observacoes e status de atividade."
      actions={
        <>
          <button type="button" className="btn-outline">
            Exportar ficha
          </button>
          <button type="button" className="btn-primary">
            Salvar aluno
          </button>
        </>
      }
    >
      <section className="grid gap-5 xl:grid-cols-[1fr,1fr]">
        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Ficha do aluno</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Cadastro visual</h2>

          <form className="mt-5 grid gap-4" action="#" method="post">
            <div className="grid gap-4 md:grid-cols-2">
              <AdmTextInput label="Nome" name="nome" placeholder="Nome completo" />
              <AdmTextInput label="CPF" name="cpf" placeholder="000.000.000-00" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <AdmSelectInput label="Faixa" name="faixa" defaultValue="branca">
                <option value="branca">Branca</option>
                <option value="azul">Azul</option>
                <option value="roxa">Roxa</option>
                <option value="marrom">Marrom</option>
                <option value="preta">Preta</option>
              </AdmSelectInput>

              <AdmSelectInput label="Grau" name="grau" defaultValue="0">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </AdmSelectInput>

              <AdmSelectInput label="Status" name="status" defaultValue="ativo">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </AdmSelectInput>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AdmTextInput label="Telefone" name="telefone" placeholder="(11) 90000-0000" />
              <AdmTextInput label="Data de nascimento" type="date" name="data_nascimento" />
            </div>

            <AdmTextArea label="Observacoes" name="observacoes" placeholder="Anotacoes do professor sobre evolucao tecnica" />
          </form>
        </article>

        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Acompanhamento</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Resumo de alunos</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Ativos</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-200">120</p>
            </div>
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Inativos</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-200">8</p>
            </div>
            <div className="card p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Media frequencia</p>
              <p className="mt-1 text-2xl font-extrabold text-sky-200">81%</p>
            </div>
          </div>

          <div className="mt-5">
            <AdmTable
              columns={columns}
              rows={alunos.map((aluno) => ({
                nome: <span className="font-semibold text-white">{aluno.nome}</span>,
                faixa: aluno.faixa,
                grau: aluno.grau,
                frequencia: aluno.frequencia,
                status: <AdmStatusBadge status={aluno.status} />,
                acoes: (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-full border border-slate-500 px-2.5 py-1 text-xs font-semibold">
                      Editar
                    </button>
                    <button type="button" className="rounded-full border border-orange-300/40 px-2.5 py-1 text-xs font-semibold text-orange-200">
                      Inativar
                    </button>
                  </div>
                ),
              }))}
            />
          </div>
        </article>
      </section>
    </AdmShell>
  );
}
