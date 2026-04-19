"use client";

import { FormEvent, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';

type ContatoPayload = {
  nome: string;
  email: string;
  interesse?: string;
  mensagem: string;
};

const inputClass =
  'rounded-xl border border-slate-600 bg-[#111a2b] px-3 py-3 text-slate-100 outline-none ring-orange-300/70 transition focus:ring';

export function ContatoForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload: ContatoPayload = {
      nome: String(formData.get('nome') ?? ''),
      email: String(formData.get('email') ?? ''),
      interesse: String(formData.get('interesse') ?? ''),
      mensagem: String(formData.get('mensagem') ?? ''),
    };

    try {
      await apiClient.post('contatos', payload);
      setSuccess('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      event.currentTarget.reset();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Falha ao enviar (${err.status}). Tente novamente.`);
      } else {
        setError('Falha ao enviar mensagem. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Nome
        <input className={inputClass} type="text" name="nome" placeholder="Seu nome completo" required />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        E-mail
        <input className={inputClass} type="email" name="email" placeholder="voce@email.com" required />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Modalidade de interesse
        <select className={inputClass} name="interesse" defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          <option value="adulto">Adulto</option>
          <option value="kids">Kids</option>
          <option value="competicao">Competicao</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Mensagem
        <textarea
          className="min-h-32 rounded-xl border border-slate-600 bg-[#111a2b] px-3 py-3 text-slate-100 outline-none ring-orange-300/70 transition focus:ring"
          name="mensagem"
          placeholder="Conte seu objetivo no jiu-jitsu"
          required
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar mensagem'}
        </button>
        <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" className="btn-outline">
          Falar direto no WhatsApp
        </a>
      </div>

      {success ? <p className="rounded-xl border border-emerald-300/40 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">{success}</p> : null}
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
    </form>
  );
}
