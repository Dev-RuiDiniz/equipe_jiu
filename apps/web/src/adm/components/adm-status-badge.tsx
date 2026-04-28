type AdmStatusBadgeProps = {
  status: string;
};

const styleMap: Record<string, string> = {
  Agendada: "border-accent/35 bg-accent/10 text-accent",
  Confirmada: "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  Cancelada: "border-secondary/40 bg-secondary/14 text-rose-100",
  Presente: "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  Falta: "border-secondary/40 bg-secondary/14 text-rose-100",
  Atraso: "border-accent/35 bg-accent/10 text-accent",
  Ativo: "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  Inativo: "border-slate-400/30 bg-slate-500/10 text-slate-200",
  Lido: "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  Pendente: "border-accent/35 bg-accent/10 text-accent",
};

export function AdmStatusBadge({ status }: AdmStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styleMap[status] ?? "border-slate-300/30 bg-slate-300/10 text-slate-100"
      }`}
    >
      {status}
    </span>
  );
}
