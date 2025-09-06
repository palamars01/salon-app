import { Module } from '@nestjs/common';
import { SalonService } from '../salon/salon.service';
import { UserService } from '@/user/user.service';
import { PrivateWorkersService } from '../privateWorkers/privateWorkers.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [
    NotificationGateway,
    NotificationService,
    SalonService,
    UserService,
    PrivateWorkersService,
  ],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
