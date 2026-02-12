import { Module } from '@nestjs/common';
import { DramasController } from './series/dramas.controller';
import { DramaService } from './series/dramas.service';
import { GenreController } from './genres/genres.controller';

@Module({
  controllers: [DramasController, GenreController],
  providers: [DramaService],
})
export class DramasModule {}
