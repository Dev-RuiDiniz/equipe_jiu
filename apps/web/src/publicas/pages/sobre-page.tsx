import Image from "next/image";
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
    <PublicShell eyebrow="Institucional" title="O escudo representa ordem, hierarquia e comunidade.">
      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="section-shell watermark-shield px-6 py-8 md:px-8">
          <p className="eyebrow">Nossa historia</p>
          <h2 className="display-font mt-3 text-4xl text-white md:text-5xl">Do bairro para o circuito competitivo</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
            A Equipe Jiu nasceu para unir formação técnica séria, progressão clara e um senso de pertencimento visível
            em cada detalhe do ambiente. Aqui o time é maior do que o indivíduo, e isso começa pela cultura.
          </p>
          <div className="mt-8 grid gap-4">
            {marcos.map((marco) => (
              <div key={marco} className="card px-5 py-5 text-sm font-semibold uppercase tracking-[0.14em] text-white/78">
                {marco}
              </div>
            ))}
          </div>
        </article>

        <aside className="section-shell overflow-hidden px-6 py-8 md:px-8">
          <div className="relative h-64 overflow-hidden rounded-[28px] border border-accent/20">
            <Image src="/shield-badge.jpeg" alt="Escudo da equipe" fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
            <div className="absolute inset-0 bg-black/35" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { label: "Alunos", value: "120+" },
              { label: "Anos", value: "9" },
              { label: "Medalhas", value: "54" },
              { label: "Professores", value: "6" },
            ].map((item) => (
              <div key={item.label} className="card px-4 py-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">{item.label}</p>
                <p className="display-font mt-2 text-4xl text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {valores.map((valor) => (
          <article key={valor.titulo} className="section-shell px-5 py-6">
            <p className="eyebrow">Valor da equipe</p>
            <h3 className="display-font mt-3 text-3xl text-white">{valor.titulo}</h3>
            <p className="mt-4 text-sm leading-7 text-white/68">{valor.descricao}</p>
          </article>
        ))}
      </section>

      <section className="section-shell px-6 py-8 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Professores</p>
            <h2 className="display-font mt-3 text-4xl text-white md:text-5xl">Lideranca técnica da equipe</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/62">
            Cards inspirados no escudo para transmitir autoridade, organização e consistência visual.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {professores.map((professor) => (
            <article key={professor.nome} className="card overflow-hidden">
              <div className="relative h-48 bg-black">
                <Image src="/shield-badge.jpeg" alt="" fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-black/90" />
                <div className="absolute left-5 top-5 rounded-full border border-accent/30 bg-black/65 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-accent">
                  {professor.faixa}
                </div>
              </div>
              <div className="px-5 py-5">
                <h3 className="display-font text-3xl text-white">{professor.nome}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{professor.foco}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
