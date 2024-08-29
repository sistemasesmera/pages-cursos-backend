import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);
  constructor(private configService: ConfigService) {
    // Obtener y loguear la clave secreta de Stripe
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    // Inicializar Stripe con la clave secreta
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(
    priceId: string,
    name: string,
    lastname: string,
    email: string,
    phone: string,
    comment: string,
    course: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        name,
        lastname,
        email,
        phone,
        comment,
        course,
      },
      mode: 'payment',
      success_url: `${this.configService.get<string>('BASE_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>('BASE_URL')}/${course}?session_id={CHECKOUT_SESSION_ID}`,
    });
  }

  async getCheckoutSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
}
