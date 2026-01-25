import { Module } from '@nestjs/common';
import { DramasController } from './dramas.controller';
import { DramaService } from './dramas.service';

@Module({
  controllers: [DramasController],
  providers: [DramaService],
})
export class DramasModule {}
