import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import {VercelRequest, VercelResponse} from "@vercel/node";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // middleware
  app.use(cookieParser());
  app.use(
    cors({
      origin: ['http://localhost:3001', 'https://demoecommerces.vercel.app'],
      credentials: true,
    }),
  );
  // app.setGlobalPrefix('/api/v1');
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3002;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
  return app;
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
  }catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).send('Internal Server Error');
  }
}
