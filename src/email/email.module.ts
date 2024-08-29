// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module'; // Asegúrate de la ruta correcta
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
