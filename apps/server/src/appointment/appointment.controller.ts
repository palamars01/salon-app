import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';

import { SetTokenType } from '@/common/decorators/tokenType.decorator';
import { TokenType } from '@/common/interfaces';
import { Roles } from '@/common/decorators/role.decorator';

import { User } from '@/mongo/schemas/User/user.schema';
import { ApiRoutes, RolesEnum } from '@repo/shared/enums';

import { AppointmentService } from './appointment.service';
import { AppointmentValidationPipe } from './pipes/appointment.validation.pipe';
import { CalculateWaitTimePipe } from './pipes/calculateWaitTime.pipe';
import { AppointmentDTO } from './dto/appointment.dto';
import { Appointment } from '@/mongo/schemas/Appointment/appointment.schema';

@Controller(ApiRoutes.appointments.base)
@SetTokenType(TokenType.BEARER)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post(ApiRoutes.appointments.create.path)
  @UsePipes(CalculateWaitTimePipe)
  @UsePipes(AppointmentValidationPipe)
  @Roles(RolesEnum.customer)
  async create(
    @Req() req: Request,
    @Body()
    appointmentDTO: AppointmentDTO & { arrivalTime: string; endTime: string },
  ) {
    const user: User = req['user'];
    return this.appointmentService.create(user, appointmentDTO);
  }

  @Get(ApiRoutes.appointments.getStatusData.path)
  @Roles(RolesEnum.customer)
  async getStatusData(
    @Req() req: Request,
    @Param('appointmentId') appointmentId: string,
  ) {
    const user: User = req['user'];
    return this.appointmentService.getStatusData(user, appointmentId);
  }

  @Delete(ApiRoutes.appointments.delete.path)
  @Roles(RolesEnum.customer)
  async delete(@Param('appointmentId') appointmentId: string) {
    return this.appointmentService.delete(appointmentId);
  }

  // Update Appointment
  @Put(ApiRoutes.appointments.update.path)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker)
  async update(
    @Res() res: Response,
    @Param('appointmentId') appointmentId: string,
    @Body() appointmentSource: Partial<Appointment>,
  ) {
    const response = await this.appointmentService.update(
      appointmentId,
      appointmentSource,
    );
    res.status(200).json(response);
  }

  /* Get appointments by status */
  @Post(ApiRoutes.appointments.getAppointmentsByStatus.path)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker)
  async getAppointmentsByStatus(
    @Req() req: Request,
    @Body()
    appointmentsFilters: typeof ApiRoutes.appointments.getAppointmentsByStatus.getOptions.body,
  ) {
    const user: User = req['user'];

    return this.appointmentService.getAppointmentsByStatus(
      user,
      appointmentsFilters,
    );
  }
  /* Bulk check in */
  @Post(ApiRoutes.appointments.bulkCheckIn.path)
  @Roles(RolesEnum.salon, RolesEnum.privateWorker)
  async bulkCheckIn(
    @Req() req: Request,
    @Body()
    appointmentsId: string[],
  ) {
    const user: User = req['user'];

    return this.appointmentService.bulkCheckIn(user, appointmentsId);
  }
}
