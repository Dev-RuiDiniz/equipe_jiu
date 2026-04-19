import type { KpiCard } from "@/adm/types";

type AdmKpiCardProps = {
  item: KpiCard;
};

const toneStyles: Record<NonNullable<KpiCard["tone"]>, string> = {
  up: "text-emerald-200 border-emerald-300/35 bg-emerald-300/10",
  neutral: "text-sky-200 border-sky-300/35 bg-sky-300/10",
  alert: "text-orange-200 border-orange-300/35 bg-orange-300/10",
};

export function AdmKpiCard({ item }: AdmKpiCardProps) {
  const tone = item.tone ?? "neutral";

  return (
    <article className="card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
      <p className="mt-2 text-3xl font-extrabold text-white">{item.value}</p>
      <p className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
        {item.trend}
      </p>
    </article>
  );
}
