import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { ServiceDTO } from '../dto/service.dto';

@Injectable()
export class ServiceValidationPipe implements PipeTransform {
  constructor() {}
  async transform(serviceDto: ServiceDTO) {
    if (typeof serviceDto === 'string') {
      return serviceDto;
    }
    const serviceDTO = plainToInstance(ServiceDTO, serviceDto);

    const res = await validate(serviceDTO, {
      always: true,
    });

    // Group error messages
    if (res.length) {
      const errors = res.map(
        ({ constraints }) => Object.values(constraints!)[0],
      );
      throw new BadRequestException({ errors });
    }
    return serviceDTO;
  }
}
