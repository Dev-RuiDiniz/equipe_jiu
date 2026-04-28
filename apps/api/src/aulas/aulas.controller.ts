import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AulasService } from './aulas.service';
import { CancelarAulaDto } from './dto/cancelar-aula.dto';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { AuditService } from '../common/audit/audit.service';

@Controller('aulas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'professor')
export class AulasController {
  constructor(
    private readonly aulasService: AulasService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  async create(@Body() dto: CreateAulaDto, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'CREATE',
      recurso: 'aula',
      detalhes: `titulo=${dto.titulo}`,
    });
    return this.aulasService.create(dto);
  }

  @Get()
  findAll(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('modalidade') modalidade?: string,
    @Query('cancelada') cancelada?: string,
  ) {
    return this.aulasService.findAll({ dataInicio, dataFim, modalidade, cancelada });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aulasService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAulaDto, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'UPDATE',
      recurso: 'aula',
      recursoId: id,
    });
    return this.aulasService.update(id, dto);
  }

  @Patch(':id/cancelar')
  async cancelar(@Param('id') id: string, @Body() _dto: CancelarAulaDto, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'CANCEL',
      recurso: 'aula',
      recursoId: id,
    });
    return this.aulasService.cancelar(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'DELETE',
      recurso: 'aula',
      recursoId: id,
    });
    return this.aulasService.remove(id);
  }
}
