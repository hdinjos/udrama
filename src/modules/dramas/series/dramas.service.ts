import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DrizzleService } from 'src/core/database/drizzle.service';
import * as schema from 'src/core/database/schemas';
import { eq, and, ilike, count, sql, isNull } from 'drizzle-orm';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { GenreService } from '../genres/genres.service';
import { AssignGenreDto } from './dto/assign-genre.dto';
import { CreateEpisodeDto } from './dto/create-episode.dto';

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

 async findAll({
    page = 1,
    limit = 20,
    search,
    genreId,
    countryId,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    genreId?: number;
    countryId?: string;
  }) {
    const offset = (page - 1) * limit;

    const whereConditions = [isNull(schema.series.deletedAt)];

    if (search) {
      whereConditions.push(
        ilike(schema.series.primaryTitle, `%${search}%`),
      );
    }

    if (genreId) {
      const seriesWithGenre = await this.db
        .select({ seriesId: schema.series_genres.seriesId })
        .from(schema.series_genres)
        .where(eq(schema.series_genres.genreId, genreId));

      const seriesIds = seriesWithGenre.map((s) => s.seriesId);
      if (seriesIds.length > 0) {
        whereConditions.push(eq(schema.series.id, seriesIds[0]));
      } else {
        whereConditions.push(sql`1=0`);
      }
    }

    if (countryId) {
      whereConditions.push(eq(schema.series.countryId, countryId));
    }

    const [totalResult] = await this.db
      .select({ total: count() })
      .from(schema.series)
      .where(and(...whereConditions));

    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    const series = await this.db.query.series.findMany({
      where: and(...whereConditions),
      limit,
      offset,
      orderBy: schema.series.createdAt,
      with: {
        series_genres: {
          with: {
            genre: true,
          },
        },
      },
    });

    const result = series.map(({ series_genres, ...rest }) => ({
      ...rest,
      genre: series_genres.map((g) => ({
        id: g.genre.id,
        name: g.genre.name,
      })),
    }));

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
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
        episodes: true,
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
    const [created] = await this.db
      .insert(schema.series)
      .values({
        imdbId: body.imdb_id,
        type: body.type,
        primaryTitle: body.primary_title,
        originalTitle: body.original_title,
        plot: body.plot,
        startYear: body.start_year,
        endYear: body.end_year,
        rating: body.rating != null ? body.rating.toString() : undefined,
        voteCount: body.vote_count,
        countryId: body.country_id,
        thumbnailUrl: body.thumbnail_url,
      })
      .returning();

    return created;
  }

  async update(body: UpdateSeriesDto, id: number) {
    await this.findOne(id);

    const [updated] = await this.db
      .update(schema.series)
      .set({
        imdbId: body.imdb_id,
        type: body.type,
        primaryTitle: body.primary_title,
        originalTitle: body.original_title,
        plot: body.plot,
        startYear: body.start_year,
        endYear: body.end_year,
        rating: body.rating != null ? body.rating.toString() : undefined,
        voteCount: body.vote_count,
        countryId: body.country_id,
        thumbnailUrl: body.thumbnail_url,
      })
      .where(eq(schema.series.id, id))
      .returning();

    return updated;
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

  async storeEpisode(id: number, body: CreateEpisodeDto) {
    await this.findOne(id);

    const newBody = {
      imdbId: body.imdb_id,
      title: body.title,
      season: body.season,
      episodeNumber: body.episode_number,
      plot: body.plot,
      urlVideo: body.url_video,
      runtimeSeconds: body.runtime_seconds,
      releaseDate: body.release_date || undefined,
      seriesId: id,
    };

    const [storedEpisode] = await this.db
      .insert(schema.episodes)
      .values(newBody)
      .returning();
    return storedEpisode;
  }
}
