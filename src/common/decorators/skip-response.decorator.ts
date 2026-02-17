import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE_KEY = 'skip_response';
export const SkipResponse = () => SetMetadata(SKIP_RESPONSE_KEY, true);
