import { Controller, Get, Param } from '@nestjs/common';

interface Drama {
  id: number;
  title: string;
  year: number;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

type RetriveAllDramasResponse = ApiResponse<Drama[]>;

@Controller('dramas')
export class DramasController {
  @Get()
  findAll(): RetriveAllDramasResponse {
    return {
      message: 'retrieve all dramas',
      data: [
        { id: 1, title: 'Drama 1', year: 2025 },
        { id: 2, title: 'Drama 2', year: 2024 },
      ],
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): ApiResponse<Drama | null> {
    const drama = this.findAll().data.find((d) => d.id === parseInt(id));
    if (!drama) {
      return {
        message: `drama with id ${id} not found`,
        data: null,
      };
    }
    return {
      message: 'retrieve a drama by id',
      data: drama,
    };
  }
}
