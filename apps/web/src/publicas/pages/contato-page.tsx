import Link from "next/link";
import { PublicShell } from "@/publicas/components/public-shell";
import { ContatoForm } from "@/publicas/components/contato-form";

const mapasrc =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d-46.63!3d-23.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768";

const canais = [
  { titulo: "WhatsApp", valor: "+55 (11) 90000-0000", detalhe: "Resposta em ate 1h" },
  { titulo: "Telefone", valor: "+55 (11) 3000-0000", detalhe: "Seg a Sex, 08h as 22h" },
  { titulo: "Endereco", valor: "Rua do Tatame, 123", detalhe: "Centro • Sao Paulo/SP" },
];

export function ContatoPage() {
  return (
    <PublicShell eyebrow="Pagina Publica" title="Comece seu treino com uma aula experimental.">
      <section className="grid gap-5 md:grid-cols-[1.1fr,0.9fr]">
        <article className="section-shell p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Formulario visual</p>
          <h2 className="mt-2 text-3xl font-extrabold text-white">Contato e inscricao</h2>
          <ContatoForm />
        </article>

        <aside className="space-y-5">
          <article className="section-shell p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Canais de atendimento</p>
            <ul className="mt-4 space-y-3">
              {canais.map((canal) => (
                <li key={canal.titulo} className="card p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{canal.titulo}</p>
                  <p className="mt-1 text-xl font-bold text-white">{canal.valor}</p>
                  <p className="mt-1 text-sm text-slate-300">{canal.detalhe}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="section-shell p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Horarios</p>
            <p className="mt-2 text-2xl font-bold text-white">Seg a Sex: 06h-22h</p>
            <p className="text-slate-300">Sabado: 08h-13h</p>
            <div className="mt-4 rounded-2xl border border-emerald-300/35 bg-emerald-300/10 p-4 text-emerald-100">
              Novos alunos recebem roteiro de inicio e aula experimental guiada.
            </div>
            <Link href="/modalidades" className="mt-4 inline-flex text-sm font-semibold text-orange-200 underline">
              Ver modalidades antes de agendar
            </Link>
          </article>
        </aside>
      </section>

      <section className="section-shell p-4 md:p-6">
        <p className="px-2 text-xs uppercase tracking-[0.18em] text-orange-300">Mapa (placeholder)</p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-700">
          <iframe
            title="Mapa da academia"
            src={mapasrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full md:h-96"
          />
        </div>
      </section>
    </PublicShell>
  );
}
