// Options
export const toJSON = {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    if (ret._id) {
      ret.id = ret._id.toString();
      delete ret._id;
    }
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.password;

    return ret;
  },
};
