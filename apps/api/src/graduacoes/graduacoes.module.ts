import { Module } from '@nestjs/common';
import { GraduacoesController } from './graduacoes.controller';
import { GraduacoesService } from './graduacoes.service';
import { AuditModule } from '../common/audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [GraduacoesController],
  providers: [GraduacoesService],
})
export class GraduacoesModule {}
