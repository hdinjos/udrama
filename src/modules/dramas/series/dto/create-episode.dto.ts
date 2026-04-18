import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateEpisodeSchema = z.object({
  imdb_id: z.string().optional(),
  title: z.string().optional(),
  season: z.string().optional(),
  episode_number: z.number().min(1),
  plot: z.string().optional(),
  url_video: z.string().optional(),
  runtime_seconds: z.number().optional(),
  release_date: z.string().optional(),
});

export class CreateEpisodeDto extends createZodDto(CreateEpisodeSchema) {}
