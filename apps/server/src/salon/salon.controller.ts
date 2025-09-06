import { Request } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';

import { User } from '@/mongo/schemas/User/user.schema';

import { SetTokenType } from '@/common/decorators/tokenType.decorator';
import { TokenType } from '@/common/interfaces';
import { Roles } from '@/common/decorators/role.decorator';
import { ApiRoutes, RolesEnum } from '@repo/shared/enums';

import { SalonService } from './salon.service';
import { CreateSalonDTO } from './dto/create-salon.dto';

import { CreateSalonValidationPipe } from './pipes/createSalonValidation.pipe';

@Controller('salons')
@SetTokenType(TokenType.BEARER)
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  // Create new Salon
  @Post()
  @UsePipes(new CreateSalonValidationPipe())
  @Roles(RolesEnum.salon)
  async create(@Req() req: Request, @Body() createSalonDTO: CreateSalonDTO) {
    const user: User = req['user'];
    return this.salonService.create(createSalonDTO, user.id);
  }

  // Get Salons by Admin ID
  @Get(ApiRoutes.salons.getSalonsByAdminId.path)
  @Roles(RolesEnum.salon)
  async getSalonsByAdminId(@Req() req: Request) {
    const user: User = req['user'];

    return await this.salonService.getSalonsByAdminId(user.id);
  }

  // Get widgets data for the Admin Dashboard
  @Get(ApiRoutes.salons.getAdminDashboard.path)
  @Roles(RolesEnum.salon)
  async getAdminDashboard(@Req() req: Request) {
    const user: User = req['user'];

    return this.salonService.getAdminDashboard(user.id);
  }

  // Get Salon by its ID
  @Get(ApiRoutes.salons.getSalonDashboard.path)
  @Roles(RolesEnum.salon)
  async getSalonDashboard(
    @Req() req: Request,
    @Param('salonId') salonId: string,
  ) {
    const user: User = req['user'];
    return this.salonService.getSalonDashboard(user, salonId);
  }
  // Get Salons for customer
  @Get(ApiRoutes.salons.getSalonsForCustomer.path)
  @Roles(RolesEnum.customer)
  async getSalonsForCustomer(
    @Query('search') search: string,
    @Query('waitTime') waitTime: string,
  ) {
    return this.salonService.getSalonsForCustomer(search, waitTime);
  }
  /* Update salon */
  @Put(ApiRoutes.salons.update.path)
  @Roles(RolesEnum.privateWorker, RolesEnum.salon)
  async update(
    @Req() req: Request,
    @Param('salonId') salonId: string,

    @Body() updateUserDto: Partial<CreateSalonDTO>,
  ) {
    const user: User = req['user'];

    return this.salonService.update(user, salonId, updateUserDto);
  }
}
