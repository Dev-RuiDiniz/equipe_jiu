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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <strong className="text-sm uppercase tracking-[0.2em] text-amber-400">
            Equipe Jiu
          </strong>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.18em] text-amber-300">{eyebrow}</p>
        ) : null}
        <h1 className="text-4xl font-semibold">{title}</h1>
        {children}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
        Placeholder estrutural de navegacao publica.
      </footer>
    </div>
  );
}
