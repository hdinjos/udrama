import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const googleSignInSchema = z.object({
  credential: z.string().min(100).max(2048),
});

export class GoogleSignInDto extends createZodDto(googleSignInSchema) {}
