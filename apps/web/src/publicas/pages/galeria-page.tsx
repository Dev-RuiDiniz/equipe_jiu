"use client";

import { useMemo, useState } from "react";
import { PublicShell } from "@/publicas/components/public-shell";

type Midia = {
  id: number;
  titulo: string;
  evento: "Treino" | "Campeonato";
  ano: "2024" | "2025" | "2026";
  destaque: string;
};

const itens: Midia[] = [
  { id: 1, titulo: "Raspagens em cadeia", evento: "Treino", ano: "2026", destaque: "Treino tecnico" },
  { id: 2, titulo: "Final estadual", evento: "Campeonato", ano: "2025", destaque: "Prata absoluto" },
  { id: 3, titulo: "Treino kids", evento: "Treino", ano: "2025", destaque: "Coordenacao e base" },
  { id: 4, titulo: "Open regional", evento: "Campeonato", ano: "2024", destaque: "Bronze master" },
  { id: 5, titulo: "Drills de passagem", evento: "Treino", ano: "2024", destaque: "Volume alto" },
  { id: 6, titulo: "Podio por equipes", evento: "Campeonato", ano: "2026", destaque: "Top 3 geral" },
];

const filtrosAno = ["Todos", "2024", "2025", "2026"] as const;
const filtrosEvento = ["Todos", "Treino", "Campeonato"] as const;

export function GaleriaPage() {
  const [ano, setAno] = useState<(typeof filtrosAno)[number]>("Todos");
  const [evento, setEvento] = useState<(typeof filtrosEvento)[number]>("Todos");
  const [ativo, setAtivo] = useState<Midia | null>(null);

  const filtrados = useMemo(() => {
    return itens.filter((item) => {
      const anoOk = ano === "Todos" || item.ano === ano;
      const eventoOk = evento === "Todos" || item.evento === evento;
      return anoOk && eventoOk;
    });
  }, [ano, evento]);

  return (
    <PublicShell eyebrow="Memoria da equipe" title="Treino, prova e resultado registrados com linguagem de marca.">
      <section className="section-shell px-6 py-8 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="eyebrow">Filtros</p>
            <h2 className="display-font mt-3 text-4xl text-white md:text-5xl">Galeria e resultados</h2>
          </div>
          <p className="text-sm leading-7 text-white/62">
            O grid prioriza leitura, contraste e presença do escudo, com overlay escuro e zoom controlado no hover.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Ano</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {filtrosAno.map((filtro) => (
                <button
                  type="button"
                  key={filtro}
                  onClick={() => setAno(filtro)}
                  className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${
                    ano === filtro
                      ? "border-accent/45 bg-accent/12 text-accent"
                      : "border-white/10 bg-white/5 text-white/68 hover:border-accent/22 hover:text-accent"
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Evento</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {filtrosEvento.map((filtro) => (
                <button
                  type="button"
                  key={filtro}
                  onClick={() => setEvento(filtro)}
                  className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${
                    evento === filtro
                      ? "border-secondary/50 bg-secondary/16 text-white"
                      : "border-white/10 bg-white/5 text-white/68 hover:border-secondary/24 hover:text-white"
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtrados.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setAtivo(item)}
            className="group section-shell overflow-hidden p-0 text-left"
          >
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/shield-badge.jpeg')] bg-cover bg-center opacity-20 transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[url('/bull-support.jpeg')] bg-cover bg-center opacity-[0.09] transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  {item.evento} • {item.ano}
                </p>
                <h3 className="display-font mt-3 text-3xl text-white">{item.titulo}</h3>
                <p className="mt-2 text-sm text-white/65">{item.destaque}</p>
              </div>
            </div>
          </button>
        ))}
      </section>

      {ativo ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/92 px-4"
        >
          <div className="section-shell w-full max-w-4xl px-6 py-6 md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Lightbox visual</p>
                <h3 className="display-font mt-2 text-4xl text-white">{ativo.titulo}</h3>
              </div>
              <button type="button" onClick={() => setAtivo(null)} className="btn-ghost">
                Fechar
              </button>
            </div>
            <div className="mt-6 overflow-hidden rounded-[28px] border border-accent/18 bg-black">
              <div className="h-[420px] bg-[url('/shield-badge.jpeg')] bg-cover bg-center opacity-35" />
            </div>
            <p className="mt-5 text-sm leading-7 text-white/70">
              {ativo.evento} • {ativo.ano} • {ativo.destaque}
            </p>
          </div>
        </div>
      ) : null}
    </PublicShell>
  );
}
