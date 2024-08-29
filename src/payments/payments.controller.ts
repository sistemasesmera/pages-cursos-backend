import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    const { priceId, name, lastname, email, phone, comment, course } =
      createCheckoutSessionDto;

    try {
      const session = await this.stripeService.createCheckoutSession(
        priceId,
        name,
        lastname,
        email,
        phone,
        comment,
        course,
      );
      // Devuelve la sessionId de checkout a la aplicación cliente
      return { sessionId: session.id };
    } catch (error) {
      // Maneja errores
      return { error: error.message };
    }
  }
  //Endpoint para extraer los metadatos de la sesion de checkout luego de realizar el pago.
  @Get('payment-success')
  async handlePaymentSuccess(@Query('session_id') sessionId: string) {
    try {
      // Usa el servicio de Stripe para recuperar la sesión

      const session = await this.stripeService.getCheckoutSession(sessionId);

      // Extrae los metadatos relevantes
      const { metadata } = session;

      // Devuelve los datos que necesitas para mostrar en el frontend
      return {
        name: metadata.name,
        email: metadata.email,
        phone: metadata.phone,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al recuperar la sesión de Stripe',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('validate-transaction')
  async validateTransaction(@Body('sessionId') sessionId: string) {
    try {
      // Verifica el estado del pago con Stripe
      const session = await this.stripeService.getCheckoutSession(sessionId);
      const isValid = session && session.status === 'complete';
      return { isValid };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error al validar la transacción con Stripe',
          isValid: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
