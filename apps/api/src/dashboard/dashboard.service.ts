import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getResumo() {
    const [alunosAtivos, proximasAulas, presencasSemana, graduacoesRecentes] = await Promise.all([
      this.prisma.aluno.count({ where: { ativo: true } }),
      this.prisma.aula.count({
        where: {
          cancelada: false,
          dataHora: {
            gte: new Date(),
          },
        },
      }),
      this.prisma.presenca.count({
        where: {
          confirmadoEm: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.graduacao.findMany({
        where: {
          dataGraduacao: {
            gte: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          alunoId: true,
        },
        distinct: ['alunoId'],
      }),
    ]);

    const presencaMediaSemana = alunosAtivos
      ? Number(Math.min((presencasSemana / alunosAtivos) * 100, 100).toFixed(2))
      : 0;

    const alertasGraduacao = Math.max(alunosAtivos - graduacoesRecentes.length, 0);

    return {
      alunosAtivos,
      presencaMediaSemana,
      proximasAulas,
      alertasGraduacao,
    };
  }

  async getFrequenciaMensal() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const registros = await this.prisma.presenca.findMany({
      where: {
        confirmadoEm: {
          gte: start,
        },
      },
      select: {
        confirmadoEm: true,
      },
      orderBy: {
        confirmadoEm: 'asc',
      },
    });

    const bucket = new Map<string, number>();

    for (let i = 0; i < 6; i += 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      bucket.set(key, 0);
    }

    registros.forEach((item) => {
      const d = item.confirmadoEm;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (bucket.has(key)) {
        bucket.set(key, (bucket.get(key) ?? 0) + 1);
      }
    });

    return Array.from(bucket.entries())
      .map(([mes, totalPresencas]) => ({ mes, totalPresencas }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  }
}
