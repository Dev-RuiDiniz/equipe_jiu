import { AdmShell } from "@/adm/components/adm-shell";

export function AdmHomePage() {
  return (
    <AdmShell title="Painel Administrativo (Visual Placeholder)">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <h2 className="font-semibold">Login e sessao</h2>
          <p className="mt-2 text-sm text-slate-300">Em construcao para a proxima etapa.</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <h2 className="font-semibold">Dashboard de metricas</h2>
          <p className="mt-2 text-sm text-slate-300">Em construcao para a proxima etapa.</p>
        </article>
      </div>
    </AdmShell>
  );
}
