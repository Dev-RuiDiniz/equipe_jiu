import { PublicShell } from "@/publicas/components/public-shell";

const modalidades = [
  {
    nome: "Adulto",
    descricao: "Treino tecnico, situacional e rolas orientados por nivel.",
    publico: "Iniciante ao avancado",
  },
  {
    nome: "Kids",
    descricao: "Aulas com foco em disciplina, coordenacao e defesa pessoal.",
    publico: "6 a 13 anos",
  },
  {
    nome: "Competicao",
    descricao: "Camp de alto rendimento com preparo tatico e estrategia de campeonato.",
    publico: "Atletas da equipe",
  },
];

const grade = [
  { dia: "Segunda", adulto: "19:00", kids: "-", competicao: "20:15" },
  { dia: "Terca", adulto: "20:00", kids: "18:00", competicao: "-" },
  { dia: "Quarta", adulto: "19:00", kids: "-", competicao: "20:15" },
  { dia: "Quinta", adulto: "20:00", kids: "18:00", competicao: "-" },
  { dia: "Sexta", adulto: "19:00", kids: "-", competicao: "20:10" },
  { dia: "Sabado", adulto: "09:00", kids: "09:00", competicao: "10:00" },
];

const sistemaFaixas = [
  { faixa: "Branca", tempo: "6-18 meses", foco: "Base, defesa e posicoes" },
  { faixa: "Azul", tempo: "2-3 anos", foco: "Transicoes e controle" },
  { faixa: "Roxa", tempo: "1,5-2 anos", foco: "Ataque encadeado" },
  { faixa: "Marrom", tempo: "1-2 anos", foco: "Refino e consistencia" },
  { faixa: "Preta", tempo: "Longo prazo", foco: "Mestria tecnica" },
];

export function ModalidadesPage() {
  return (
    <PublicShell eyebrow="Pagina Publica" title="Treinos desenhados por objetivo e nivel.">
      <section className="grid gap-4 md:grid-cols-3">
        {modalidades.map((item) => (
          <article key={item.nome} className="section-shell p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Modalidade</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">{item.nome}</h2>
            <p className="mt-3 text-slate-300">{item.descricao}</p>
            <p className="mt-4 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-200">
              Publico: {item.publico}
            </p>
          </article>
        ))}
      </section>

      <section className="section-shell p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Grade semanal</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">Tabela de horarios por turma</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[620px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                <th className="px-3 py-2">Dia</th>
                <th className="px-3 py-2">Adulto</th>
                <th className="px-3 py-2">Kids</th>
                <th className="px-3 py-2">Competicao</th>
              </tr>
            </thead>
            <tbody>
              {grade.map((linha) => (
                <tr key={linha.dia} className="card text-slate-100">
                  <td className="rounded-l-xl px-3 py-3 font-semibold">{linha.dia}</td>
                  <td className="px-3 py-3">{linha.adulto}</td>
                  <td className="px-3 py-3">{linha.kids}</td>
                  <td className="rounded-r-xl px-3 py-3">{linha.competicao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-shell p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Sistema de graduacao</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">Faixas, requisitos e tempo medio</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {sistemaFaixas.map((item) => (
            <article key={item.faixa} className="card p-4">
              <p className="display-font text-3xl text-white">{item.faixa}</p>
              <p className="mt-1 text-sm font-semibold text-orange-200">{item.tempo}</p>
              <p className="mt-2 text-sm text-slate-300">{item.foco}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
