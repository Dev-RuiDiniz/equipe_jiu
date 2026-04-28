import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateGraduacaoDto } from './dto/create-graduacao.dto';
import { GraduacoesService } from './graduacoes.service';
import { AuditService } from '../common/audit/audit.service';

@Controller('graduacoes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'professor')
export class GraduacoesController {
  constructor(
    private readonly graduacoesService: GraduacoesService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  async create(@Body() dto: CreateGraduacaoDto, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'CREATE',
      recurso: 'graduacao',
      recursoId: dto.alunoId,
      detalhes: `faixa=${dto.faixa};grau=${dto.grau}`,
    });
    return this.graduacoesService.create(dto);
  }

  @Get('aluno/:alunoId')
  historicoPorAluno(@Param('alunoId') alunoId: string) {
    return this.graduacoesService.historicoPorAluno(alunoId);
  }
}
