export type DashboardResumoResponse = {
  alunosAtivos: number;
  presencaMediaSemana: number;
  proximasAulas: number;
  alertasGraduacao: number;
};

export type DashboardFrequenciaItem = {
  mes: string;
  totalPresencas: number;
};

export type AulaApi = {
  id: string;
  titulo: string;
  descricao?: string | null;
  professorId: string;
  modalidade: string;
  dataHora: string;
  duracaoMin: number;
  vagas?: number | null;
  cancelada: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type AlunoApi = {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento?: string | null;
  faixa: string;
  grau: number;
  telefone?: string | null;
  fotoUrl?: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type PresencaApi = {
  id: string;
  aulaId: string;
  alunoId: string;
  confirmadoEm: string;
  observacao?: string | null;
};

export type PresencaPorAulaApi = PresencaApi & {
  aluno: AlunoApi;
};
