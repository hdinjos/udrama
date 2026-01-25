import { Module } from '@nestjs/common';
import { DramasController } from './dramas.controller';
import { DramaService } from './drama.service';

@Module({
  controllers: [DramasController],
  providers: [DramaService],
})
export class DramasModule {}
