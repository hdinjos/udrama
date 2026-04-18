import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DramaService } from './dramas.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { AssignGenreDto } from './dto/assign-genre.dto';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { ImdbService } from '../services/imdb.service';

@Controller('series')
export class DramasController {
  constructor(
    private readonly dramaService: DramaService,
    private readonly imdbService: ImdbService,
  ) {}

  @Get()
  async findAll(): Promise<any> {
    const results = await this.dramaService.findAll();
    return results.map((s) => {
      const { series_genres, ...rest } = s;
      return {
        ...rest,
        genre: series_genres.map((g) => ({ id: g.genre.id, name: g.genre.name })),
      };
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dramaService.findOne(id);
  }

  @Post()
  store(@Body() body: CreateSeriesDto): any {
    return this.dramaService.store(body);
  }

  @Put(':id')
  update(@Body() body: UpdateSeriesDto, @Param('id', ParseIntPipe) id: number) {
    return this.dramaService.update(body, id);
  }

  @Delete(':id')
  destroy(@Param('id', ParseIntPipe) id: number) {
    return this.dramaService.destroy(id);
  }

  @Post(':id/genre')
  storeGenre(
    @Body() body: AssignGenreDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.dramaService.attachGenre(id, body);
  }

  @Post(':id/episode')
  storeEpisode(
    @Body() body: CreateEpisodeDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.dramaService.storeEpisode(id, body);
  }

  @Post('sync-imdb')
  syncImdb() {
    return this.imdbService.syncAll();
  }
}
