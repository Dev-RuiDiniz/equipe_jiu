import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateGraduacaoDto } from './dto/create-graduacao.dto';
import { GraduacoesService } from './graduacoes.service';

@Controller('graduacoes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'professor')
export class GraduacoesController {
  constructor(private readonly graduacoesService: GraduacoesService) {}

  @Post()
  create(@Body() dto: CreateGraduacaoDto) {
    return this.graduacoesService.create(dto);
  }

  @Get('aluno/:alunoId')
  historicoPorAluno(@Param('alunoId') alunoId: string) {
    return this.graduacoesService.historicoPorAluno(alunoId);
  }
}
