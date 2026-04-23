import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/publicas/components/public-shell";

const horarios = [
  { turma: "Adulto Iniciante", dias: "Seg • Qua • Sex", horario: "19:00 - 20:00", destaque: "Fundamentos" },
  { turma: "Adulto Avancado", dias: "Seg • Qua • Sex", horario: "20:00 - 21:15", destaque: "Rendimento" },
  { turma: "Kids", dias: "Ter • Qui", horario: "18:00 - 18:50", destaque: "Disciplina" },
  { turma: "Competicao", dias: "Sabado", horario: "09:00 - 11:00", destaque: "Alta intensidade" },
];

const depoimentos = [
  {
    nome: "Larissa M.",
    texto: "Voltei a treinar com consistencia e encontrei um time com metodo, acolhimento e alto nivel tecnico.",
  },
  {
    nome: "Eduardo C.",
    texto: "A evolucao de faixa ficou objetiva. Toda aula tem foco claro e acompanhamento de progresso.",
  },
  {
    nome: "Ana Paula R.",
    texto: "Meu filho entrou no Kids e ganhou disciplina e confianca em poucas semanas.",
  },
];

const conquistas = [
  "Campeoes estaduais por equipe em 2025",
  "17 medalhas em campeonatos regionais",
  "Programa kids com 94% de retencao",
];

const stats = [
  { label: "Alunos ativos", val: "120+" },
  { label: "Treinos por semana", val: "18" },
  { label: "Professores", val: "6" },
  { label: "Presenca media", val: "82%" },
];

export function HomePage() {
  return (
    <PublicShell eyebrow="Equipe Jiu • Identidade oficial" title="Uma equipe construída para evoluir dentro e fora do tatame.">
      <section className="section-shell watermark-bull overflow-hidden px-6 py-10 md:px-8 md:py-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="slide-up relative z-10 space-y-7">
            <span className="signal">Aulas experimentais abertas</span>
            <div className="space-y-5">
              <h2 className="display-font text-6xl leading-[0.88] text-white md:text-8xl">
                BRAZILIAN <span className="text-accent">JIU-JITSU</span> PARA TODOS
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/72">
                Uma academia de Brazilian Jiu-Jitsu com método, hierarquia técnica e presença de equipe. O escudo vem
                primeiro: organização, pertencimento e confiança em cada treino.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/contato" className="btn-primary">
                Agendar aula experimental
              </Link>
              <a href="https://wa.me/5500000000000" className="btn-secondary">
                Falar com a equipe
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {["Metodologia clara", "Ambiente acolhedor", "Treino de alta consistencia"].map((item) => (
                <div key={item} className="glass-card px-4 py-4 text-sm font-semibold text-white/80">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in relative flex items-center justify-center lg:justify-end">
            <div className="absolute h-64 w-64 rounded-full bg-accent/18 blur-3xl md:h-80 md:w-80" />
            <div className="relative">
              <div className="hex-frame relative w-[300px] overflow-hidden border border-accent/35 bg-black p-3 shadow-[0_24px_70px_rgba(0,0,0,0.4)] md:w-[420px]">
                <div className="hex-frame relative aspect-square overflow-hidden border border-accent/20">
                  <Image
                    src="/shield-badge.jpeg"
                    alt="Escudo principal da Equipe Jiu"
                    fill
                    priority
                    sizes="(max-width: 768px) 300px, 420px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 w-[78%] -translate-x-1/2 rounded-full border border-accent/20 bg-black/80 px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.34em] text-accent">
                Badge principal da equipe
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="card px-5 py-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">{stat.label}</p>
            <p className="display-font mt-3 text-5xl text-white">{stat.val}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <article className="section-shell px-6 py-8 md:px-8">
          <p className="eyebrow">Agenda em destaque</p>
          <h3 className="display-font mt-3 text-4xl text-white md:text-5xl">Treinos por objetivo</h3>
          <div className="mt-6 overflow-x-auto">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Dias</th>
                  <th>Faixa</th>
                  <th>Horario</th>
                </tr>
              </thead>
              <tbody>
                {horarios.map((item, index) => (
                  <tr key={item.turma} className={index === 1 ? "bg-accent/5" : undefined}>
                    <td className="font-bold uppercase tracking-[0.12em]">{item.turma}</td>
                    <td className="text-white/65">{item.dias}</td>
                    <td>
                      <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                        {item.destaque}
                      </span>
                    </td>
                    <td className="font-black text-accent">{item.horario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="section-shell watermark-bull px-6 py-8 md:px-8">
          <p className="eyebrow">Conquistas recentes</p>
          <h3 className="display-font mt-3 text-4xl text-white md:text-5xl">Força coletiva</h3>
          <div className="mt-6 space-y-4">
            {conquistas.map((item) => (
              <div key={item} className="card flex items-start gap-3 px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_rgba(251,192,45,0.35)]" />
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/78">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://wa.me/5500000000000" className="btn-outline">
              Receber agenda completa
            </a>
            <Link href="/sobre" className="btn-ghost">
              Conhecer a equipe
            </Link>
          </div>
        </article>
      </section>

      <section className="section-shell px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Comunidade</p>
            <h3 className="display-font mt-3 text-4xl text-white md:text-5xl">O que dizem sobre o time</h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/60">
            A experiência precisa parecer forte, organizada e humana. Esses relatos mostram exatamente essa combinação.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {depoimentos.map((item) => (
            <blockquote key={item.nome} className="card px-5 py-6">
              <p className="text-5xl leading-none text-accent/28">“</p>
              <p className="-mt-2 text-sm leading-7 text-white/76">{item.texto}</p>
              <footer className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-accent">{item.nome}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
