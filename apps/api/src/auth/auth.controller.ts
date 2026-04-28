import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuditService } from '../common/audit/audit.service';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditService: AuditService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.authService.enforceLoginRateLimit(dto.email, request.ip);
    const result = await this.authService.login(dto);
    await this.auditService.register({
      usuarioId: result.user.id,
      acao: 'LOGIN',
      recurso: 'auth',
      detalhes: `IP: ${request.ip ?? 'unknown'}`,
    });

    response.cookie('access_token', result.accessToken, {
      ...baseCookieOptions,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', result.refreshToken, {
      ...baseCookieOptions,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      usuario: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies?.refresh_token as string | undefined;
    if (!refreshToken) {
      return {
        message: 'Refresh token ausente.',
      };
    }

    const result = await this.authService.refresh(refreshToken);

    response.cookie('access_token', result.accessToken, {
      ...baseCookieOptions,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });
    response.cookie('refresh_token', result.refreshToken, {
      ...baseCookieOptions,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      usuario: result.usuario,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies?.refresh_token as string | undefined;

    if (refreshToken) {
      await this.authService.revokeRefreshToken(refreshToken);
    }

    const user = (request as Request & { user?: { id: string } }).user;
    await this.auditService.register({
      usuarioId: user?.id,
      acao: 'LOGOUT',
      recurso: 'auth',
    });

    response.clearCookie('access_token', {
      ...baseCookieOptions,
      secure: process.env.NODE_ENV === 'production',
    });
    response.clearCookie('refresh_token', {
      ...baseCookieOptions,
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      message: 'Sessao encerrada com sucesso.',
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() request: Request) {
    this.authService.enforceRecoveryRateLimit(dto.email, request.ip);
    await this.auditService.register({
      acao: 'FORGOT_PASSWORD_REQUEST',
      recurso: 'auth',
      detalhes: `email: ${dto.email}`,
    });
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.auditService.register({
      acao: 'RESET_PASSWORD',
      recurso: 'auth',
    });
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: Request) {
    const user = (request as Request & { user: { id: string } }).user;
    return this.authService.me(user.id);
  }
}
