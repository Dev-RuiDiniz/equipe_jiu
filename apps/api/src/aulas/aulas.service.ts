import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAulaDto) {
    return this.prisma.aula.create({
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        professorId: dto.professorId,
        modalidade: dto.modalidade,
        dataHora: new Date(dto.dataHora),
        duracaoMin: dto.duracaoMin,
        vagas: dto.vagas,
      },
    });
  }

  async findAll(filters: {
    dataInicio?: string;
    dataFim?: string;
    modalidade?: string;
    cancelada?: string;
  }) {
    return this.prisma.aula.findMany({
      where: {
        modalidade: filters.modalidade,
        cancelada: filters.cancelada !== undefined ? filters.cancelada === 'true' : undefined,
        dataHora: {
          gte: filters.dataInicio ? new Date(filters.dataInicio) : undefined,
          lte: filters.dataFim ? new Date(filters.dataFim) : undefined,
        },
      },
      orderBy: {
        dataHora: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const aula = await this.prisma.aula.findUnique({ where: { id } });

    if (!aula) {
      throw new NotFoundException('Aula nao encontrada');
    }

    return aula;
  }

  async update(id: string, dto: UpdateAulaDto) {
    await this.findOne(id);

    return this.prisma.aula.update({
      where: { id },
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        professorId: dto.professorId,
        modalidade: dto.modalidade,
        dataHora: dto.dataHora ? new Date(dto.dataHora) : undefined,
        duracaoMin: dto.duracaoMin,
        vagas: dto.vagas,
      },
    });
  }

  async cancelar(id: string) {
    await this.findOne(id);

    return this.prisma.aula.update({
      where: { id },
      data: { cancelada: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.aula.delete({ where: { id } });
  }
}
