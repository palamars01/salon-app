import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { phoneNumberValidation } from '@/validations/phoneNumber.validation';

import { AppointmentDTO } from '../dto/appointment.dto';

@Injectable()
export class AppointmentValidationPipe implements PipeTransform {
  constructor() {}
  async transform(appointmentDto: AppointmentDTO) {
    let phoneNumberValidationError = '';

    if (typeof appointmentDto === 'string') {
      return appointmentDto;
    }

    const isPhoneNumberValid = (
      '+' +
      appointmentDto.phone.dialCode +
      appointmentDto.phone.number
    ).match(phoneNumberValidation[appointmentDto.country!].regExp);

    if (!isPhoneNumberValid) {
      phoneNumberValidationError = 'Phone number format is not valid';
    }

    const appointmentDTO = plainToInstance(AppointmentDTO, appointmentDto);

    const res = await validate(appointmentDTO, {
      always: true,
    });

    // Group error messages
    if (res.length || phoneNumberValidationError) {
      const errors = res.map(
        ({ constraints }) => Object.values(constraints!)[0],
      );

      if (phoneNumberValidationError)
        errors.unshift(phoneNumberValidationError);

      throw new BadRequestException({ errors });
    }
    return appointmentDTO;
  }
}
