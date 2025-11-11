import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log('DEBUG: Token missing or improperly extracted.');
      throw new UnauthorizedException('Token missing.');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('DEBUG: Token verified successfully. Payload:', payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request['user'] = payload;
    } catch (error) {
      console.error(
        'FATAL DEBUG: JWT Verification Failed with error:',
        error.message,
      );
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // 1. Get the header value and trim any leading/trailing whitespace
    const authHeader = request.headers.authorization?.trim();

    if (!authHeader) {
      return undefined; // No header present
    }

    // 2. CRITICAL FIX: Use the regular expression /\s+/ to split by any whitespace (including non-breaking spaces)
    const parts = authHeader.split(/\s+/);

    // 3. Ensure the format is [Type, Token]
    if (parts.length !== 2) {
      return undefined;
    }

    const type = parts[0];
    const token = parts[1];

    // 4. Ensure the type is 'Bearer' (case-insensitive)
    if (type.toLowerCase() === 'bearer') {
      return token;
    }

    return undefined;
  }
}
