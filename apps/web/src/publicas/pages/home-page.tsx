import { PublicShell } from "@/publicas/components/public-shell";

export function HomePage() {
  return (
    <PublicShell
      eyebrow="Dominio publicas"
      title="Home"
    >
      <p className="max-w-2xl text-slate-300">
        Estrutura de dominio criada. Esta pagina recebera o layout visual completo no proximo commit.
      </p>
    </PublicShell>
  );
}
