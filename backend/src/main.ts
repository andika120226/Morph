import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan CORS terbuka untuk Next.js Web Admin & Flutter Mobile App
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 MORPH NestJS Backend running on: http://localhost:${port}`);
}

await bootstrap();
