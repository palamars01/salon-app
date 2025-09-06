import { Model, Types, Document, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  AppointmentSchema,
  Appointment as AppointmentInterface,
} from '@repo/shared/interfaces/appointment';
import { AppointmentStatusEnum } from '@repo/shared/enums';

import { User } from '../User/user.schema';

import { methods } from './extensions';

@Schema({ timestamps: true })
export class Appointment extends Document implements AppointmentSchema {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    require: true,
    index: true,
    autopopulate: true,
  })
  customer: Types.ObjectId;

  @Prop({
    type: {
      id: String,
      name: String,
      address: String,
      city: String,
      adminId: String,
    },
    _id: false,
  })
  salon: {
    id: string;
    name: string;
    address: string;
    city: string;
    adminId: string;
  };

  @Prop({ type: Array })
  services: {
    id: string;
    duration: number;
    name: string;
  }[];

  @Prop({ enum: AppointmentStatusEnum })
  status: AppointmentStatusEnum;

  @Prop({ type: Date, required: false })
  arrivalTime: Date;

  @Prop({ type: Date, required: false })
  endTime: Date;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Number, required: false })
  queuePosition: number;

  @Prop({ type: String })
  privateWorkerId?: string;

  createdAt: Date;

  toPublic: () => AppointmentInterface;
}

export const appointmentSchema = SchemaFactory.createForClass(Appointment);
export type AppointmentModel = Model<
  Appointment,
  Document,
  { _id: Types.ObjectId }
>;
appointmentSchema.methods = methods;
