import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

import { ServiceSchema } from '@repo/shared/interfaces/salon/service';

@Schema({ timestamps: true, _id: false })
export class SalonServiceItem extends Document implements ServiceSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  estimatedDuration: number;

  @Prop({ type: Array })
  availability: string[];

  @Prop({ required: true })
  id: string;
}

export const salonServiceSchema =
  SchemaFactory.createForClass(SalonServiceItem);

export const SalonServiceModel = model('salons', salonServiceSchema);
