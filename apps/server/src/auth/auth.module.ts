import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import accessConfig from '@/common/config/jwt/jwt.access.config';
import refreshConfig from '@/common/config/jwt/jwt.refresh.config';
import googleAuthConfig from '@/common/config/googleAuth/google.auth.config';

import { UserService } from '@/user/user.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleService } from '@/google/google.service';

@Module({
  imports: [
    JwtModule.registerAsync(accessConfig.asProvider()),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleAuthConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, GoogleService],
  exports: [AuthService],
})
export class AuthModule {}
