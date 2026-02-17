import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DramaService } from './dramas.service';
import { CreateSeriesDto } from './dto/create-series.dto';

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

@Controller('series')
export class DramasController {
  constructor(private readonly dramaService: DramaService) {}

  @Get()
  findAll(): any {
    return this.dramaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dramaService.findOne(id);
  }

  // @Post()
  // store(@Body() body: CreateSeriesDto): any {
  //   return this.dramaService.store(body);
  // }

  // @Put(':id')
  // update(
  //   @Body() body: DramaInfo,
  //   @Param('id') id: string,
  // ): ApiResponse<Drama | null> {
  //   return this.dramaService.update(body, id);
  // }
}
