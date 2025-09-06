import { createHash } from 'crypto';
import { CallbackWithoutResultAndOptionalError, Model } from 'mongoose';

import { toJSON } from '@/mongo/common';
import { User } from '@/mongo/schemas/User/user.schema';

import { JwtPayload } from '@repo/shared/interfaces/jwt';
import { PublicUser } from '@repo/shared/interfaces/user';

// Middlewares
const hashPassword = async function (
  next: CallbackWithoutResultAndOptionalError,
) {
  if (this.isModified('password')) {
    this.password = createHash('sha256').update(this.password).digest('base64');
  }
  next();
};
const hashTempPassword = async function (
  next: CallbackWithoutResultAndOptionalError,
) {
  if (this.isModified('tempPassword')) {
    if (!this.tempPassword) {
      this.tempPassword = null;
    } else {
      this.tempPassword = createHash('sha256')
        .update(this.tempPassword)
        .digest('base64');
    }
  }
  next();
};

// Methods
const isPasswordMatch = function (password: string): boolean {
  const user: User = this;

  const passwordHash = createHash('sha256').update(password).digest('base64');

  const currentPassword = user.password || user.tempPassword;

  return passwordHash === currentPassword;
};

const createJwtPayload = function () {
  const user: User = this;

  const payload: JwtPayload = {
    id: user.id,
    notificationsSettings: user.notificationsSettings,
  };

  if (user.role) payload.role = user.role;
  if (user.tempPassword) payload.tempPassword = !!user.tempPassword;
  if (user.privateWorkerId) payload.privateWorkerId = user.privateWorkerId;
  if (user.fName) payload.fName = user.fName;
  if (user.lName) payload.lName = user.lName;

  return payload;
};

const toPublic = function (): PublicUser {
  const user = this._doc;

  if (!user.id) {
    user.id = user._id.toString();
  }
  user._id && delete user._id;
  user.tempPassword = !!user.tempPassword;
  delete user.password;
  delete user.__v;

  return user;
};

// Static
const findByEmailOrPhone = async function <T>(value: string): Promise<T> {
  const model: typeof Model = this;
  const user = await model
    .findOne({
      authValue: value,
    })
    .select({ createdAt: 0, updatedAt: 0 });
  return user;
};

export const middlewares = { hashPassword, hashTempPassword };
export const methods = {
  isPasswordMatch,
  createJwtPayload,
  toPublic,
};
export const statics = { findByEmailOrPhone };
export const options = { toJSON };
