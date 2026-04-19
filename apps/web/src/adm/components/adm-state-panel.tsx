import type { ReactNode } from "react";

type AdmStatePanelProps = {
  tone?: "loading" | "error" | "empty";
  title: string;
  message: string;
  action?: ReactNode;
};

const toneStyles: Record<NonNullable<AdmStatePanelProps["tone"]>, string> = {
  loading: "border-slate-300/20 bg-white/5 text-slate-200",
  error: "border-rose-300/30 bg-rose-500/10 text-rose-100",
  empty: "border-orange-300/25 bg-orange-400/10 text-orange-100",
};

export function AdmStatePanel({ tone = "loading", title, message, action }: AdmStatePanelProps) {
  return (
    <article className={`card border p-5 ${toneStyles[tone]}`}>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </article>
  );
}
