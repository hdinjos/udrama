import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateGenreSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().optional(),
});

export class CreateGenreDto extends createZodDto(CreateGenreSchema) {}
