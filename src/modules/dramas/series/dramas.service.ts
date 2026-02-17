import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/core/database/drizzle.service';
import * as schema from 'src/core/database/schemas';

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

  findAll() {
    return this.db.query.series.findMany();
  }

  async findOne(id: string) {
    const series = await this.db.query.series.findFirst({
      where: (series, { eq }) => eq(series.id, parseInt(id)),
    });

    if (!series) {
      throw new NotFoundException(`series with id ${id} not found`);
    }

    return series;
  }

  async store(body: any) {
    const [reriesCreated] = await this.db
      .insert(schema.series)
      .values(body)
      .returning();

    return reriesCreated;
  }

  // update(body: DramaInfo, id: string) {
  //   const drama = this.idValidation(id);

  //   if (!drama) {
  //     return {
  //       message: `drama with id ${id} not found`,
  //       data: null,
  //     };
  //   }

  //   this.reqValidate(body);

  //   const dataUpdated = {
  //     ...drama,
  //     ...body,
  //   };

  //   this.dramas = this.dramas.map((item) => {
  //     if (item.id === parseInt(id)) {
  //       return {
  //         ...dataUpdated,
  //       };
  //     }

  //     return item;
  //   });

  //   return {
  //     message: 'update success',
  //     data: dataUpdated,
  //   };
  // }

  // private reqValidate(body: DramaInfo) {
  //   let datakeys: string[] = [];

  //   for (let key in body) {
  //     datakeys.push(key);
  //   }

  //   if (datakeys.length === 0) {
  //     datakeys = [];
  //     return {
  //       message: 'wrong input',
  //     };
  //   } else if (
  //     datakeys.length > 0 &&
  //     datakeys[0] !== 'title' &&
  //     datakeys[1] !== 'year'
  //   ) {
  //     datakeys = [];
  //     return {
  //       message: 'wrong input',
  //     };
  //   }
  //   datakeys = [];
  // }

  // private idValidation(id: string): any {
  //   return this.dramas.find((d) => d.id === parseInt(id));
  // }
}
