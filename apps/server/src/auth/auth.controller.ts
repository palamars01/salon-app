import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { SignupDTO, SigninDTO } from './dto';
import { SignupValidationPipe } from './pipes/signupValidation.pipe';
import { SigninValidationPipe } from './pipes/signinValidation.pipe';

import { RejectDirectGoogleAuth } from '@/common/guards/googleAuth.guard';
import { SetTokenType } from '@/common/decorators/tokenType.decorator';
import googleAuthConfig from '@/common/config/googleAuth/google.auth.config';
import { TokenType } from '@/common/interfaces';

import { ApiRoutes } from '@repo/shared/enums';

import { User } from '@/mongo/schemas/User/user.schema';

@Controller(ApiRoutes.auth.base)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(googleAuthConfig.KEY)
    private googleAuthCfg: ConfigType<typeof googleAuthConfig>,
  ) {}

  // Signup
  @Post(ApiRoutes.auth.signup.path)
  @UseGuards(RejectDirectGoogleAuth)
  @UsePipes(new SignupValidationPipe())
  async signup(@Body() signupDto: SignupDTO) {
    return this.authService.signup(signupDto);
  }

  // Signin
  @Post(ApiRoutes.auth.signin.path)
  @UseGuards(RejectDirectGoogleAuth)
  @UsePipes(new SigninValidationPipe())
  async signin(@Body() signinDTO: SigninDTO) {
    return this.authService.signin(signinDTO);
  }

  //  Refresh tokens
  @Get(ApiRoutes.auth.refreshToken.path)
  @SetTokenType(TokenType.REFRESH)
  async refreshTokens(@Req() req: Request) {
    const user: User = req['user'];

    return this.authService.refreshTokens(user);
  }

  // Google Auth
  @Get(ApiRoutes.auth.google.path)
  async googleAuth(@Res() res: Response) {
    const { url } = await this.authService.googleAuth();
    return res.redirect(url);
  }

  // Handle Google Auth response
  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    const { user, jwtTokens } = await this.authService.handleGoogleAuth(code);

    const u = JSON.stringify([
      ['id', user.id],
      ['fName', user.fName],
      ['lName', user.lName],
      ['role', user.role],
    ]);
    const j = JSON.stringify([
      ['accessToken', jwtTokens.accessToken],
      ['refreshToken', jwtTokens.refreshToken],
    ]);

    let queryString = `?u=${u}&j=${j}`;

    if (user.role) queryString += `&role=${user.role}`;

    const redirectURL = this.googleAuthCfg.FRONTEND_CALLBACK_URL + queryString;

    res.redirect(redirectURL);
  }

  // Logout
  @Get(ApiRoutes.auth.logout.path)
  @SetTokenType(TokenType.BEARER)
  async logout() {
    // const user: User = req['user'];

    return this.authService.logout();
  }
}
