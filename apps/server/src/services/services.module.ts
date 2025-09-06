import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { SalonService } from '../salon/salon.service';
import { UserService } from '@/user/user.service';
import { PrivateWorkersService } from '../privateWorkers/privateWorkers.service';
import { NotificationService } from '@/notification/notification.service';
import { NotificationGateway } from '@/notification/notification.gateway';

@Module({
  imports: [],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    SalonService,
    UserService,
    PrivateWorkersService,
    NotificationService,
    NotificationGateway,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
