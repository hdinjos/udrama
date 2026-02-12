import { Controller, Get } from '@nestjs/common';

@Controller('genres')
export class GenreController {
  @Get()
  index() {
    return { message: 'list of genres' };
  }
}
