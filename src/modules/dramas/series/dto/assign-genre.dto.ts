import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AssignGenreSchema = z.object({
  genre_id: z.number().min(1),
  attach: z.boolean(),
});

export class AssignGenreDto extends createZodDto(AssignGenreSchema) {}
