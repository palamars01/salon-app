import { Model, Types, Document, model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import {
  NotificationSchema,
  NotificationsType,
  Notification as NotificationsInterface,
} from '@repo/shared/interfaces/notification';
import { NotificationStatusEnum } from '@repo/shared/enums';

import { methods } from './extensions';

@Schema({ timestamps: true })
export class Notification extends Document implements NotificationSchema {
  @Prop({ type: String })
  title: string;

  @Prop({
    type: {
      id: String,
      name: String,
      adminId: String,
    },
    index: true,
    _id: false,
  })
  salon: {
    id: string;
    name: string;
    adminId?: string;
  };

  @Prop({
    type: {
      id: String,
      fName: String,
    },
    index: true,
    _id: false,
  })
  customer: {
    id: string;
    fName: string;
  };

  @Prop({ enum: NotificationsType })
  type: NotificationsType;

  @Prop({ enum: NotificationStatusEnum })
  status: NotificationStatusEnum;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  privateWorkerId?: string;

  @Prop({ type: String })
  appointmentId?: string;

  @Prop({ type: String })
  receiver: 'salon' | 'customer';

  toPublic: () => NotificationsInterface;
}

export const notificationSchema = SchemaFactory.createForClass(Notification);

export const notificationModel = model(Notification.name, notificationSchema);
export type NotificationtModel = Model<
  Notification,
  Document,
  { _id: Types.ObjectId }
>;

notificationSchema.methods = methods;

/* Normalize appointment */

notificationSchema.post('find', function (doc: any, next) {
  doc = doc.map(({ _doc }) => {
    /* Set time since creation */
    const timePassed = dayjs(dayjs().utc())
      .utc()
      .from(_doc.createdAt, true)
      .replace('an ', '');
    _doc.timePassed = timePassed + ' ago';
    _doc.id = _doc._id.toString();
    _doc.salon = { id: _doc.salon.id, name: _doc.salon.name };

    /* Delete fields */
    delete _doc._id;
    delete _doc.__v;
    delete _doc.updatedAt;

    return _doc;
  });

  next();
});
