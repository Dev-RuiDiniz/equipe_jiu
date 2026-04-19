import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContatosModule } from './contatos/contatos.module';
import { AlunosModule } from './alunos/alunos.module';
import { AulasModule } from './aulas/aulas.module';
import { PresencasModule } from './presencas/presencas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ContatosModule,
    AlunosModule,
    AulasModule,
    PresencasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
