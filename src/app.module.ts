import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

let envFilePath = 'envs/.env.dev';
if (process.env.NODE_ENV === 'staging') envFilePath = 'envs/.env.staging';
if (process.env.NODE_ENV === 'prod') envFilePath = 'envs/.env.prod';

const envValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('dev', 'staging', 'prod'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  // JWT_SECRET: Joi.string().required(),
});
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA_NAME,
      synchronize: process.env.NODE_ENVZ !== 'prod',
      logging: true,
      logger: new CustomDbLogger(),
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
