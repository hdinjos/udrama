import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';

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
  private dramas: Drama[] = [];

  @Get()
  findAll(): RetriveAllDramasResponse {
    return {
      message: 'retrieve all dramas',
      data: this.dramas,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): ApiResponse<Drama | null> {
    const drama = this.idValidation(id);

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

  @Post()
  store(@Body() body: DramaInfo) {
    this.reqValidate(body);
    const lastData = this.dramas.at(-1);

    const lastIndex = lastData?.id || 0;

    const payload: Drama = {
      id: lastIndex + 1,
      ...body,
    };
    this.dramas = [...this.dramas, payload];

    return {
      message: 'created drama success',
      data: payload,
    };
  }

  @Put(':id')
  update(@Body() body: DramaInfo, @Param('id') id: string) {
    const drama = this.idValidation(id);

    if (!drama) {
      return {
        message: `drama with id ${id} not found`,
        data: null,
      };
    }

    this.reqValidate(body);

    const dataUpdated = {
      ...drama,
      ...body,
    };

    this.dramas = this.dramas.map((item) => {
      if (item.id === parseInt(id)) {
        return {
          ...dataUpdated,
        };
      }

      return item;
    });
    return {
      message: 'update success',
      data: dataUpdated,
    };
  }

  private reqValidate(body: DramaInfo) {
    let datakeys: string[] = [];

    for (let key in body) {
      datakeys.push(key);
    }

    if (datakeys.length === 0) {
      datakeys = [];
      return {
        message: 'wrong input',
      };
    } else if (
      datakeys.length > 0 &&
      datakeys[0] !== 'title' &&
      datakeys[1] !== 'year'
    ) {
      datakeys = [];
      return {
        message: 'wrong input',
      };
    }
    datakeys = [];
  }

  private idValidation(id: string): any {
    return this.dramas.find((d) => d.id === parseInt(id));
  }
}
