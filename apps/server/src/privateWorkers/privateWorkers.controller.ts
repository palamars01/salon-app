import { Request } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';

import { User } from '@/mongo/schemas/User/user.schema';

import { SetTokenType } from '@/common/decorators/tokenType.decorator';
import { TokenType } from '@/common/interfaces';
import { Roles } from '@/common/decorators/role.decorator';

import { ApiRoutes, RolesEnum } from '@repo/shared/enums';

import { PrivateWorkersService } from './privateWorkers.service';

import { AddPrivateWorkerDTO } from './dto/add-privateWorker.dto';

import { ValidationWithParamPipe } from '../salon/pipes/validationWithParam.pipe';

@Controller('private-workers')
@SetTokenType(TokenType.BEARER)
export class PrivateWorkersController {
  constructor(private readonly privateWorkersService: PrivateWorkersService) {}

  // Get Salon private workers
  @Get(ApiRoutes.privateWorkers.getAll.path)
  @Roles(RolesEnum.salon)
  async getAll(@Req() req: Request, @Param('salonId') salonId: string) {
    const user: User = req['user'];
    return this.privateWorkersService.getAll(user.id, salonId);
  }

  // Add new Salon private worker
  @Post(ApiRoutes.privateWorkers.create.path)
  @UsePipes(new ValidationWithParamPipe(AddPrivateWorkerDTO))
  @Roles(RolesEnum.salon)
  async create(
    @Req() req: Request,
    @Param('salonId') salonId: string,
    @Body() addPrivateWorkerDTO: AddPrivateWorkerDTO,
  ) {
    const user: User = req['user'];
    return this.privateWorkersService.create(
      user.id,
      salonId,
      addPrivateWorkerDTO,
    );
  }

  /* Delete single private worker */
  @Delete(ApiRoutes.privateWorkers.delete.path)
  @Roles(RolesEnum.salon)
  async delete(
    @Req() req: Request,
    @Param('salonId') salonId: string,
    @Param('privateWorkerId') privateWorkerId: string,
  ) {
    return this.privateWorkersService.delete(salonId, privateWorkerId);
  }

  // Get private worker dashboard data
  @Get(ApiRoutes.privateWorkers.getDashboardData.path)
  @Roles(RolesEnum.privateWorker)
  async getPrivateWorkerDasdboard(
    @Req() req: Request,
    @Param('privateWorkerId') privateWorkerId: string,
  ) {
    return this.privateWorkersService.getPrivateWorkerDasdboard(
      privateWorkerId,
    );
  }
}
