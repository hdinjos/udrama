import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/core/database/drizzle.service';
import * as schema from 'src/core/database/schemas';
import { eq } from 'drizzle-orm';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';

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

  async findOne(id: number) {
    const series = await this.db.query.series.findFirst({
      where: (series, { eq }) => eq(series.id, id),
    });

    if (!series) {
      throw new NotFoundException(`series with id ${id} not found`);
    }

    return series;
  }

  async store(body: CreateSeriesDto) {
    const [reriesCreated] = await this.db
      .insert(schema.series)
      .values(body)
      .returning();

    return reriesCreated;
  }

  async update(body: UpdateSeriesDto, id: number) {
    await this.findOne(id);

    const [updateSeries] = await this.db
      .update(schema.series)
      .set(body)
      .where(eq(schema.series.id, id))
      .returning();

    return updateSeries;
  }

  async destroy(id: number) {
    await this.findOne(id);

    const [deletedSeries] = await this.db
      .delete(schema.series)
      .where(eq(schema.series.id, id))
      .returning();

    return deletedSeries;
  }
}
