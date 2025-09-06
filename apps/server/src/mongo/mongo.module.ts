import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { NotificationGateway } from './../notification/notification.gateway';

import { Salon, SalonModel, salonSchema } from './schemas/Salon/salon.schema';
import { User, userSchema } from './schemas/User/user.schema';
import {
  Appointment,
  appointmentSchema,
} from './schemas/Appointment/appointment.schema';
import {
  PrivateWorker,
  privateWorkerSchema,
} from './schemas/PrivateWorker/privateWorker.schema';
import {
  Notification,
  notificationSchema,
} from './schemas/Notification/notification.schema';
import { handleQueueUpdate } from './schemas/Appointment/extensions';

import { UserService } from '@/user/user.service';
import { ConfigVars } from '@/common/interfaces';
import { NotificationService } from '@/notification/notification.service';
import { NotificationModule } from '@/notification/notification.module';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(ConfigVars.MONGO_URI),
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
      {
        name: Salon.name,
        schema: salonSchema,
      },
      {
        name: PrivateWorker.name,
        schema: privateWorkerSchema,
      },
      {
        name: Notification.name,
        schema: notificationSchema,
      },
    ]),

    MongooseModule.forFeatureAsync([
      {
        imports: [NotificationModule],
        inject: [
          getModelToken(Salon.name),
          NotificationService,
          NotificationGateway,
        ],
        name: Appointment.name,
        useFactory: async (
          salonModel: SalonModel,
          notificationService: NotificationService,
          notificationGateway: NotificationGateway,
        ) => {
          const schema = appointmentSchema;
          schema.pre(
            'findOneAndUpdate',
            handleQueueUpdate(
              salonModel,
              notificationService,
              notificationGateway,
            ),
          );
          schema.pre(
            'deleteOne',
            handleQueueUpdate(
              salonModel,
              notificationService,
              notificationGateway,
            ),
          );
          return schema;
        },
      },
    ]),
  ],

  providers: [NotificationGateway, NotificationService, UserService],

  exports: [MongooseModule],
})
export class MongoModule {}
