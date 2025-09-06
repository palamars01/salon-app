import { Types, Document, SchemaTypes, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PrivateWorkerSchema } from '@repo/shared/interfaces/salon/privateWorker';

import { User } from '../User/user.schema';
import {
  SalonServiceItem,
  salonServiceSchema,
} from '../SalonService/salonService.schema';
import { Appointment } from '../Appointment/appointment.schema';

import { toJSON } from '@/mongo/common';

@Schema({ timestamps: true })
export class PrivateWorker extends Document implements PrivateWorkerSchema {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    require: true,
    index: true,
    autopopulate: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Salon',
    require: true,
    index: true,
  })
  salon: Types.ObjectId;

  @Prop({
    type: [salonServiceSchema],
    default: [],
  })
  services: SalonServiceItem[];

  @Prop({ type: Number, required: false, default: 5 })
  defaultWaitTimeInMinutes: number;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: Appointment.name,
    require: false,
    index: true,
    default: [],
    autopopulate: true,
  })
  appointments: Types.ObjectId[];

  @Prop({ type: Date })
  closestTimeToAppointment?: Date;
}

export const privateWorkerSchema = SchemaFactory.createForClass(PrivateWorker);

export type PrivateWorkerModel = Model<
  PrivateWorker,
  Document,
  { _id: Types.ObjectId }
>;

privateWorkerSchema.set('toJSON', toJSON);
