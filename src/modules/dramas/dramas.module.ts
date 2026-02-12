import { Module } from '@nestjs/common';
import { DramasController } from './series/dramas.controller';
import { DramaService } from './series/dramas.service';
import { GenreController } from './genres/genres.controller';
import { GenreService } from './genres/genres.service';

@Module({
  controllers: [DramasController, GenreController],
  providers: [DramaService, GenreService],
})
export class DramasModule {}
