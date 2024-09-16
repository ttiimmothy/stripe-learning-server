import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

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
  app.setGlobalPrefix('/api/v1');
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3002;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
