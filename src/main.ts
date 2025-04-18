import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({ origin: configService.get<string>('BASE_URL') });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
void bootstrap();
