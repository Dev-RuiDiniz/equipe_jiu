"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdmMenuItem } from "@/adm/types";

type AdmShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  menuItems?: AdmMenuItem[];
};

const defaultMenu: AdmMenuItem[] = [
  { label: "Login", href: "/adm/login" },
  { label: "Dashboard", href: "/adm/dashboard" },
  { label: "Aulas", href: "/adm/aulas" },
  { label: "Presencas", href: "/adm/presencas" },
  { label: "Alunos", href: "/adm/alunos" },
];

export function AdmShell({ title, subtitle, actions, children, menuItems = defaultMenu }: AdmShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[#090d17] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px,1fr]">
        <aside className="border-b border-white/10 bg-[#0e1526] p-5 md:border-b-0 md:border-r md:p-6">
          <div>
            <p className="display-font text-4xl leading-none text-white">Equipe Jiu</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-300">Painel administrativo</p>
          </div>

          <nav className="mt-7 grid grid-cols-2 gap-2 md:grid-cols-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  isActive(item.href)
                    ? "border-orange-300/60 bg-orange-300/14 text-orange-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 card p-4 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Status do ambiente</p>
            <p className="mt-2 font-semibold text-emerald-200">Modo visual ativo</p>
            <p className="mt-1">Sem conexao com API nesta fase.</p>
          </div>
        </aside>

        <section className="p-4 md:p-8">
          <div className="section-shell p-5 md:p-7">
            <header className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="signal">Area restrita</span>
                <h1 className="display-font mt-3 text-4xl leading-none text-white md:text-6xl">{title}</h1>
                {subtitle ? <p className="mt-2 max-w-2xl text-slate-300">{subtitle}</p> : null}
              </div>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </header>

            <div className="mt-6">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
