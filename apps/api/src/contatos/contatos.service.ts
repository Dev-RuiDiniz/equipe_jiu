import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContatoDto } from './dto/create-contato.dto';
import { MarcarContatoLidoDto } from './dto/marcar-contato-lido.dto';

@Injectable()
export class ContatosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContatoDto) {
    return this.prisma.contato.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        mensagem: dto.mensagem,
        interesse: dto.interesse,
      },
    });
  }

  async findAll() {
    return this.prisma.contato.findMany({
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async marcarLido(id: string, dto: MarcarContatoLidoDto) {
    return this.prisma.contato.update({
      where: { id },
      data: { lido: dto.lido },
    });
  }
}
