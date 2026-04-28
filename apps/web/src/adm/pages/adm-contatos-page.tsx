"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdmShell } from "@/adm/components/adm-shell";
import { AdmStatePanel } from "@/adm/components/adm-state-panel";
import { AdmStatusBadge } from "@/adm/components/adm-status-badge";
import { AdmTable } from "@/adm/components/adm-table";
import type { ContatoApi } from "@/adm/types/api";
import { apiClient, extractApiErrorMessage } from "@/lib/api-client";

export function AdmContatosPage() {
  const [contatos, setContatos] = useState<ContatoApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ContatoApi[]>("contatos");
      setContatos(response);
    } catch (requestError) {
      setError(extractApiErrorMessage(requestError, "Nao foi possivel carregar os contatos."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContatos();
  }, [loadContatos]);

  const marcarComoLido = useCallback(
    async (contato: ContatoApi) => {
      setIsMutating(true);
      setError(null);

      try {
        await apiClient.patch<ContatoApi>(`contatos/${contato.id}/lido`, { lido: !contato.lido });
        await loadContatos();
      } catch (requestError) {
        setError(extractApiErrorMessage(requestError, "Nao foi possivel atualizar o contato."));
      } finally {
        setIsMutating(false);
      }
    },
    [loadContatos],
  );

  const resumo = useMemo(() => {
    const lidos = contatos.filter((item) => item.lido).length;
    return {
      total: contatos.length,
      lidos,
      pendentes: contatos.length - lidos,
    };
  }, [contatos]);

  return (
    <AdmShell
      title="Contatos"
      subtitle="Triagem dos leads captados no formulario publico."
      actions={
        <button type="button" className="btn-outline" onClick={() => void loadContatos()}>
          Atualizar contatos
        </button>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="adm-card p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/45">Total</p>
          <p className="mt-1 text-2xl font-extrabold text-accent">{resumo.total}</p>
        </article>
        <article className="adm-card p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/45">Lidos</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-200">{resumo.lidos}</p>
        </article>
        <article className="adm-card p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/45">Pendentes</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-100">{resumo.pendentes}</p>
        </article>
      </section>

      <section className="mt-6 section-shell p-5 md:p-6">
        <p className="eyebrow">Fila de atendimento</p>
        <h2 className="display-font mt-3 text-3xl text-white">Mensagens recentes</h2>

        <div className="mt-5">
          {isLoading ? (
            <AdmStatePanel tone="loading" title="Carregando contatos" message="Buscando mensagens cadastradas." />
          ) : error ? (
            <AdmStatePanel
              tone="error"
              title="Falha ao carregar contatos"
              message={error}
              action={
                <button type="button" className="btn-outline" onClick={() => void loadContatos()}>
                  Tentar novamente
                </button>
              }
            />
          ) : contatos.length === 0 ? (
            <AdmStatePanel tone="empty" title="Nenhum contato" message="Ainda nao houve envios pelo formulario." />
          ) : (
            <AdmTable
              columns={[
                { key: "nome", label: "Nome" },
                { key: "email", label: "E-mail" },
                { key: "interesse", label: "Interesse" },
                { key: "mensagem", label: "Mensagem" },
                { key: "status", label: "Status" },
                { key: "acoes", label: "Acoes" },
              ]}
              rows={contatos.map((contato) => ({
                nome: <span className="font-semibold text-white">{contato.nome}</span>,
                email: contato.email,
                interesse: contato.interesse || "--",
                mensagem: <span className="line-clamp-2 max-w-xs">{contato.mensagem}</span>,
                status: <AdmStatusBadge status={contato.lido ? "Lido" : "Pendente"} />,
                acoes: (
                  <button
                    type="button"
                    className="rounded-full border border-accent/30 px-2.5 py-1 text-xs font-semibold text-accent disabled:opacity-50"
                    onClick={() => void marcarComoLido(contato)}
                    disabled={isMutating}
                  >
                    {contato.lido ? "Marcar pendente" : "Marcar lido"}
                  </button>
                ),
              }))}
            />
          )}
        </div>
      </section>
    </AdmShell>
  );
}
