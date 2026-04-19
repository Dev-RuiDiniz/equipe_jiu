import Link from "next/link";
import { AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";

export function AdmLoginPage() {
  return (
    <AdmShell
      title="Acesso Administrativo"
      subtitle="Interface visual de autenticacao para professores e administradores."
      actions={
        <>
          <button type="button" className="btn-outline">
            Suporte tecnico
          </button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr,0.9fr]">
        <article className="section-shell p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-orange-300">Entrar no painel</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Login de professores</h2>

          <form className="mt-5 grid gap-4" action="#" method="post">
            <AdmTextInput label="E-mail" type="email" name="email" placeholder="professor@equipejiu.com" />
            <AdmTextInput label="Senha" type="password" name="senha" placeholder="••••••••" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="size-4 rounded border-slate-500 bg-slate-800" />
                Manter sessao ativa neste navegador
              </label>
              <button type="button" className="text-sm font-semibold text-orange-200 underline">
                Esqueci minha senha
              </button>
            </div>

            <button type="submit" className="btn-primary">
              Entrar no painel
            </button>
          </form>
        </article>

        <aside className="space-y-5">
          <article className="section-shell p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Recuperacao de senha</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Receba link por e-mail</h3>
            <p className="mt-2 text-slate-300">
              Informe o e-mail cadastrado para receber orientacoes de redefinicao de senha.
            </p>
            <form className="mt-4 grid gap-3" action="#" method="post">
              <AdmTextInput label="E-mail de recuperacao" type="email" name="email_recuperacao" placeholder="professor@equipejiu.com" />
              <button type="submit" className="btn-outline">
                Enviar link de recuperacao
              </button>
            </form>
          </article>

          <article className="card p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Rotas da area</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/adm/dashboard" className="underline">
                  /adm/dashboard
                </Link>
              </li>
              <li>
                <Link href="/adm/aulas" className="underline">
                  /adm/aulas
                </Link>
              </li>
              <li>
                <Link href="/adm/presencas" className="underline">
                  /adm/presencas
                </Link>
              </li>
              <li>
                <Link href="/adm/alunos" className="underline">
                  /adm/alunos
                </Link>
              </li>
            </ul>
          </article>
        </aside>
      </div>
    </AdmShell>
  );
}
