import { Injectable } from '@nestjs/common';

import { NotificationStatusEnum, RolesEnum } from '@repo/shared/enums';
import { Appointment } from '@repo/shared/interfaces/appointment';
import {
  NotificationsType,
  NotificationSchema,
} from '@repo/shared/interfaces/notification';

import { User } from '@/mongo/schemas/User/user.schema';
import { getBaseNotification } from '@/mongo/schemas/Notification/utils';

import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationtModel,
} from '@/mongo/schemas/Notification/notification.schema';

import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: NotificationtModel,
    private readonly notificationsGateway: NotificationGateway,
  ) {}

  async create(
    appointment: Appointment,
    type: NotificationsType,
    role: RolesEnum,
  ): Promise<Notification> {
    const baseNotification = getBaseNotification(appointment, type, role);

    const notificationSource: NotificationSchema = {
      ...baseNotification,
      customer: {
        id: appointment.customer.id,
        fName: appointment.customer.fName!,
      },
      salon: {
        id: appointment.salon.id,
        name: appointment.salon.name,
        adminId: appointment.salon.adminId,
      },
      type,
      privateWorkerId: appointment.privateWorkerId,
      receiver: role === RolesEnum.customer ? 'customer' : 'salon',
      appointmentId: appointment.id,
    };

    const notification =
      await this.notificationModel.create(notificationSource);

    return notification;
  }

  async find(filters: any = {}) {
    return this.notificationModel.find(filters);
  }

  async getAllUnreadCount(user: User) {
    const { notifications } = await this.getAll(user, {
      status: NotificationStatusEnum.unread,
    });

    const initialNotificationsCount = notifications.length || null;

    return { initialNotificationsCount };
  }

  async getAll(user: User, initialFilters = {}) {
    const filters: any = {
      ...initialFilters,
      receiver: 'salon',
    };
    if (user.role === RolesEnum.customer) {
      filters.receiver = 'customer';
      filters['customer.id'] = user.id;
    }
    if (user.role === RolesEnum.salon) {
      filters['salon.adminId'] = user.id;
      filters.privateWorkerId = { $exists: false };
    }

    if (user.role === RolesEnum.privateWorker) {
      filters.privateWorkerId = user.privateWorkerId;
    }

    const notifications = await this.notificationModel
      .find(filters)
      .sort({ createdAt: -1 });

    return { notifications };
  }

  // Update Notification
  async update(
    user: User,
    notificationId: string,
    sourceNotification: Partial<Notification>,
  ) {
    const notification = await this.notificationModel.findOneAndUpdate(
      {
        _id: notificationId,
      },
      sourceNotification,
    );
    if (sourceNotification.status === NotificationStatusEnum.read) {
      this.notificationsGateway.emitNotificationRead(user.id);
    }
    return { notification: notification?.toPublic() };
  }
}
