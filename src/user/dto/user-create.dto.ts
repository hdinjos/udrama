import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.email().max(50),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
