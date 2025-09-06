import { Body, Controller, Get, Put, Req, UsePipes } from '@nestjs/common';
import { Request } from 'express';

import { SetTokenType } from '@/common/decorators/tokenType.decorator';
import { Roles } from '@/common/decorators/role.decorator';
import { TokenType } from '@/common/interfaces';
import { ApiRoutes, RolesEnum } from '@repo/shared/enums';

import { User } from '@/mongo/schemas/User/user.schema';

import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateUserValidationPipe } from './pipes/updateUser.validation.pipe';

@SetTokenType(TokenType.BEARER)
@Controller(ApiRoutes.users.base)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RolesEnum.customer)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
  @Put()
  @UsePipes(new UpdateUserValidationPipe())
  @Roles(RolesEnum.privateWorker, RolesEnum.customer)
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDTO) {
    const user: User = req['user'];

    return this.userService.update(user, updateUserDto);
  }
}
