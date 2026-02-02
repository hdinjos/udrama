import { ZodError } from 'zod';

export function formatZodError(err: ZodError) {
  return {
    message: 'Validation Error',
    errors: err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    })),
  };
}
