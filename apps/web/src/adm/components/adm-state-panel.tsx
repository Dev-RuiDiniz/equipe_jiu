import type { ReactNode } from "react";

type AdmStatePanelProps = {
  tone?: "loading" | "error" | "empty";
  title: string;
  message: string;
  action?: ReactNode;
};

const toneStyles: Record<NonNullable<AdmStatePanelProps["tone"]>, string> = {
  loading: "border-accent/20 bg-white/5 text-white/82",
  error: "border-secondary/30 bg-secondary/14 text-rose-100",
  empty: "border-accent/24 bg-accent/10 text-accent",
};

export function AdmStatePanel({ tone = "loading", title, message, action }: AdmStatePanelProps) {
  return (
    <article className={`adm-card border px-5 py-5 ${toneStyles[tone]}`}>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </article>
  );
}
