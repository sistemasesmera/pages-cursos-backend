import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import rawBodyMiddleware from './middlewares/raw-body.middleware';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev')); // Puedes cambiar 'dev' por otros formatos como 'combined', 'common', etc.
  app.use(rawBodyMiddleware());

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe());

  // Haiblitar Morgan
  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Reemplaza con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
