import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DrizzleService } from 'src/core/database/drizzle.service';
import * as schema from 'src/core/database/schemas';
import { eq, and } from 'drizzle-orm';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { GenreService } from '../genres/genres.service';
import { AssignGenreDto } from './dto/assign-genre.dto';

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

  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly genreService: GenreService,
  ) {}

  private get db() {
    return this.drizzleService.db;
  }

  findAll() {
    return this.db.query.series.findMany();
  }

  async findOne(id: number) {
    const series = await this.db.query.series.findFirst({
      where: (series, { eq }) => eq(series.id, id),
      with: {
        series_genres: {
          with: {
            genre: true,
          },
        },
      },
    });

    if (!series) {
      throw new NotFoundException(`series with id ${id} not found`);
    }

    const { series_genres, ...rest } = series;

    return {
      ...rest,
      genre: series_genres.map((g) => ({ id: g.genre.id, name: g.genre.name })),
    };
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

  async attachGenre(id: number, { genre_id, attach }: AssignGenreDto) {
    await this.findOne(id);
    await this.genreService.findOne(genre_id);
    try {
      if (attach) {
        return await this.db
          .insert(schema.series_genres)
          .values({
            seriesId: id,
            genreId: genre_id,
          })
          .returning();
      } else {
        return await this.db
          .delete(schema.series_genres)
          .where(
            and(
              eq(schema.series_genres.seriesId, id),
              eq(schema.series_genres.genreId, genre_id),
            ),
          )
          .returning();
      }
    } catch (err) {
      throw new ConflictException('Genre already exist');
    }
  }

  async;
}
