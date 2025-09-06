import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';

import { SignupDTO } from './dto/signup.dto';
import { SigninDTO } from './dto/signin.dto';

import { UserService } from '@/user/user.service';

import refreshConfig from '@/common/config/jwt/jwt.refresh.config';
import { throwHttpException } from '@/common/guards/utils';
import { BaseErrors } from '@/common/constants';

import { User } from '@/mongo/schemas/User/user.schema';

import { JwtTokens, JwtPayload } from '@repo/shared/interfaces/jwt';
import { PublicUser } from '@repo/shared/interfaces/user';
import { AuthProvidersEnum } from '@repo/shared/enums';

import { GoogleService } from '@/google/google.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private googleService: GoogleService,
    @Inject(refreshConfig.KEY)
    private jwtRefreshConfig: ConfigType<typeof refreshConfig>,
  ) {}

  // Signup
  async signup(
    signupDto: SignupDTO,
  ): Promise<{ user: PublicUser; jwtTokens: JwtTokens }> {
    // Check for existed user
    const existedUser = await this.userService.findByEmailOrPhone(
      signupDto.authValue,
    );

    if (!existedUser) {
      const user = await this.userService.create(signupDto);

      const jwtTokens = await this.generateTokens(user.createJwtPayload());

      const publicUser = user.toPublic();

      return { user: publicUser, jwtTokens };
    } else {
      throw new ConflictException({
        errors: [`${signupDto.authProvider} already exists`],
      });
    }
  }

  // Signin
  async signin(
    signinDTO: SigninDTO,
  ): Promise<{ user: PublicUser; jwtTokens: JwtTokens }> {
    const existedUser = await this.userService.findByEmailOrPhone(
      signinDTO.authValue,
    );

    try {
      if (!existedUser) {
        throwHttpException([BaseErrors.USER_NOT_FOUND], HttpStatus.FORBIDDEN);
      }

      if (!existedUser.password && !existedUser.tempPassword)
        throwHttpException(
          [BaseErrors.INVALID_CREDENTIALS],
          HttpStatus.FORBIDDEN,
        );

      const isPasswordMatch = existedUser.isPasswordMatch(signinDTO.password!);

      if (!isPasswordMatch) {
        throwHttpException(
          [BaseErrors.INVALID_CREDENTIALS],
          HttpStatus.FORBIDDEN,
        );
      }

      const jwtTokens = await this.generateTokens(
        existedUser.createJwtPayload(),
      );

      const publicUser = existedUser.toPublic();

      return { user: publicUser, jwtTokens };
    } catch (e: any) {
      if (!e.response && !e.status) {
        throwHttpException([BaseErrors.DEFAULT], HttpStatus.FORBIDDEN);
      } else {
        throwHttpException(
          [BaseErrors.INVALID_CREDENTIALS],
          HttpStatus.FORBIDDEN,
        );
      }

      throw new UnauthorizedException({ errors: [`Invalid credentials`] });
    }
  }

  // Generate jwt tokens
  async generateTokens(payload: JwtPayload): Promise<JwtTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload),
      await this.jwtService.signAsync(payload, this.jwtRefreshConfig),
    ]);

    return { accessToken, refreshToken };
  }

  //   Get new tokens
  async refreshTokens(user: User) {
    const jwtTokens = await this.generateTokens(user.createJwtPayload());

    return jwtTokens;
  }

  // Google Auth+
  async googleAuth(): Promise<{ url: string }> {
    return this.googleService.getOAuth2ClientUrl();
  }

  // Handle Google Auth response
  async handleGoogleAuth(code: string) {
    const { email, fName, lName } =
      await this.googleService.getAuthClientData(code);

    // Check is user exists
    const existedUser = await this.userService.findByEmailOrPhone(email);

    if (!existedUser) {
      return this.signup({
        authValue: email,
        authProvider: AuthProvidersEnum.GOOGLE,
        ...(fName && { fName }),
        ...(lName && { lName }),
      });
    } else {
      const jwtTokens = await this.generateTokens(
        existedUser.createJwtPayload(),
      );

      const publicUser = existedUser.toPublic();

      return { user: publicUser, jwtTokens };
    }
  }

  // Logout
  async logout() {
    return { message: 'OK' };
  }
}
