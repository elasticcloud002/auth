import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().integer(),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        user: configService.get<string>('MONGO_USER'),
        pass: configService.get<string>('MONGO_PASS'),
        dbName: configService.get<string>('MONGO_DB'),
      }),
    }),
    AuthModule,
    DashboardModule,
  ],
})
export class AppModule {}
