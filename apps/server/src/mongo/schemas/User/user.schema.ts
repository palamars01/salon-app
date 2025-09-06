import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model } from 'mongoose';

import { JwtPayload } from '@repo/shared/interfaces/jwt';
import {
  AuthProvidersEnum,
  NotificationsType,
  RolesEnum,
} from '@repo/shared/enums';
import { PublicUser, UserSchema } from '@repo/shared/interfaces/user';

import { methods, middlewares, statics } from './extensions';

export type UserDocument = HydratedDocument<User>;

interface UserStatics {
  findByEmailOrPhone: <T>(value: string) => Promise<T & UserDocument>;
}

@Schema({ timestamps: true })
export class User extends Document implements UserSchema {
  @Prop({ required: false })
  fName: string;

  @Prop({ required: false })
  lName: string;

  @Prop({ enum: AuthProvidersEnum, required: true })
  authProvider: AuthProvidersEnum;

  @Prop({ unique: true, index: true })
  authValue: string;

  @Prop()
  password?: string;

  @Prop()
  tempPassword?: string;
  @Prop()
  privateWorkerId?: string;
  @Prop()
  phone?: string;

  @Prop({ enum: RolesEnum })
  role: RolesEnum;

  @Prop({
    required: false,
    type: Object,
    default: { sms: false, push: false, preferred: null },
  })
  notificationsSettings: {
    sms: boolean;
    push: boolean;
    preferred: NotificationsType;
  };

  isPasswordMatch: (password: string) => boolean;
  toPublic: () => PublicUser;
  createJwtPayload: () => JwtPayload;
}
export const userSchema = SchemaFactory.createForClass(User);
export type UserModel = Model<User> & UserStatics;

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
    ret.tempPassword = !!ret.tempPassword;
    delete ret.password;
  },
});

// Schema middlewares
userSchema.pre('save', middlewares.hashPassword);
userSchema.pre('save', middlewares.hashTempPassword);

// User methods
userSchema.methods = methods;
// User model static methods
userSchema.statics = statics;
