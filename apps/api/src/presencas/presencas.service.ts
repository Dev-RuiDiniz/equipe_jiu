import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarPresencaDto } from './dto/registrar-presenca.dto';

@Injectable()
export class PresencasService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(dto: RegistrarPresencaDto) {
    if (!dto.presente) {
      await this.prisma.presenca.deleteMany({
        where: {
          aulaId: dto.aulaId,
          alunoId: dto.alunoId,
        },
      });

      return {
        aulaId: dto.aulaId,
        alunoId: dto.alunoId,
        presente: false,
      };
    }

    return this.prisma.presenca.upsert({
      where: {
        aulaId_alunoId: {
          aulaId: dto.aulaId,
          alunoId: dto.alunoId,
        },
      },
      create: {
        aulaId: dto.aulaId,
        alunoId: dto.alunoId,
        confirmadoEm: new Date(),
        observacao: dto.observacao,
      },
      update: {
        confirmadoEm: new Date(),
        observacao: dto.observacao,
      },
    });
  }

  async historicoPorAula(aulaId: string) {
    return this.prisma.presenca.findMany({
      where: { aulaId },
      include: {
        aluno: true,
      },
      orderBy: {
        confirmadoEm: 'desc',
      },
    });
  }

  async historicoPorAluno(alunoId: string) {
    return this.prisma.presenca.findMany({
      where: { alunoId },
      include: {
        aula: true,
      },
      orderBy: {
        confirmadoEm: 'desc',
      },
    });
  }

  async exportCsv(filters: { dataInicio?: string; dataFim?: string; modalidade?: string }) {
    const where: Prisma.PresencaWhereInput = {
      aula: {
        modalidade: filters.modalidade,
        dataHora: {
          gte: filters.dataInicio ? new Date(filters.dataInicio) : undefined,
          lte: filters.dataFim ? new Date(filters.dataFim) : undefined,
        },
      },
    };

    const itens = await this.prisma.presenca.findMany({
      where,
      include: {
        aula: true,
        aluno: true,
      },
      orderBy: {
        confirmadoEm: 'desc',
      },
    });

    if (itens.length === 0) {
      throw new NotFoundException('Nenhum registro encontrado para exportacao');
    }

    const header = ['aluno', 'aula', 'modalidade', 'data_hora', 'confirmado_em', 'observacao'];
    const rows = itens.map((item) => [
      item.aluno.nome,
      item.aula.titulo,
      item.aula.modalidade,
      item.aula.dataHora.toISOString(),
      item.confirmadoEm.toISOString(),
      item.observacao ?? '',
    ]);

    const csv = [header, ...rows]
      .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csv;
  }
}
