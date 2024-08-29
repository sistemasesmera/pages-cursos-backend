import {
  Controller,
  Post,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import axios from 'axios';

@Controller('webhooks')
export class WebhookController {
  private stripe: Stripe;
  private readonly logger = new Logger(WebhookController.name);
  private readonly googleSheetUrl =
    'https://script.google.com/macros/s/AKfycbxCjAsBvk4K6EMEHCTG_UAwqK1PZhLkAscLh54a4k554zot2_ulbuDHsPy2hiAXIbV59g/exec';

  constructor(
    private configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    let event;

    try {
      // Usar req.rawBody en lugar de req.body
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        endpointSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`);
      return { error: 'Webhook Error: ' + err.message };
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const course = session.metadata.course;

        // Datos que se enviarán al servicio de correo
        const dataToEmail = {
          name: session.metadata.name,
          email: session.metadata.email,
          lastname: session.metadata?.lastname,
        };

        // Datos para Google Sheets
        const dataToSheets = {
          curso: course,
          nombre: session.metadata.name,
          apellido: session.metadata.lastname || '',
          correo: session.metadata.email,
          telefono: session.metadata.phone || '',
          comentario: session.metadata.comment || '',
        };

        try {
          if (course === 'perfectgel') {
            await this.emailService.sendPaymentSuccessEmailPerfectGel(
              dataToEmail.email,
              dataToEmail.name,
              dataToEmail.lastname,
            );
          }

          if (course === 'propress') {
            await this.emailService.sendPaymentSuccessEmailPropress(
              dataToEmail.email,
              dataToEmail.name,
              dataToEmail.lastname,
            );
          }

          // TODO Enviar datos a Google Sheets
          // Enviar datos a Google Sheets
          try {
            await axios.post(this.googleSheetUrl, dataToSheets);
            this.logger.log('Datos enviados a Google Sheets');
          } catch (error) {
            this.logger.error('Error al enviar datos a Google Sheets', error);
          }
        } catch (error) {
          // Captura el error si el envío del correo electrónico falla
          this.logger.error('Error al enviar el correo de confirmación', error);
          // Continúa con el flujo del proceso incluso si el envío del correo falla
        }

        // TODO Enviar datos a Google Sheets
        //Logica aqui
        break;
      //tipogrAFIA
      //case 'checkout.session.expired':
      // const expiredSession = event.data.object as Stripe.Checkout.Session;
      //console.log('Pago expirado. manejar caso');
      //console.log(expiredSession);
      // Manejar la sesión expirada
      // break;

      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
        return { error: 'Unhandled event type' };
    }

    return { received: true };
  }
}
