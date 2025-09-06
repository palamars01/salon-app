import { toJSON } from '@/mongo/common';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import utc from 'dayjs/plugin/utc';
dayjs.extend(minMax);
dayjs.extend(utc);

import { PublicSalon } from '@repo/shared/interfaces/salon';

// Methods
const toPublic = function (): PublicSalon {
  const salon = this._doc;

  delete salon.updatedAt;
  delete salon.admin;
  if (!salon.id) {
    salon.id = salon._id.toString();
  }
  salon._id && delete salon._id;
  delete salon.__v;
  return salon;
};

export const methods = {
  toPublic,
};
export const options = { toJSON };
export const middlewares = {};
