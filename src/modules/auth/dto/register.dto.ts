import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email().max(50),
  password: z.string().min(5).max(50),
});

export class RegisterDto extends createZodDto(registerSchema) {}
