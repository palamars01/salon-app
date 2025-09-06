import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { AppointmentDTO } from '../dto/appointment.dto';

@Injectable()
export class AppointmentValidationPipe implements PipeTransform {
  constructor() {}
  async transform(appointmentDto: AppointmentDTO) {
    if (typeof appointmentDto === 'string') {
      return appointmentDto;
    }
    const appointmentDTO = plainToInstance(AppointmentDTO, appointmentDto);

    const res = await validate(appointmentDTO, {
      always: true,
    });

    // Group error messages
    if (res.length) {
      const errors = res.map(
        ({ constraints }) => Object.values(constraints!)[0],
      );
      throw new BadRequestException({ errors });
    }
    return appointmentDTO;
  }
}
