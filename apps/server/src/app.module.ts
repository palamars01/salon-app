import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { SalonModule } from './salon/salon.module';
import { UserModule } from './user/user.module';
import { MongoModule } from './mongo/mongo.module';
import { AppointmentModule } from './appointment/appointment.module';

import { validateEnv } from './validations/config.validation';

import { JwtGuard } from './common/guards/jwt.guard';
import { RoleGuard } from './common/guards/role.guard';
import { ServicesModule } from './services/services.module';
import { PrivateWorkersModule } from './privateWorkers/privateWorkers.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv,
      isGlobal: true,
    }),
    MongoModule,
    JwtModule,
    AuthModule,
    ServicesModule,
    PrivateWorkersModule,
    UserModule,
    SalonModule,
    AppointmentModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
