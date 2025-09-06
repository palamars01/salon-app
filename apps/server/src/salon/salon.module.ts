import { Module } from '@nestjs/common';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { UserService } from '@/user/user.service';
import { PrivateWorkersModule } from '../privateWorkers/privateWorkers.module';
import { ServicesModule } from '../services/services.module';
import { NotificationService } from '@/notification/notification.service';
import { NotificationModule } from '@/notification/notification.module';

@Module({
  imports: [PrivateWorkersModule, ServicesModule, NotificationModule],
  controllers: [SalonController],
  providers: [SalonService, UserService, NotificationService],
  exports: [SalonService],
})
export class SalonModule {}
