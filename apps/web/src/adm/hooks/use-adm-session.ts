"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdmSessionUser } from "@/adm/types";
import { ApiError, apiClient, extractApiErrorMessage } from "@/lib/api-client";

type UseAdmSessionOptions = {
  requireAuth?: boolean;
  redirectUnauthenticatedTo?: string;
  redirectAuthenticatedTo?: string;
};

type SessionResponse = {
  id: string;
  nome: string;
  email: string;
  papel: "admin" | "professor";
  ativo?: boolean;
};

export function useAdmSession(options: UseAdmSessionOptions = {}) {
  const { requireAuth = false, redirectUnauthenticatedTo = "/adm/login", redirectAuthenticatedTo } = options;
  const router = useRouter();
  const [user, setUser] = useState<AdmSessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await apiClient.get<SessionResponse>("auth/me");
      setUser(session);

      if (redirectAuthenticatedTo) {
        router.replace(redirectAuthenticatedTo);
      }
    } catch (requestError) {
      setUser(null);

      if (requestError instanceof ApiError && requestError.status === 401) {
        if (requireAuth) {
          router.replace(redirectUnauthenticatedTo);
        }
      } else {
        setError(extractApiErrorMessage(requestError, "Falha ao carregar sessao administrativa."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [redirectAuthenticatedTo, redirectUnauthenticatedTo, requireAuth, router]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post<{ message: string }>("auth/logout");
    } finally {
      setUser(null);
      router.replace("/adm/login");
    }
  }, [router]);

  return {
    user,
    isLoading,
    error,
    refreshSession: loadSession,
    logout,
  };
}
