import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginDramaSchema = z.object({
  email: z.email().max(25),
  password: z.string().min(5).max(10),
});

export class loginDramaDto extends createZodDto(loginDramaSchema) {}
