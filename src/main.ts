import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/loggers/logger.config';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { SnakeCaseInterceptor } from 'src/common/interceptors/response-snakcase.interceptor';
import { MyZodValidationPipe } from './common/pipes/zod-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.useGlobalPipes(new MyZodValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new SnakeCaseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
