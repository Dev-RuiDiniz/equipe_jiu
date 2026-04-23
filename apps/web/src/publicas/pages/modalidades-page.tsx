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
  { faixa: "Branca", tempo: "6-18 meses", foco: "Base, defesa e posicoes", destaque: "bg-white text-black" },
  { faixa: "Azul", tempo: "2-3 anos", foco: "Transicoes e controle", destaque: "bg-sky-500 text-white" },
  { faixa: "Roxa", tempo: "1,5-2 anos", foco: "Ataque encadeado", destaque: "bg-violet-600 text-white" },
  { faixa: "Marrom", tempo: "1-2 anos", foco: "Refino e consistencia", destaque: "bg-amber-800 text-white" },
  { faixa: "Preta", tempo: "Longo prazo", foco: "Mestria tecnica", destaque: "bg-black text-white border border-white/20" },
];

export function ModalidadesPage() {
  return (
    <PublicShell eyebrow="Treinos" title="Turmas desenhadas para evolução real em cada fase do caminho.">
      <section className="grid gap-4 md:grid-cols-3">
        {modalidades.map((item) => (
          <article key={item.nome} className="section-shell px-5 py-6">
            <p className="eyebrow">Modalidade</p>
            <h2 className="display-font mt-3 text-4xl text-white">{item.nome}</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">{item.descricao}</p>
            <p className="mt-5 inline-flex rounded-full border border-accent/24 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-accent">
              Publico: {item.publico}
            </p>
          </article>
        ))}
      </section>

      <section className="section-shell px-6 py-8 md:px-8">
        <p className="eyebrow">Grade semanal</p>
        <h2 className="display-font mt-3 text-4xl text-white md:text-5xl">Tabela de horarios</h2>
        <div className="mt-6 overflow-x-auto rounded-[24px] border border-accent/12 bg-black/30 p-2 md:p-4">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Adulto</th>
                <th>Kids</th>
                <th>Competicao</th>
              </tr>
            </thead>
            <tbody>
              {grade.map((linha) => (
                <tr key={linha.dia}>
                  <td className="font-bold uppercase tracking-[0.14em]">{linha.dia}</td>
                  <td className={linha.adulto !== "-" ? "text-accent font-black" : "text-white/38"}>{linha.adulto}</td>
                  <td className={linha.kids !== "-" ? "text-white font-semibold" : "text-white/38"}>{linha.kids}</td>
                  <td className={linha.competicao !== "-" ? "text-secondary font-black" : "text-white/38"}>
                    {linha.competicao}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-shell px-6 py-8 md:px-8">
        <p className="eyebrow">Sistema de graduacao</p>
        <h2 className="display-font mt-3 text-4xl text-white md:text-5xl">Faixas e prioridades tecnicas</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {sistemaFaixas.map((item) => (
            <article key={item.faixa} className="card px-4 py-5">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${item.destaque}`}>
                {item.faixa}
              </span>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-accent">{item.tempo}</p>
              <p className="mt-3 text-sm leading-7 text-white/68">{item.foco}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
