import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  private getSmtpConfig() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT', '587'));
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from = this.configService.get<string>('SMTP_FROM');

    if (!host || !user || !pass || !from) {
      return null;
    }

    return { host, port, user, pass, from };
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const smtp = this.getSmtpConfig();
    const webBaseUrl = this.configService.get<string>('WEB_BASE_URL', 'http://localhost:3000');
    const resetUrl = `${webBaseUrl}/adm/reset-password?token=${encodeURIComponent(token)}`;

    if (!smtp) {
      this.logger.warn(`SMTP nao configurado. Link de reset para ${email}: ${resetUrl}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: smtp.from,
      to: email,
      subject: 'Recuperacao de senha - Equipe Jiu',
      text: `Recebemos sua solicitacao. Redefina sua senha em: ${resetUrl}`,
      html: `<p>Recebemos sua solicitacao.</p><p>Redefina sua senha em: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }
}
