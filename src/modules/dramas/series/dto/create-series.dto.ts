import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateSeriesSchema = z.object({
  title: z.string().min(1),
  year: z.number().min(1),
  description: z.string().optional(),
  realease_date: z.date().optional(),
  country_id: z.number().optional(),
  thumbnail_url: z.string().optional(),
});

export class CreateSeriesDto extends createZodDto(CreateSeriesSchema) {}
