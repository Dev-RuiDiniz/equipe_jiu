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
  { id: 6, titulo: "Pódio por equipes", evento: "Campeonato", ano: "2026", destaque: "Top 3 geral" },
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
    <PublicShell eyebrow="Pagina Publica" title="Memoria de treino, prova e resultado.">
      <section className="section-shell p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Filtros</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">Galeria e resultados da equipe</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-300">Ano</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {filtrosAno.map((filtro) => (
                <button
                  type="button"
                  key={filtro}
                  onClick={() => setAno(filtro)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    ano === filtro
                      ? "border-orange-300 bg-orange-300/20 text-orange-100"
                      : "border-slate-600 bg-slate-900/60 text-slate-300 hover:border-slate-400"
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-300">Evento</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {filtrosEvento.map((filtro) => (
                <button
                  type="button"
                  key={filtro}
                  onClick={() => setEvento(filtro)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    evento === filtro
                      ? "border-emerald-300 bg-emerald-300/20 text-emerald-100"
                      : "border-slate-600 bg-slate-900/60 text-slate-300 hover:border-slate-400"
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {filtrados.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setAtivo(item)}
            className="section-shell overflow-hidden text-left transition hover:-translate-y-1"
          >
            <div className="h-44 bg-gradient-to-br from-[#253d64] via-[#1f1a33] to-[#203c34]" />
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-orange-200">
                {item.evento} • {item.ano}
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">{item.titulo}</h3>
              <p className="mt-1 text-sm text-slate-300">{item.destaque}</p>
            </div>
          </button>
        ))}
      </section>

      {ativo ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4"
        >
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#11192b] p-5 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.18em] text-orange-200">Lightbox visual</p>
              <button
                type="button"
                onClick={() => setAtivo(null)}
                className="rounded-full border border-slate-500 px-3 py-1 text-sm text-slate-200"
              >
                Fechar
              </button>
            </div>
            <div className="mt-4 h-72 rounded-2xl bg-gradient-to-br from-[#253d64] via-[#1f1a33] to-[#203c34]" />
            <h3 className="mt-5 text-3xl font-extrabold text-white">{ativo.titulo}</h3>
            <p className="mt-2 text-slate-300">
              {ativo.evento} • {ativo.ano} • {ativo.destaque}
            </p>
          </div>
        </div>
      ) : null}
    </PublicShell>
  );
}
