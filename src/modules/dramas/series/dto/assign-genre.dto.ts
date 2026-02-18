import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AssignGenreSchema = z.object({
  genre_id: z.number().min(1),
});

export class AssignGenreDto extends createZodDto(AssignGenreSchema) {}
