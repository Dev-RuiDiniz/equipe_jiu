import { Body, Controller, Get, Header, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { RegistrarPresencaDto } from './dto/registrar-presenca.dto';
import { PresencasService } from './presencas.service';

@Controller('presencas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'professor')
export class PresencasController {
  constructor(private readonly presencasService: PresencasService) {}

  @Post()
  registrar(@Body() dto: RegistrarPresencaDto) {
    return this.presencasService.registrar(dto);
  }

  @Get('aula/:aulaId')
  historicoPorAula(@Param('aulaId') aulaId: string) {
    return this.presencasService.historicoPorAula(aulaId);
  }

  @Get('aluno/:alunoId')
  historicoPorAluno(@Param('alunoId') alunoId: string) {
    return this.presencasService.historicoPorAluno(alunoId);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportCsv(
    @Res({ passthrough: true }) response: Response,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('modalidade') modalidade?: string,
  ) {
    response.setHeader('Content-Disposition', 'attachment; filename="presencas.csv"');
    return this.presencasService.exportCsv({ dataInicio, dataFim, modalidade });
  }
}
