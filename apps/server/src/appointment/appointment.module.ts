import { Module } from '@nestjs/common';

import { UserService } from '@/user/user.service';
import { SalonService } from '@/salon/salon.service';
import { PrivateWorkersService } from '@/privateWorkers/privateWorkers.service';
import { NotificationService } from '@/notification/notification.service';
import { NotificationGateway } from '@/notification/notification.gateway';

import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    SalonService,
    UserService,
    PrivateWorkersService,
    NotificationService,
    NotificationGateway,
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
