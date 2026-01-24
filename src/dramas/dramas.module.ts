import { Module } from '@nestjs/common';
import { DramasController } from './dramas.controller';
import { DramaService } from './drams.service';

@Module({
  controllers: [DramasController],
  providers: [DramaService],
})
export class DramasModule {}
