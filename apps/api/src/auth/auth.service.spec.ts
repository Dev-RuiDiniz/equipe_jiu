import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const configService = {
    get: (key: string, fallback?: string) => {
      if (key === 'JWT_SECRET') return 'secret';
      if (key === 'JWT_EXPIRES_IN') return '15m';
      if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
      return fallback;
    },
  };

  const jwtService = {
    signAsync: jest.fn().mockResolvedValue('token'),
    verifyAsync: jest.fn(),
  };

  const mailService = {
    sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
  };

  it('deve falhar login com senha invalida', async () => {
    const prisma = {
      usuario: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };

    const service = new AuthService(prisma as never, jwtService as never, configService as never, mailService as never);

    await expect(service.login({ email: 'admin@equipejiu.com', senha: 'errada' })).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('deve registrar token de recovery ao forgot password', async () => {
    const prisma = {
      usuario: { findUnique: jest.fn().mockResolvedValue({ id: 'u1', ativo: true }) },
      passwordResetToken: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({ id: 'r1' }),
      },
    };

    const service = new AuthService(prisma as never, jwtService as never, configService as never, mailService as never);

    await service.forgotPassword({ email: 'admin@equipejiu.com' });

    expect(prisma.passwordResetToken.create).toHaveBeenCalledTimes(1);
    expect(mailService.sendResetPasswordEmail).toHaveBeenCalledTimes(1);
  });
});
