import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export type JwtPayload = {
  sub: string;
  email: string;
  papel: 'admin' | 'professor';
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getAccessTtl() {
    return this.configService.get<string>('JWT_EXPIRES_IN', '15m');
  }

  private getRefreshTtl() {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
  }

  private getSecret() {
    return this.configService.get<string>('JWT_SECRET', 'change_me');
  }

  private buildPayload(user: { id: string; email: string; papel: 'admin' | 'professor' }): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      papel: user.papel,
    };
  }

  private async signTokens(payload: JwtPayload) {
    const secret = this.getSecret();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: this.getAccessTtl() as never,
      }),
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: this.getRefreshTtl() as never,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.ativo) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const senhaValida = await bcrypt.compare(dto.senha, user.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoLogin: new Date() },
    });

    const payload = this.buildPayload({ id: user.id, email: user.email, papel: user.papel });
    const tokens = await this.signTokens(payload);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        papel: user.papel,
      },
      ...tokens,
    };
  }

  async me(userId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
        ativo: true,
      },
    });

    if (!user || !user.ativo) {
      throw new UnauthorizedException('Sessao invalida');
    }

    return user;
  }
}
