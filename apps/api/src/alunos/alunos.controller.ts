import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { UpdateAlunoStatusDto } from './dto/update-aluno-status.dto';
import { AuditService } from '../common/audit/audit.service';

@Controller('alunos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'professor')
export class AlunosController {
  constructor(
    private readonly alunosService: AlunosService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  async create(@Body() dto: CreateAlunoDto, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'CREATE',
      recurso: 'aluno',
      detalhes: `nome=${dto.nome}`,
    });
    return this.alunosService.create(dto);
  }

  @Get()
  findAll(@Query('ativo') ativo?: string, @Query('faixa') faixa?: string, @Query('nome') nome?: string) {
    return this.alunosService.findAll({ ativo, faixa, nome });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alunosService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAlunoDto, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'UPDATE',
      recurso: 'aluno',
      recursoId: id,
    });
    return this.alunosService.update(id, dto);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateAlunoStatusDto, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'UPDATE_STATUS',
      recurso: 'aluno',
      recursoId: id,
      detalhes: `ativo=${dto.ativo}`,
    });
    return this.alunosService.updateStatus(id, dto);
  }
}
