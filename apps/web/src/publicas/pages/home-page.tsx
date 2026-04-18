import Link from "next/link";
import { PublicShell } from "@/publicas/components/public-shell";

const horarios = [
  { turma: "Adulto Iniciante", dias: "Seg • Qua • Sex", horario: "19:00 - 20:00" },
  { turma: "Adulto Avancado", dias: "Seg • Qua • Sex", horario: "20:00 - 21:15" },
  { turma: "Kids", dias: "Ter • Qui", horario: "18:00 - 18:50" },
  { turma: "Competicao", dias: "Sabado", horario: "09:00 - 11:00" },
];

const depoimentos = [
  {
    nome: "Larissa M.",
    texto:
      "Voltei a treinar com consistencia e encontrei um time com metodo, acolhimento e alto nivel tecnico.",
  },
  {
    nome: "Eduardo C.",
    texto:
      "A evolucao de faixa ficou objetiva. Toda aula tem foco claro e acompanhamento de progresso.",
  },
  {
    nome: "Ana Paula R.",
    texto:
      "Meu filho entrou no Kids e ganhou disciplina e confianca em poucas semanas.",
  },
];

const conquistas = [
  "Campeoes estaduais por equipe em 2025",
  "17 medalhas em campeonatos regionais",
  "Programa kids com 94% de retencao",
];

export function HomePage() {
  return (
    <PublicShell eyebrow="Pagina Publica" title="Disciplina, tecnica e resultado no tatame.">
      <section className="section-shell overflow-hidden">
        <div className="grid gap-8 p-6 md:grid-cols-[1.2fr,0.8fr] md:p-8">
          <div className="space-y-5">
            <span className="signal">Aulas experimentais abertas</span>
            <h2 className="display-font text-5xl leading-none text-white md:text-7xl">
              Treine com um time que transforma rotina em performance.
            </h2>
            <p className="max-w-xl text-base text-slate-300">
              Metodo progressivo, professores experientes e ambiente de alto rendimento para quem quer
              evoluir no jiu-jitsu com consistencia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contato" className="btn-primary">
                Agendar aula experimental
              </Link>
              <a href="https://wa.me/5500000000000" className="btn-outline" target="_blank" rel="noreferrer">
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <aside className="card p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Ritmo semanal</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-slate-100">
              <div className="rounded-xl bg-[#0f1627] p-3">
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">Alunos ativos</dt>
                <dd className="mt-1 text-3xl font-extrabold">120+</dd>
              </div>
              <div className="rounded-xl bg-[#0f1627] p-3">
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">Treinos/semana</dt>
                <dd className="mt-1 text-3xl font-extrabold">18</dd>
              </div>
              <div className="rounded-xl bg-[#0f1627] p-3">
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">Professores</dt>
                <dd className="mt-1 text-3xl font-extrabold">6</dd>
              </div>
              <div className="rounded-xl bg-[#0f1627] p-3">
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">Presenca media</dt>
                <dd className="mt-1 text-3xl font-extrabold">82%</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="section-shell p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Horarios em destaque</p>
          <h3 className="mt-2 text-2xl font-bold">Modalidades para todos os niveis</h3>
          <ul className="mt-5 space-y-3">
            {horarios.map((item) => (
              <li key={item.turma} className="card flex flex-col gap-1 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{item.turma}</p>
                  <p className="text-sm text-slate-300">{item.dias}</p>
                </div>
                <strong className="text-orange-200">{item.horario}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="section-shell p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Conquistas recentes</p>
          <h3 className="mt-2 text-2xl font-bold">Resultados que refletem o treino</h3>
          <ul className="mt-5 space-y-3 text-slate-200">
            {conquistas.map((item) => (
              <li key={item} className="card p-4">
                {item}
              </li>
            ))}
          </ul>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-xl border border-emerald-300/45 bg-emerald-300/10 px-4 py-3 font-semibold text-emerald-200"
          >
            Receber agenda completa no WhatsApp
          </a>
        </article>
      </section>

      <section className="section-shell p-6 md:p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Depoimentos</p>
        <h3 className="mt-2 text-2xl font-bold">O que os alunos dizem sobre a equipe</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {depoimentos.map((item) => (
            <blockquote key={item.nome} className="card p-4">
              <p className="text-slate-200">“{item.texto}”</p>
              <footer className="mt-4 text-sm font-semibold text-orange-200">{item.nome}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
