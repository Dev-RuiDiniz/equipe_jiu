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
  "form-input";

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
    <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-white/84">
        Nome
        <input className={inputClass} type="text" name="nome" placeholder="Seu nome completo" required />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-white/84">
        E-mail
        <input className={inputClass} type="email" name="email" placeholder="voce@email.com" required />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-white/84">
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

      <label className="grid gap-2 text-sm font-semibold text-white/84">
        Mensagem
        <textarea
          className="form-input min-h-32"
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

      {success ? <p className="rounded-[18px] border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{success}</p> : null}
      {error ? <p className="rounded-[18px] border border-rose-300/40 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
    </form>
  );
}
