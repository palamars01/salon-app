import { Request } from 'express';
import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';

import { Roles } from '@/common/decorators/role.decorator';
import { SetTokenType } from '@/common/decorators/tokenType.decorator';
import { TokenType } from '@/common/interfaces';
import { User } from '@/mongo/schemas/User/user.schema';

import { NotificationService } from './notification.service';
import { ApiRoutes, RolesEnum } from '@repo/shared/enums';

@Controller(ApiRoutes.notifications.base)
@SetTokenType(TokenType.BEARER)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Get all
  @Get(ApiRoutes.notifications.getAll.path)
  @Roles(RolesEnum.salon, RolesEnum.customer, RolesEnum.privateWorker)
  async getAll(@Req() req: Request) {
    const user: User = req['user'];

    return this.notificationService.getAll(user);
  }

  // Get unread notifications
  @Get(ApiRoutes.notifications.getAllUnreadCount.path)
  @Roles(RolesEnum.salon, RolesEnum.customer, RolesEnum.privateWorker)
  async getAllUnreadCount(@Req() req: Request) {
    const user: User = req['user'];

    return this.notificationService.getAllUnreadCount(user);
  }

  // Update Notification
  @Put(ApiRoutes.notifications.update.path)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker, RolesEnum.customer)
  async update(
    @Req() req: Request,
    @Param('notificationId') notificationtId: string,
    @Body() notificationSource: Partial<Notification>,
  ) {
    const user: User = req['user'];
    return this.notificationService.update(
      user,
      notificationtId,
      notificationSource,
    );
  }
}
