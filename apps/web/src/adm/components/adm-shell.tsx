type AdmShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AdmShell({ title, children }: AdmShellProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px,1fr]">
        <aside className="border-b border-slate-700 bg-slate-800 p-6 md:border-b-0 md:border-r">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Area Adm</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            <li>Dashboard (placeholder)</li>
            <li>Aulas (placeholder)</li>
            <li>Presencas (placeholder)</li>
            <li>Alunos (placeholder)</li>
          </ul>
        </aside>
        <section className="p-6 md:p-10">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}
