import Link from "next/link";

type PublicShellProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/modalidades", label: "Modalidades" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contato", label: "Contato" },
  { href: "/adm", label: "Adm" },
];

export function PublicShell({ title, eyebrow, children }: PublicShellProps) {
  return (
    <div className="site-grid min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090d17]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="display-font text-4xl leading-none text-white">Equipe Jiu</p>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Performance Team</p>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-semibold text-slate-200">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-orange-300/50 hover:bg-orange-300/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:py-14">
        <section className="section-shell p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="signal">Sessao Publica</span>
              {eyebrow ? (
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">{eyebrow}</p>
              ) : null}
              <h1 className="display-font text-5xl leading-none text-white md:text-7xl">{title}</h1>
            </div>
            <p className="max-w-md text-sm text-slate-300 md:text-base">
              Base visual em construcao com foco em contraste, hierarquia tipografica e leitura rapida.
            </p>
          </div>
        </section>

        {children}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-400">
        Equipe Jiu • Visual v1 (somente frontend)
      </footer>
    </div>
  );
}
