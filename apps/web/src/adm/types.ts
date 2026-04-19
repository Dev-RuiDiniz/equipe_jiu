export type AdmMenuItem = {
  label: string;
  href: "/adm" | "/adm/login" | "/adm/dashboard" | "/adm/aulas" | "/adm/presencas" | "/adm/alunos";
};

export type AdmSessionUser = {
  id: string;
  nome: string;
  email: string;
  papel: "admin" | "professor";
  ativo?: boolean;
};

export type KpiCard = {
  label: string;
  value: string;
  trend: string;
  tone?: "up" | "neutral" | "alert";
};

export type AulaRow = {
  titulo: string;
  modalidade: string;
  dataHora: string;
  vagas: string;
  status: "Agendada" | "Confirmada" | "Cancelada";
};

export type PresencaRow = {
  aluno: string;
  aula: string;
  confirmadoEm: string;
  frequencia: string;
  status: "Presente" | "Falta" | "Atraso";
};

export type AlunoResumo = {
  nome: string;
  faixa: string;
  grau: string;
  frequencia: string;
  status: "Ativo" | "Inativo";
};
