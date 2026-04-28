import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContatosService } from './contatos.service';
import { CreateContatoDto } from './dto/create-contato.dto';
import { MarcarContatoLidoDto } from './dto/marcar-contato-lido.dto';
import { AuditService } from '../common/audit/audit.service';

@Controller('contatos')
export class ContatosController {
  constructor(
    private readonly contatosService: ContatosService,
    private readonly auditService: AuditService,
  ) {}

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
  async marcarLido(@Param('id') id: string, @Body() dto: MarcarContatoLidoDto, @Req() request: Request) {
    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'UPDATE_STATUS',
      recurso: 'contato',
      recursoId: id,
      detalhes: `lido=${dto.lido}`,
    });
    return this.contatosService.marcarLido(id, dto);
  }
}
