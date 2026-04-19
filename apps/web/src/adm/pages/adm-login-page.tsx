"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdmTextInput } from "@/adm/components/adm-form-field";
import { AdmShell } from "@/adm/components/adm-shell";
import type { AdmSessionUser } from "@/adm/types";
import { apiClient, extractApiErrorMessage } from "@/lib/api-client";

type LoginResponse = {
  usuario: AdmSessionUser;
};

type ForgotPasswordResponse = {
  message: string;
};

export function AdmLoginPage() {
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const senha = String(formData.get("senha") ?? "");

    try {
      await apiClient.post<LoginResponse>("auth/login", { email, senha });
      router.push("/adm/dashboard");
    } catch (requestError) {
      setLoginError(extractApiErrorMessage(requestError, "Nao foi possivel autenticar no momento."));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForgotFeedback(null);
    setForgotLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email_recuperacao") ?? "").trim();

    try {
      const response = await apiClient.post<ForgotPasswordResponse>("auth/forgot-password", { email });
      setForgotFeedback(response.message);
    } catch (requestError) {
      setForgotFeedback(extractApiErrorMessage(requestError, "Falha ao enviar solicitacao de recuperacao."));
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AdmShell
      title="Acesso Administrativo"
      subtitle="Autenticacao com sessao real via API para professores e administradores."
      requireAuth={false}
      redirectAuthenticatedTo="/adm/dashboard"
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

          <form className="mt-5 grid gap-4" onSubmit={(event) => void handleLogin(event)}>
            <AdmTextInput
              label="E-mail"
              type="email"
              name="email"
              placeholder="professor@equipejiu.com"
              autoComplete="email"
              required
            />
            <AdmTextInput
              label="Senha"
              type="password"
              name="senha"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="size-4 rounded border-slate-500 bg-slate-800" />
                Manter sessao ativa neste navegador
              </label>
              <button type="button" className="text-sm font-semibold text-orange-200 underline" disabled={forgotLoading}>
                Esqueci minha senha
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loginLoading}>
              {loginLoading ? "Entrando..." : "Entrar no painel"}
            </button>
            {loginError ? <p className="text-sm text-rose-200">{loginError}</p> : null}
          </form>
        </article>

        <aside className="space-y-5">
          <article className="section-shell p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Recuperacao de senha</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Receba link por e-mail</h3>
            <p className="mt-2 text-slate-300">
              Informe o e-mail cadastrado para receber orientacoes de redefinicao de senha.
            </p>
            <form className="mt-4 grid gap-3" onSubmit={(event) => void handleForgotPassword(event)}>
              <AdmTextInput
                label="E-mail de recuperacao"
                type="email"
                name="email_recuperacao"
                placeholder="professor@equipejiu.com"
                autoComplete="email"
                required
              />
              <button type="submit" className="btn-outline" disabled={forgotLoading}>
                {forgotLoading ? "Enviando..." : "Enviar link de recuperacao"}
              </button>
              {forgotFeedback ? <p className="text-sm text-slate-200">{forgotFeedback}</p> : null}
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
