import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ConfigVars, TokenType } from '@/common/interfaces';

import { JwtPayload } from '@repo/shared/interfaces/jwt';
import { User } from '@/mongo/schemas/User/user.schema';

import { UserService } from '@/user/user.service';
import { AuthService } from '@/auth/auth.service';

import { BaseErrors } from '../constants';
import { throwHttpException, withMetadata } from './utils';
import { TOKEN_DECORATOR_KEY } from '../decorators/tokenType.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private userService: UserService,
    private authService: AuthService,
    private configService: ConfigService<typeof ConfigVars>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const getMetadata = withMetadata(this.reflector, context);

    const tokenType = getMetadata<TokenType>(TOKEN_DECORATOR_KEY)!;

    let currentUser: User | null = null;

    if (tokenType) {
      try {
        const token = this.extractToken(req, tokenType);

        if (!token) throw new Error();

        /* Jwt secrets fot an access or refresh tokens */
        const JWT_ACCESS_SECRET = this.configService.get('JWT_ACCESS_SECRET');
        const JWT_REFRESH_SECRET = this.configService.get('JWT_REFRESH_SECRET');

        const secret =
          tokenType === TokenType.BEARER
            ? JWT_ACCESS_SECRET
            : JWT_REFRESH_SECRET;

        /* Verify jwt token */
        const { id }: Pick<JwtPayload, 'id'> =
          await this.jwtService.verifyAsync(token, {
            secret,
          });
        if (!id) throw new Error();

        currentUser = await this.userService.findById(id);

        if (!currentUser?.id) throw new Error();

        /* Inject user to the request object */

        req['user'] = currentUser;

        return true;
      } catch (e) {
        if (
          ['jwt expired', 'invalid token'].includes(e.message) &&
          tokenType === TokenType.REFRESH
        ) {
          if (currentUser) await this.authService.logout();
          return throwHttpException(
            [BaseErrors.LOGOUT],
            HttpStatus.UNAUTHORIZED,
          );
        }
        return throwHttpException(
          [BaseErrors.UNAUTHORIZED],
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    return true;
  }

  private extractToken(req: Request, tokenType: TokenType) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return type === tokenType ? token : undefined;
  }
}
