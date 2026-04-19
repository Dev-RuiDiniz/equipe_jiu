import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

export type JwtPayload = {
  sub: string;
  email: string;
  papel: 'admin' | 'professor';
};

@Injectable()
export class AuthService {
  private readonly rateWindowMs = 60 * 1000;
  private readonly loginRateMap = new Map<string, { count: number; resetAt: number }>();
  private readonly recoveryRateMap = new Map<string, { count: number; resetAt: number }>();
  private readonly resetTokens = new Map<string, { userId: string; expiresAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getRateKey(email: string, ip?: string) {
    return `${email.toLowerCase()}::${ip ?? 'unknown'}`;
  }

  private enforceRateLimit(
    store: Map<string, { count: number; resetAt: number }>,
    key: string,
    maxAttempts: number,
  ) {
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || existing.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + this.rateWindowMs });
      return;
    }

    if (existing.count >= maxAttempts) {
      throw new HttpException(
        'Muitas tentativas. Tente novamente em instantes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    existing.count += 1;
    store.set(key, existing);
  }

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

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: this.getSecret(),
    });

    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
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

    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
      papel: user.papel,
    });

    return {
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        papel: user.papel,
      },
      ...tokens,
    };
  }

  enforceLoginRateLimit(email: string, ip?: string) {
    this.enforceRateLimit(this.loginRateMap, this.getRateKey(email, ip), 5);
  }

  enforceRecoveryRateLimit(email: string, ip?: string) {
    this.enforceRateLimit(this.recoveryRateMap, this.getRateKey(email, ip), 3);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      select: { id: true, ativo: true },
    });

    if (user?.ativo) {
      const token = randomBytes(24).toString('hex');
      this.resetTokens.set(token, {
        userId: user.id,
        expiresAt: Date.now() + 15 * 60 * 1000,
      });
    }

    return {
      message: 'Se o e-mail existir, enviaremos instrucoes para redefinicao de senha.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenData = this.resetTokens.get(dto.token);

    if (!tokenData || tokenData.expiresAt < Date.now()) {
      throw new UnauthorizedException('Token de recuperacao invalido ou expirado');
    }

    const senhaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id: tokenData.userId },
      data: { senhaHash },
    });

    this.resetTokens.delete(dto.token);

    return {
      message: 'Senha atualizada com sucesso.',
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
