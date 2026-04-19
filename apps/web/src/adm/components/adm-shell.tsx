"use client";

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
            {isLoading ? (
              <p className="mt-2 font-semibold text-slate-200">Validando sessao...</p>
            ) : user ? (
              <>
                <p className="mt-2 font-semibold text-emerald-200">Sessao ativa</p>
                <p className="mt-1 text-xs text-slate-300">{user.nome} • {user.papel}</p>
              </>
            ) : (
              <>
                <p className="mt-2 font-semibold text-orange-200">Sessao nao autenticada</p>
                <p className="mt-1 text-xs text-slate-300">Acesse com credenciais de professor ou admin.</p>
              </>
            )}
            {error ? <p className="mt-2 text-xs text-rose-200">{error}</p> : null}
            {!isLoginPage && user ? (
              <button type="button" onClick={() => void logout()} className="btn-outline mt-3 w-full text-xs">
                Sair da sessao
              </button>
            ) : null}
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

            <div className="mt-6">
              {requireAuth && (isLoading || !user) ? (
                <div className="card p-5 text-sm text-slate-300">
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
