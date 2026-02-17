import { Injectable, NotFoundException } from '@nestjs/common';
import { genres } from 'src/core/database/schemas';
import { DrizzleService } from 'src/core/database/drizzle.service';
import { eq } from 'drizzle-orm';
import { generateSlug } from 'src/utils/helper';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(private readonly drizzle: DrizzleService) {}

  private get db() {
    return this.drizzle.db;
  }

  async findAll() {
    return await this.db.query.genres.findMany();
  }

  async store(body: CreateGenreDto) {
    const slugName = generateSlug(body.name || '');
    const newBody = { ...body, slug: slugName };
    const [storeGenre] = await this.db
      .insert(genres)
      .values(newBody)
      .returning();
    return storeGenre;
  }

  async findOne(id: string) {
    const genre = await this.db.query.genres.findFirst({
      where: (field, { eq }) => eq(field.id, Number(id)),
    });
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

  async update(body: UpdateGenreDto, id: string) {
    const genre = await this.findOne(id);

    const newBody = {
      ...body,
      slug: generateSlug(body.name || genre.name),
    };

    const [updatedGenre] = await this.db
      .update(genres)
      .set(newBody)
      .where(eq(genres.id, Number(id)))
      .returning();

    return updatedGenre;
  }

  async destroy(id: string) {
    await this.findOne(id);

    const [deleteGenre] = await this.db
      .delete(genres)
      .where(eq(genres.id, Number(id)))
      .returning();

    return deleteGenre;
  }
}
