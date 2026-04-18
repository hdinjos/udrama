import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateSeriesSchema = z.object({
  imdb_id: z.string().optional(),
  type: z.string().optional(),
  primary_title: z.string().min(1).optional(),
  original_title: z.string().optional(),
  plot: z.string().optional(),
  start_year: z.number().optional(),
  end_year: z.number().optional(),
  rating: z.number().optional(),
  vote_count: z.number().optional(),
  country_id: z.string().max(3).optional(),
  thumbnail_url: z.string().optional(),
});

export class UpdateSeriesDto extends createZodDto(UpdateSeriesSchema) {}
