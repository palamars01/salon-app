import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserModel,
  UserDocument,
} from '@/mongo/schemas/User/user.schema';
import { baseExcludedFileds } from '@/common/constants';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async findByEmailOrPhone(authValue: string) {
    return this.userModel.findByEmailOrPhone<UserDocument>(authValue);
  }

  async create(createUserDTO: CreateUserDTO) {
    return await this.userModel.create(createUserDTO);
  }

  async findAll() {
    return this.userModel.find({}, { select: baseExcludedFileds });
  }

  async findById(id: string) {
    return await this.userModel.findById(id, { select: baseExcludedFileds });
  }

  async update(user: User, updateUserDto: UpdateUserDTO) {
    Object.assign(user, updateUserDto);

    await user.save();

    return { user: user.toPublic() };
  }
}
