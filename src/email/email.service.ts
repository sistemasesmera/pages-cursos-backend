import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = parseInt(this.configService.get<string>('SMTP_PORT'), 10);

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  private getTemplate(templateName: string): string {
    const templatePath = join(__dirname, 'templates', `${templateName}.hbs`);
    return readFileSync(templatePath, 'utf-8');
  }

  private generatePaymentSuccessPerfectGelTemplate(
    name: string,
    lastname?: string,
  ): string {
    const template = this.getTemplate('paymentSuccessPerfectGel');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate({ name, lastname });
  }
  private generatePaymentSuccessPropressTemplate(
    name: string,
    lastname?: string,
  ): string {
    const template = this.getTemplate('paymentSuccessPropress');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate({ name, lastname });
  }

  async sendPaymentSuccessEmailPerfectGel(
    to: string,
    name: string,
    lastname?: string, // Opcional
  ): Promise<void> {
    const html = this.generatePaymentSuccessPerfectGelTemplate(name, lastname);
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'Confirmacion de Compra - Curso de PerfectGel',
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado a: ${to}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }
  async sendPaymentSuccessEmailPropress(
    to: string,
    name: string,
    lastname?: string, // Opcional
    phone?: string, // Opcional
  ): Promise<void> {
    console.log(name, lastname, phone);
    const html = this.generatePaymentSuccessPropressTemplate(name, lastname);
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'Confirmacion de Compra - Curso de ProPress',
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado a: ${to}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }
}
