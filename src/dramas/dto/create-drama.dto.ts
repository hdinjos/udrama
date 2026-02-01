import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateDramaSchema = z.object({
  title: z.string().min(1),
  year: z.number().min(1),
  category_id: z.number().optional(),
  description: z.string().optional(),
});

export class CreateDramaDto extends createZodDto(CreateDramaSchema) {}
