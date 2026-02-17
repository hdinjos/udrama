import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { GenreService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  index() {
    return this.genreService.findAll();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.genreService.findOne(id);
  }

  @Post()
  store(@Body() body: CreateGenreDto) {
    return this.genreService.store(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateGenreDto) {
    return this.genreService.update(body, id);
  }

  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.genreService.destroy(id);
  }
}
