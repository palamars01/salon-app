export const baseExcludedFileds = {
  password: 0,
  createdAt: 0,
  updatedAt: 0,
};

export enum BaseErrors {
  UNAUTHORIZED = "You aren't authorized for the request",
  USER_NOT_FOUND = 'User not found',
  LOGOUT = 'logout',
  SERVICE_EXISTS = 'Service already exists',
  INVALID_CREDENTIALS = 'Invalid credentials',
  DEFAULT = 'Server error. Try again later',
  BAD_REQUEST = 'Requested data not found',
}
