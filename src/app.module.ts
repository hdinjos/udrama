import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DramasModule } from './dramas/dramas.module';

@Module({
  imports: [DramasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
