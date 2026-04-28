import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';

export type JwtPayload = {
  sub: string;
  email: string;
  papel: 'admin' | 'professor';
  tokenId?: string;
};

@Injectable()
export class AuthService {
  private readonly rateWindowMs = 60 * 1000;
  private readonly loginRateMap = new Map<string, { count: number; resetAt: number }>();
  private readonly recoveryRateMap = new Map<string, { count: number; resetAt: number }>();
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseDurationToMs(raw: string, fallbackMs: number): number {
    const value = raw.trim();
    const match = /^(\d+)(ms|s|m|h|d)?$/i.exec(value);
    if (!match) {
      return fallbackMs;
    }

    const amount = Number(match[1]);
    const unit = (match[2] ?? 'ms').toLowerCase();
    const unitMap: Record<string, number> = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return amount * (unitMap[unit] ?? 1);
  }

  private getRefreshTtlMs() {
    return this.parseDurationToMs(this.getRefreshTtl(), 7 * 24 * 60 * 60 * 1000);
  }

  private buildPayload(user: { id: string; email: string; papel: 'admin' | 'professor' }): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      papel: user.papel,
    };
  }

  private async signTokens(payload: JwtPayload, refreshTokenId: string) {
    const secret = this.getSecret();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: this.getAccessTtl() as never,
      }),
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: this.getRefreshTtl() as never,
        jwtid: refreshTokenId,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async issueSessionTokens(user: { id: string; email: string; papel: 'admin' | 'professor' }) {
    const refreshTokenId = randomUUID();
    const tokens = await this.signTokens(this.buildPayload(user), refreshTokenId);

    await this.prisma.refreshToken.create({
      data: {
        tokenId: refreshTokenId,
        usuarioId: user.id,
        expiresEm: new Date(Date.now() + this.getRefreshTtlMs()),
      },
    });

    return tokens;
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

    const tokens = await this.issueSessionTokens({ id: user.id, email: user.email, papel: user.papel });

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

    if (!payload.tokenId) {
      throw new UnauthorizedException('Sessao invalida');
    }

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenId: payload.tokenId },
      select: { tokenId: true, usuarioId: true, expiresEm: true, revogadoEm: true },
    });

    if (!tokenRecord || tokenRecord.revogadoEm || tokenRecord.expiresEm < new Date()) {
      throw new UnauthorizedException('Sessao invalida');
    }

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

    await this.prisma.refreshToken.update({
      where: { tokenId: tokenRecord.tokenId },
      data: { revogadoEm: new Date() },
    });
    const tokens = await this.issueSessionTokens({
      id: user.id,
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

  async revokeRefreshToken(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.getSecret(),
      });
    } catch {
      return;
    }

    if (!payload.tokenId) {
      return;
    }

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenId: payload.tokenId,
        revogadoEm: null,
      },
      data: {
        revogadoEm: new Date(),
      },
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      select: { id: true, ativo: true },
    });

    if (user?.ativo) {
      const token = randomBytes(24).toString('hex');
      await this.prisma.passwordResetToken.updateMany({
        where: {
          usuarioId: user.id,
          usadoEm: null,
          expiresEm: {
            gt: new Date(),
          },
        },
        data: {
          usadoEm: new Date(),
        },
      });

      await this.prisma.passwordResetToken.create({
        data: {
          usuarioId: user.id,
          tokenHash: this.hashToken(token),
          expiresEm: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
      await this.mailService.sendResetPasswordEmail(dto.email, token);
    }

    return {
      message: 'Se o e-mail existir, enviaremos instrucoes para redefinicao de senha.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token);
    const tokenData = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        usuarioId: true,
        expiresEm: true,
        usadoEm: true,
      },
    });

    if (!tokenData || tokenData.usadoEm || tokenData.expiresEm < new Date()) {
      throw new UnauthorizedException('Token de recuperacao invalido ou expirado');
    }

    const senhaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.$transaction([
      this.prisma.usuario.update({
        where: { id: tokenData.usuarioId },
        data: { senhaHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: tokenData.id },
        data: { usadoEm: new Date() },
      }),
    ]);

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
