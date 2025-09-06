import { toJSON } from '@/mongo/common';
import { Notification } from '@repo/shared/interfaces/notification';

// Methods
const toPublic = function (): Notification {
  const notification = this._doc;

  delete notification.updatedAt;
  delete notification.salon.adminId;
  if (!notification.id) {
    notification.id = notification._id.toString();
  }
  notification._id && delete notification._id;
  delete notification.__v;

  return notification;
};

export const methods = {
  toPublic,
};

export const options = { toJSON };
