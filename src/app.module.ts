import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhookController } from './webhook/webhook.controller';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StripeModule,
    PaymentsModule,
    EmailModule,
  ],
  controllers: [WebhookController],
  providers: [],
})
export class AppModule {}
