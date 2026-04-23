import type { KpiCard } from "@/adm/types";

type AdmKpiCardProps = {
  item: KpiCard;
};

const toneStyles: Record<NonNullable<KpiCard["tone"]>, string> = {
  up: "text-emerald-200 border-emerald-300/28 bg-emerald-300/10",
  neutral: "text-accent border-accent/30 bg-accent/10",
  alert: "text-rose-100 border-secondary/36 bg-secondary/16",
};

export function AdmKpiCard({ item }: AdmKpiCardProps) {
  const tone = item.tone ?? "neutral";

  return (
    <article className="adm-card px-5 py-5">
      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{item.label}</p>
      <p className="display-font mt-3 text-5xl text-white">{item.value}</p>
      <p className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
        {item.trend}
      </p>
    </article>
  );
}
