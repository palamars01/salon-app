import { Module } from '@nestjs/common';

import { UserService } from '@/user/user.service';

import { PrivateWorkersService } from './privateWorkers.service';
import { PrivateWorkersController } from './privateWorkers.controller';
import { NotificationService } from '@/notification/notification.service';
import { NotificationGateway } from '@/notification/notification.gateway';

@Module({
  imports: [],
  controllers: [PrivateWorkersController],
  providers: [
    PrivateWorkersService,
    UserService,
    NotificationService,
    NotificationGateway,
  ],
  exports: [PrivateWorkersService],
})
export class PrivateWorkersModule {}
