import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from 'src/core/database/drizzle.service';
import * as schema from 'src/core/database/schemas';
import { eq, inArray } from 'drizzle-orm';
import { generateSlug } from 'src/utils/helper';

// Genres dari API adalah string langsung, bukan object

interface ImdbRating {
  aggregateRating: number;
  voteCount: number;
}

interface ImdbImage {
  url: string;
  width: number;
  height: number;
}

interface ImdbTitle {
  id: string;
  type: string;
  primaryTitle: string;
  originalTitle: string;
  primaryImage: ImdbImage;
  startYear: number | null;
  endYear: number | null;
  runtimeSeconds: number | null;
  genres: string[];
  rating: ImdbRating;
  plot: string;
}

interface ImdbApiResponse {
  titles: ImdbTitle[];
  totalCount: number;
  nextPageToken: string | null;
}

@Injectable()
export class ImdbService {
  private readonly logger = new Logger(ImdbService.name);
  private readonly API_URL = 'https://api.imdbapi.dev/titles';

  constructor(private readonly drizzleService: DrizzleService) {}

  private get db() {
    return this.drizzleService.db;
  }

  async fetchTitles(pageToken?: string): Promise<ImdbApiResponse> {
    const params = new URLSearchParams({
      types: 'TV_SERIES',
      countryCodes: 'ID',
    });
    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const response = await fetch(`${this.API_URL}?${params}`);
    if (!response.ok) {
      throw new Error(
        `IMDB API error: ${response.status} ${response.statusText}`,
      );
    }
    return response.json();
  }

  async syncAll() {
    this.logger.log('Starting IMDB sync...');

    // Step 1: Fetch all titles (handle pagination)
    const allTitles: ImdbTitle[] = [];
    let pageToken: string | null | undefined;

    do {
      const result = await this.fetchTitles(pageToken || undefined);
      allTitles.push(...result.titles);
      pageToken = result.nextPageToken;
      this.logger.log(`Fetched ${allTitles.length} titles so far...`);
    } while (pageToken);

    this.logger.log(`Total titles fetched: ${allTitles.length}`);

    // Step 2: Extract unique genres
    const genreNames = new Set<string>();
    for (const title of allTitles) {
      for (const genre of title.genres ?? []) {
        if (genre) {
          genreNames.add(genre);
        }
      }
    }

    this.logger.log(`Unique genres found: ${genreNames.size}`);

    // Step 3: Upsert genres (insert only new ones)
    const existingGenres = await this.db.query.genres.findMany({
      columns: { name: true, id: true },
    });
    const existingGenreMap = new Map(existingGenres.map((g) => [g.name, g.id]));

    const newGenreNames = [...genreNames].filter(
      (n) => !existingGenreMap.has(n),
    );
    this.logger.log(`New genres to insert: ${newGenreNames.length}`);

    for (const name of newGenreNames) {
      const slug = generateSlug(name);
      await this.db.insert(schema.genres).values({ name, slug });
      const inserted = await this.db.query.genres.findFirst({
        where: eq(schema.genres.name, name),
        columns: { id: true },
      });
      if (inserted) {
        existingGenreMap.set(name, inserted.id);
      }
    }

    // Step 4: Upsert series
    const existingSeries = await this.db.query.series.findMany({
      columns: { imdbId: true, id: true },
    });
    const existingSeriesMap = new Map(
      existingSeries.map((s) => [s.imdbId, s.id]),
    );

    const newSeries = allTitles.filter((t) => !existingSeriesMap.has(t.id));
    const updatedSeries = allTitles.filter((t) => existingSeriesMap.has(t.id));

    this.logger.log(`New series to insert: ${newSeries.length}`);
    this.logger.log(`Existing series to update: ${updatedSeries.length}`);

    // Insert new series
    for (const title of newSeries) {
      const [series] = await this.db
        .insert(schema.series)
        .values({
          imdbId: title.id,
          type: title.type,
          primaryTitle: title.primaryTitle,
          originalTitle: title.originalTitle,
          plot: title.plot,
          startYear: title.startYear,
          endYear: title.endYear,
          rating: title.rating?.aggregateRating?.toString(),
          voteCount: title.rating?.voteCount,
          thumbnailUrl: title.primaryImage?.url,
        })
        .returning({ id: schema.series.id });

      if (series) {
        existingSeriesMap.set(title.id, series.id);
      }
    }

    // Update existing series
    for (const title of updatedSeries) {
      const seriesId = existingSeriesMap.get(title.id);
      if (seriesId) {
        await this.db
          .update(schema.series)
          .set({
            type: title.type,
            primaryTitle: title.primaryTitle,
            originalTitle: title.originalTitle,
            plot: title.plot,
            startYear: title.startYear,
            endYear: title.endYear,
            rating: title.rating?.aggregateRating?.toString(),
            voteCount: title.rating?.voteCount,
            thumbnailUrl: title.primaryImage?.url,
          })
          .where(eq(schema.series.id, seriesId));
      }
    }

    // Step 5: Link series-genres
    let linkedCount = 0;
    for (const title of allTitles) {
      const seriesId = existingSeriesMap.get(title.id);
      if (!seriesId) continue;

      const genreIds = (title.genres ?? [])
        .map((g) => existingGenreMap.get(g))
        .filter((id): id is number => id != null);

      if (genreIds.length === 0) continue;

      const existingLinks = await this.db.query.series_genres.findMany({
        where: eq(schema.series_genres.seriesId, seriesId),
        columns: { genreId: true },
      });
      const existingGenreIds = new Set(existingLinks.map((l) => l.genreId));

      const newGenreIds = genreIds.filter((id) => !existingGenreIds.has(id));

      if (newGenreIds.length > 0) {
        await this.db
          .insert(schema.series_genres)
          .values(newGenreIds.map((genreId) => ({ seriesId, genreId })));
        linkedCount += newGenreIds.length;
      }
    }

    this.logger.log(`Series-genre links created: ${linkedCount}`);
    this.logger.log('IMDB sync completed!');

    return {
      totalTitles: allTitles.length,
      newGenres: newGenreNames.length,
      newSeries: newSeries.length,
      updatedSeries: updatedSeries.length,
      linkedGenres: linkedCount,
    };
  }
}
