import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type RegisterAuditInput = {
  usuarioId?: string | null;
  acao: string;
  recurso: string;
  recursoId?: string;
  detalhes?: string;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterAuditInput) {
    await (this.prisma as PrismaService & {
      auditLog: {
        create: (args: {
          data: {
            usuarioId: string | null;
            acao: string;
            recurso: string;
            recursoId?: string;
            detalhes?: string;
          };
        }) => Promise<unknown>;
      };
    }).auditLog.create({
      data: {
        usuarioId: input.usuarioId ?? null,
        acao: input.acao,
        recurso: input.recurso,
        recursoId: input.recursoId,
        detalhes: input.detalhes,
      },
    });
  }
}
