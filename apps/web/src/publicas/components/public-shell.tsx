"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <div className="site-grid min-h-screen bg-primary text-text">
      <header className="sticky top-0 z-50 border-b border-accent/20 bg-black/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-4" onClick={() => setMobileOpen(false)}>
            <div className="relative h-14 w-14 overflow-hidden rounded-[20px] border border-accent/35 bg-black/60 p-1 shadow-[0_10px_30px_rgba(251,192,45,0.12)]">
              <Image
                src="/shield-badge.jpeg"
                alt="Escudo da Equipe Jiu"
                fill
                sizes="56px"
                className="rounded-[16px] object-cover"
              />
            </div>
            <div>
              <p className="display-font text-3xl leading-none text-white">Equipe Jiu</p>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-accent/85">
                BJJ For All
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-3 text-xs font-extrabold uppercase tracking-[0.25em] transition ${
                  isActive(link.href)
                    ? "bg-accent/12 text-accent"
                    : "text-white/72 hover:bg-white/5 hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="https://wa.me/5500000000000" className="btn-outline hidden md:inline-flex">
              WhatsApp
            </a>
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/25 bg-white/5 text-accent md:hidden"
            >
              <span className="relative h-4 w-5">
                <span className="absolute left-0 top-0 h-0.5 w-5 bg-current" />
                <span className="absolute left-0 top-[7px] h-0.5 w-5 bg-current" />
                <span className="absolute left-0 top-[14px] h-0.5 w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-accent/15 bg-black/94 px-5 py-4 md:hidden">
            <nav className="grid gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] ${
                    isActive(link.href)
                      ? "border-accent/40 bg-accent/12 text-accent"
                      : "border-white/10 bg-white/5 text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a href="https://wa.me/5500000000000" className="btn-secondary mt-2">
                Agendar aula
              </a>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 md:gap-10 md:px-6 md:py-10">
        <section className="section-shell texture-panel watermark-shield px-6 py-8 md:px-8 md:py-10">
          <div className="max-w-3xl">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="display-font mt-3 text-5xl leading-[0.95] text-white md:text-7xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              Estrutura premium, método sólido e uma identidade de equipe construída para gerar confiança desde o
              primeiro contato.
            </p>
          </div>
        </section>

        {children}
      </main>

      <footer className="border-t border-accent/15 bg-black/88 px-5 py-10 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr,0.8fr,0.8fr] md:items-end">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-[22px] border border-accent/30 bg-black/70 p-1">
              <Image
                src="/shield-badge.jpeg"
                alt="Escudo Equipe Jiu"
                fill
                sizes="64px"
                className="rounded-[18px] object-cover"
              />
            </div>
            <div>
              <p className="display-font text-3xl text-white">Equipe Jiu</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-white/65">
                Comunidade, disciplina e performance para quem quer treinar Brazilian Jiu-Jitsu com estrutura de time.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">Navegação</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/70">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-accent">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">Contato direto</p>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              <p>Rua do Tatame, 123 • Sao Paulo/SP</p>
              <p>+55 (11) 90000-0000</p>
              <p>Seg a Sex • 06h as 22h</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
