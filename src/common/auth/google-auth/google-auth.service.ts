import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
}

@Injectable()
export class GoogleAuthService {
  constructor(private readonly configService: ConfigService) {}

  async verifyIdToken(idToken: string): Promise<GoogleTokenPayload> {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
    );

    if (!response.ok) {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const payload = (await response.json()) as GoogleTokenPayload;

    if (!payload.email_verified) {
      throw new UnauthorizedException('Google email not verified');
    }

    const allowedIssuers = [
      'https://accounts.google.com',
      'accounts.google.com',
    ];

    if (!allowedIssuers.includes(payload.iss)) {
      throw new UnauthorizedException('Invalid token issuer');
    }

    const clientId = this.configService.get<string>('google.clientId');
    if (clientId && payload.aud !== clientId) {
      throw new UnauthorizedException('Token intended for different client');
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      throw new UnauthorizedException('Google ID token expired');
    }

    return payload;
  }
}
