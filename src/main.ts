import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FakeAuthMiddleware } from './auth/fake-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist:true, forbidNonWhitelisted: true}));
  app.use(FakeAuthMiddleware); // apply the middleware

  await app.listen(3000);
}
bootstrap();
