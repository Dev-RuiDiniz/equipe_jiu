import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldWrapperProps = {
  label: string;
  children: ReactNode;
};

function FieldWrapper({ label, children }: FieldWrapperProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      {children}
    </label>
  );
}

export function AdmTextInput({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <FieldWrapper label={label}>
      <input
        {...props}
        className="rounded-xl border border-slate-600 bg-[#111a2b] px-3 py-2.5 text-slate-100 outline-none ring-orange-300/70 transition focus:ring"
      />
    </FieldWrapper>
  );
}

export function AdmSelectInput({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <FieldWrapper label={label}>
      <select
        {...props}
        className="rounded-xl border border-slate-600 bg-[#111a2b] px-3 py-2.5 text-slate-100 outline-none ring-orange-300/70 transition focus:ring"
      >
        {children}
      </select>
    </FieldWrapper>
  );
}

export function AdmTextArea({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <FieldWrapper label={label}>
      <textarea
        {...props}
        className="min-h-28 rounded-xl border border-slate-600 bg-[#111a2b] px-3 py-2.5 text-slate-100 outline-none ring-orange-300/70 transition focus:ring"
      />
    </FieldWrapper>
  );
}
