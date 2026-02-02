import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ZodValidationPipe } from 'nestjs-zod';
// import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { MyZodValidationPipe } from './common/pipes/zod-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(new ZodValidationPipe());
  // app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalPipes(new MyZodValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
