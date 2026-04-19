type AdmStatusBadgeProps = {
  status: string;
};

const styleMap: Record<string, string> = {
  Agendada: "border-sky-300/35 bg-sky-300/10 text-sky-200",
  Confirmada: "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  Cancelada: "border-orange-300/35 bg-orange-300/10 text-orange-200",
  Presente: "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  Falta: "border-rose-300/35 bg-rose-300/10 text-rose-200",
  Atraso: "border-amber-300/35 bg-amber-300/10 text-amber-200",
  Ativo: "border-emerald-300/35 bg-emerald-300/10 text-emerald-200",
  Inativo: "border-slate-400/30 bg-slate-500/10 text-slate-200",
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
