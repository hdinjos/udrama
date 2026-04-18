import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
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
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('genreId', new DefaultValuePipe(null), ParseIntPipe) genreId?: number,
    @Query('countryId') countryId?: string,
  ) {
    return this.dramaService.findAll({ page, limit, search, genreId, countryId });
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
