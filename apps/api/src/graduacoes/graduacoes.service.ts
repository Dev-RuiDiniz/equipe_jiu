import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGraduacaoDto } from './dto/create-graduacao.dto';

@Injectable()
export class GraduacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGraduacaoDto) {
    return this.prisma.graduacao.create({
      data: {
        alunoId: dto.alunoId,
        faixa: dto.faixa,
        grau: dto.grau,
        dataGraduacao: new Date(dto.dataGraduacao),
        professorId: dto.professorId,
        observacao: dto.observacao,
      },
    });
  }

  async historicoPorAluno(alunoId: string) {
    return this.prisma.graduacao.findMany({
      where: { alunoId },
      include: {
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        dataGraduacao: 'desc',
      },
    });
  }
}
