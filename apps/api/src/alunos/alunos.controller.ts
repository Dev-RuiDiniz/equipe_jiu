import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { UpdateAlunoStatusDto } from './dto/update-aluno-status.dto';

@Controller('alunos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'professor')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  create(@Body() dto: CreateAlunoDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateAlunoDto) {
    return this.alunosService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAlunoStatusDto) {
    return this.alunosService.updateStatus(id, dto);
  }
}
