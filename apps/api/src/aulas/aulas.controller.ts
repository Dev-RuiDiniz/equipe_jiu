import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AulasService } from './aulas.service';
import { CancelarAulaDto } from './dto/cancelar-aula.dto';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Controller('aulas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'professor')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  create(@Body() dto: CreateAulaDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateAulaDto) {
    return this.aulasService.update(id, dto);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string, @Body() _dto: CancelarAulaDto) {
    return this.aulasService.cancelar(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aulasService.remove(id);
  }
}
