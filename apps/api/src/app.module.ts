import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContatosModule } from './contatos/contatos.module';
import { AlunosModule } from './alunos/alunos.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, ContatosModule, AlunosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
