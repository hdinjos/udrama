import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { DramaService } from './drama.service';

interface DramaInfo {
  title: string;
  year: number;
}
interface Drama extends DramaInfo {
  id: number;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

type RetriveAllDramasResponse = ApiResponse<Drama[]>;

@Controller('dramas')
export class DramasController {
  constructor(private readonly dramaService: DramaService) {}

  @Get()
  findAll(): any {
    return this.dramaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): ApiResponse<Drama | null> {
    return this.dramaService.findOne(id);
  }

  @Post()
  store(@Body() body: DramaInfo): ApiResponse<Drama | null> {
    return this.dramaService.store(body);
  }

  @Put(':id')
  update(
    @Body() body: DramaInfo,
    @Param('id') id: string,
  ): ApiResponse<Drama | null> {
    return this.dramaService.update(body, id);
  }
}
