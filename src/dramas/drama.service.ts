import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';
import * as schema from '../database/schemas';
import { eq } from 'drizzle-orm';

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

@Injectable()
export class DramaService {
  private dramas: Drama[] = [];

  constructor(private readonly drizzleService: DrizzleService) {}

  private get db() {
    return this.drizzleService.db;
  }

  async findAll() {
    try {
      const data = await this.db.query.dramas.findFirst();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    return {
      message: 'retrieve all dramas',
      data: this.dramas,
    };
  }

  findOne(id: string): ApiResponse<Drama | null> {
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

  store(body: DramaInfo) {
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

  update(body: DramaInfo, id: string) {
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
