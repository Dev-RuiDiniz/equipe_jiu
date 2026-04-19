import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { UpdateAlunoStatusDto } from './dto/update-aluno-status.dto';

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAlunoDto) {
    return this.prisma.aluno.create({
      data: {
        nome: dto.nome,
        cpf: dto.cpf,
        dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : undefined,
        faixa: dto.faixa,
        grau: dto.grau,
        telefone: dto.telefone,
        fotoUrl: dto.fotoUrl,
      },
    });
  }

  async findAll(query: { ativo?: string; faixa?: string; nome?: string }) {
    return this.prisma.aluno.findMany({
      where: {
        ativo: query.ativo !== undefined ? query.ativo === 'true' : undefined,
        faixa: query.faixa,
        nome: query.nome
          ? {
              contains: query.nome,
              mode: 'insensitive',
            }
          : undefined,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: {
        graduacoes: {
          orderBy: {
            dataGraduacao: 'desc',
          },
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    return aluno;
  }

  async update(id: string, dto: UpdateAlunoDto) {
    await this.findOne(id);

    return this.prisma.aluno.update({
      where: { id },
      data: {
        nome: dto.nome,
        cpf: dto.cpf,
        dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : undefined,
        faixa: dto.faixa,
        grau: dto.grau,
        telefone: dto.telefone,
        fotoUrl: dto.fotoUrl,
      },
    });
  }

  async updateStatus(id: string, dto: UpdateAlunoStatusDto) {
    await this.findOne(id);

    return this.prisma.aluno.update({
      where: { id },
      data: {
        ativo: dto.ativo,
      },
    });
  }
}
