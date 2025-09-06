import {
  Document,
  HydratedDocument,
  model,
  Model,
  SchemaTypes,
  Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PublicSalon, SalonSchema } from '@repo/shared/interfaces/salon';

import { methods, options } from './extensions';

import { User } from '../User/user.schema';
import { Appointment } from '../Appointment/appointment.schema';

import {
  SalonServiceItem,
  salonServiceSchema,
} from '../SalonService/salonService.schema';
import { PrivateWorker } from '../PrivateWorker/privateWorker.schema';

export type SalonDocument = HydratedDocument<Salon>;

@Schema({ timestamps: true })
export class Salon extends Document implements SalonSchema {
  @Prop({ type: String })
  ownerName: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    require: true,
    index: true,
  })
  admin: Types.ObjectId;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  city: string;

  @Prop({
    required: false,
    type: [salonServiceSchema],
    default: [],
  })
  services: SalonServiceItem[];

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: PrivateWorker.name,
    require: true,
    default: [],
    autopopulate: true,
    index: true,
  })
  privateWorkers: Types.ObjectId[];

  @Prop({ type: Number })
  employees: number;

  @Prop({ type: Number, required: false, default: 5 })
  defaultWaitTimeInMinutes: number;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: Appointment.name,
    require: false,
    index: true,
    autopopulate: true,
    default: [],
  })
  appointments: [Types.ObjectId];

  @Prop({ type: Date })
  closestTimeToAppointment?: Date;

  @Prop({
    required: false,
    type: Object,
    default: { sms: false, push: false },
    _id: false,
  })
  notificationsSettings: {
    sms: boolean;
    push: boolean;
  };

  toPublic: () => PublicSalon;
}
export const salonSchema = SchemaFactory.createForClass(Salon);
export const salonModel = model(Salon.name, salonSchema);
export type SalonModel = Model<Salon, Document, { _id: Types.ObjectId }>;

salonSchema.set('toJSON', options.toJSON);

// Salon methods
salonSchema.methods = methods;
