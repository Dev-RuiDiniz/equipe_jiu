import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContatosService } from './contatos.service';
import { CreateContatoDto } from './dto/create-contato.dto';
import { MarcarContatoLidoDto } from './dto/marcar-contato-lido.dto';

@Controller('contatos')
export class ContatosController {
  constructor(private readonly contatosService: ContatosService) {}

  @Post()
  create(@Body() dto: CreateContatoDto) {
    return this.contatosService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'professor')
  findAll() {
    return this.contatosService.findAll();
  }

  @Patch(':id/lido')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'professor')
  marcarLido(@Param('id') id: string, @Body() dto: MarcarContatoLidoDto) {
    return this.contatosService.marcarLido(id, dto);
  }
}
