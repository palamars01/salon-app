import { Request } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UsePipes,
} from '@nestjs/common';

import { User } from '@/mongo/schemas/User/user.schema';

import { SetTokenType } from '@/common/decorators/tokenType.decorator';
import { TokenType } from '@/common/interfaces';
import { Roles } from '@/common/decorators/role.decorator';
import { ApiRoutes, RolesEnum } from '@repo/shared/enums';

import { ServicesService } from './services.service';
import { ServiceDTO } from './dto/service.dto';

import { ServiceValidationPipe } from './pipes/service.validation.pipe';

@Controller('services')
@SetTokenType(TokenType.BEARER)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Add new Salon service
  @Post(ApiRoutes.services.create.path)
  @UsePipes(ServiceValidationPipe)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker)
  async create(
    @Body() servicenDTO: ServiceDTO,
    @Req() req: Request,
    @Param('salonId') salonId: string,
  ) {
    const user: User = req['user'];

    return this.servicesService.create(user, salonId, servicenDTO);
  }

  // Update Salon service
  @Put(ApiRoutes.services.update.path)
  @UsePipes(ServiceValidationPipe)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker)
  async update(
    @Req() req: Request,
    @Param('salonId') salonId: string,
    @Param('serviceId') serviceId: string,
    @Body() serviceDto: ServiceDTO,
  ) {
    const user: User = req['user'];

    return this.servicesService.update(user, salonId, serviceId, serviceDto);
  }

  /* Delete single service */
  @Delete(ApiRoutes.services.delete.path)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker)
  async delete(
    @Req() req: Request,
    @Param('salonId') salonId: string,
    @Param('serviceId') serviceId: string,
  ) {
    const user: User = req['user'];

    return this.servicesService.delete(user, salonId, serviceId);
  }

  // Get Salon active services
  @Get(ApiRoutes.services.getAll.path)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker)
  async getAll(@Req() req: Request, @Param('salonId') salonId: string) {
    const user: User = req['user'];

    return this.servicesService.getAll(user, salonId);
  }

  @Get(ApiRoutes.services.getOneById.path)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker)
  async getOneById(
    @Req() req: Request,
    @Param('salonId') salonId: string,
    @Param('serviceId') serviceId: string,
  ) {
    const user: User = req['user'];

    return this.servicesService.getOneById(user, salonId, serviceId);
  }
}
