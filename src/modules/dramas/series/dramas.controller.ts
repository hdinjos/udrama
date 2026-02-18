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

@Controller('series')
export class DramasController {
  constructor(private readonly dramaService: DramaService) {}

  @Get()
  findAll(): any {
    return this.dramaService.findAll();
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
}
