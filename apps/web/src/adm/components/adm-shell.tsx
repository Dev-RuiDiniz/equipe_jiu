type AdmShellProps = {
  title: string;
  children: React.ReactNode;
};

const menu = ["Dashboard", "Aulas", "Presencas", "Alunos", "Graduacoes"];

export function AdmShell({ title, children }: AdmShellProps) {
  return (
    <div className="min-h-screen bg-[#090d17] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px,1fr]">
        <aside className="border-b border-white/10 bg-[#11182b] p-6 md:border-b-0 md:border-r">
          <p className="display-font text-3xl text-white">ADM</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-300">Placeholder v1</p>

          <ul className="mt-8 space-y-2">
            {menu.map((item) => (
              <li key={item} className="card px-3 py-2 text-sm text-slate-300">
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <section className="p-6 md:p-10">
          <div className="section-shell p-6 md:p-8">
            <h1 className="display-font text-5xl leading-none text-white">{title}</h1>
            <div className="mt-6">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
