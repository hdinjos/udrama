import { Module } from '@nestjs/common';
import { DramasController } from './dramas.controller';

@Module({
  controllers: [DramasController]
})
export class DramasModule {}
