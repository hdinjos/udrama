import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ZodValidationPipe } from 'nestjs-zod';
// import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { MyZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/loggers/logger.config';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // app.useGlobalPipes(new ZodValidationPipe());
  // app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalPipes(new MyZodValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
