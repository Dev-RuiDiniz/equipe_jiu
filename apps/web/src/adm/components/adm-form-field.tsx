import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldWrapperProps = {
  label: string;
  children: ReactNode;
};

function FieldWrapper({ label, children }: FieldWrapperProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-white/82">
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
        className="form-input"
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
        className="form-input"
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
        className="form-input min-h-28"
      />
    </FieldWrapper>
  );
}
