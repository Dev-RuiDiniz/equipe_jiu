import { PublicShell } from "@/publicas/components/public-shell";

const professores = [
  { nome: "Rafael Diniz", faixa: "Faixa Preta 3º grau", foco: "Estrategia e jogo de pressao" },
  { nome: "Camila Torres", faixa: "Faixa Preta", foco: "Jiu-jitsu feminino e defesa pessoal" },
  { nome: "Joao Nogueira", faixa: "Faixa Marrom", foco: "Formacao kids e fundamentos" },
];

const valores = [
  {
    titulo: "Disciplina real",
    descricao: "Treino com metodo, repeticao intencional e metas claras por ciclo.",
  },
  {
    titulo: "Respeito ao processo",
    descricao: "Cada graduacao e tratada como consequencia da consistencia, nao de pressa.",
  },
  {
    titulo: "Comunidade forte",
    descricao: "Ambiente competitivo sem perder acolhimento para novos alunos.",
  },
];

const marcos = [
  "2017 · Fundacao da equipe com foco em base tecnica",
  "2020 · Expansao do programa kids com turmas dedicadas",
  "2023 · 1º titulo estadual por equipes",
  "2025 · Consolidacao da metodologia de graduacao trimestral",
];

export function SobrePage() {
  return (
    <PublicShell eyebrow="Pagina Publica" title="Uma equipe construida no detalhe de cada treino.">
      <section className="section-shell grid gap-6 p-6 md:grid-cols-[1.2fr,0.8fr] md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Nossa historia</p>
          <h2 className="mt-2 text-3xl font-extrabold text-white">Do bairro para o circuito competitivo</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            A Equipe Jiu nasceu para combinar formacao tecnica de alto nivel com uma cultura de treino
            consistente. O objetivo sempre foi simples: evolucao real para quem entra no tatame.
          </p>

          <ul className="mt-6 space-y-3">
            {marcos.map((marco) => (
              <li key={marco} className="card p-4 text-slate-200">
                {marco}
              </li>
            ))}
          </ul>
        </div>

        <aside className="card p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Indicadores</p>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#0f1627] p-3">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Alunos</dt>
              <dd className="mt-1 text-3xl font-extrabold">120+</dd>
            </div>
            <div className="rounded-xl bg-[#0f1627] p-3">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Anos</dt>
              <dd className="mt-1 text-3xl font-extrabold">9</dd>
            </div>
            <div className="rounded-xl bg-[#0f1627] p-3">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Medalhas</dt>
              <dd className="mt-1 text-3xl font-extrabold">54</dd>
            </div>
            <div className="rounded-xl bg-[#0f1627] p-3">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Professores</dt>
              <dd className="mt-1 text-3xl font-extrabold">6</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="section-shell p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Professores e graduacao</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">Referencia tecnica dentro e fora da academia</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {professores.map((professor) => (
            <article key={professor.nome} className="card p-4">
              <div className="h-36 rounded-xl bg-gradient-to-br from-orange-500/35 to-emerald-400/30" />
              <h3 className="mt-4 text-xl font-bold text-white">{professor.nome}</h3>
              <p className="text-sm font-semibold text-orange-200">{professor.faixa}</p>
              <p className="mt-2 text-sm text-slate-300">{professor.foco}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {valores.map((valor) => (
          <article key={valor.titulo} className="section-shell p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Valor</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{valor.titulo}</h3>
            <p className="mt-3 text-slate-300">{valor.descricao}</p>
          </article>
        ))}
      </section>

      <section className="section-shell p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Ambiente de treino</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">Estrutura pensada para evolucao constante</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="h-44 rounded-2xl bg-gradient-to-br from-[#1d2d47] to-[#101726]" />
          <div className="h-44 rounded-2xl bg-gradient-to-br from-[#2f1f17] to-[#141726]" />
          <div className="h-44 rounded-2xl bg-gradient-to-br from-[#1b382c] to-[#101726]" />
        </div>
      </section>
    </PublicShell>
  );
}
