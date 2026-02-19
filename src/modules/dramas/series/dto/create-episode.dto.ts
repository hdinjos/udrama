import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateEpisodeSchema = z.object({
  episode_number: z.number().min(1),
  url_video: z.number().optional(),
  durations: z.number().optional(),
});

export class CreateEpisodeDto extends createZodDto(CreateEpisodeSchema) {}
