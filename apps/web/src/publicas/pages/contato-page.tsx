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
    <PublicShell eyebrow="Contato" title="Entre no time com uma aula experimental guiada.">
      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <article className="section-shell px-6 py-8 md:px-8">
          <p className="eyebrow">Formulario visual</p>
          <h2 className="display-font mt-3 text-4xl text-white md:text-5xl">Inscricao e primeiro contato</h2>
          <ContatoForm />
        </article>

        <aside className="space-y-6">
          <article className="section-shell px-6 py-8 md:px-8">
            <p className="eyebrow">Canais de atendimento</p>
            <div className="mt-6 space-y-4">
              {canais.map((canal) => (
                <div key={canal.titulo} className="card px-5 py-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">{canal.titulo}</p>
                  <p className="mt-2 text-xl font-bold text-white">{canal.valor}</p>
                  <p className="mt-1 text-sm text-white/62">{canal.detalhe}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="section-shell watermark-bull px-6 py-8 md:px-8">
            <p className="eyebrow">Horarios</p>
            <p className="display-font mt-3 text-4xl text-white">Seg a Sex: 06h-22h</p>
            <p className="mt-2 text-white/68">Sabado: 08h-13h</p>
            <div className="mt-5 rounded-[22px] border border-secondary/22 bg-secondary/12 px-5 py-4 text-sm leading-7 text-white/85">
              Novos alunos recebem roteiro de inicio, apresentação da equipe e aula experimental guiada.
            </div>
            <Link href="/modalidades" className="btn-outline mt-5">
              Ver modalidades antes de agendar
            </Link>
          </article>
        </aside>
      </section>

      <section className="section-shell px-4 py-4 md:px-6 md:py-6">
        <p className="eyebrow px-2">Mapa</p>
        <div className="mt-4 overflow-hidden rounded-[28px] border border-accent/18">
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
