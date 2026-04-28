"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdmMenuItem } from "@/adm/types";
import { useAdmSession } from "@/adm/hooks/use-adm-session";

type AdmShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  menuItems?: AdmMenuItem[];
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
};

const defaultMenu: AdmMenuItem[] = [
  { label: "Login", href: "/adm/login" },
  { label: "Dashboard", href: "/adm/dashboard" },
  { label: "Aulas", href: "/adm/aulas" },
  { label: "Presencas", href: "/adm/presencas" },
  { label: "Alunos", href: "/adm/alunos" },
  { label: "Contatos", href: "/adm/contatos" },
  { label: "Graduacoes", href: "/adm/graduacoes" },
];

export function AdmShell({
  title,
  subtitle,
  actions,
  children,
  menuItems = defaultMenu,
  requireAuth = true,
  redirectAuthenticatedTo,
}: AdmShellProps) {
  const pathname = usePathname();
  const { user, isLoading, error, logout } = useAdmSession({
    requireAuth,
    redirectAuthenticatedTo,
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isLoginPage = pathname.startsWith("/adm/login");

  return (
    <div className="min-h-screen bg-[#060606] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[320px,1fr]">
        <aside className="border-b border-accent/18 bg-black/96 p-5 xl:border-b-0 xl:border-r xl:p-7">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-[22px] border border-accent/30 bg-black/70 p-1">
              <Image src="/shield-badge.jpeg" alt="Escudo FS3" fill sizes="64px" className="rounded-[18px] object-cover" />
            </div>
            <div>
              <p className="display-font text-3xl text-white">FS3</p>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Painel administrativo</p>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-accent/16 bg-white/5 p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Navegacao</p>
            <nav className="mt-5 grid gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] transition ${
                    isActive(item.href)
                      ? "border-accent/42 bg-accent/12 text-accent"
                      : "border-white/10 bg-white/5 text-white/72 hover:border-accent/18 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-6 adm-card overflow-hidden px-5 py-5">
            <div className="relative mb-4 h-32 overflow-hidden rounded-[22px] border border-accent/16">
              <Image src="/shield-badge.jpeg" alt="" fill sizes="260px" className="object-cover opacity-24" />
              <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-black/85" />
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Status do ambiente</p>
            {isLoading ? (
              <p className="mt-3 text-sm font-semibold text-white/80">Validando sessao...</p>
            ) : user ? (
              <>
                <p className="mt-3 text-sm font-semibold text-emerald-200">Sessao ativa</p>
                <p className="mt-1 text-sm text-white/68">
                  {user.nome} • {user.papel}
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm font-semibold text-accent">Sessao nao autenticada</p>
                <p className="mt-1 text-sm text-white/62">Acesse com credenciais de professor ou admin.</p>
              </>
            )}
            {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
            {!isLoginPage && user ? (
              <button type="button" onClick={() => void logout()} className="btn-outline mt-5 w-full text-xs">
                Sair da sessao
              </button>
            ) : null}
          </div>
        </aside>

        <section className="px-4 py-5 md:px-6 xl:px-8 xl:py-8">
          <div className="section-shell overflow-hidden px-5 py-6 md:px-7 md:py-7">
            <header className="border-b border-accent/12 pb-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <span className="signal">Area restrita</span>
                  <h1 className="display-font mt-4 text-5xl leading-none text-white md:text-7xl">{title}</h1>
                  {subtitle ? <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 md:text-base">{subtitle}</p> : null}
                </div>
                {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
              </div>
            </header>

            <div className="mt-6">
              {requireAuth && (isLoading || !user) ? (
                <div className="adm-card px-5 py-5 text-sm text-white/70">
                  {isLoading ? "Carregando sessao administrativa..." : "Redirecionando para login..."}
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
