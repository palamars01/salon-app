import { BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { CreateSalonDTO } from '@/salon/dto/create-salon.dto';

export class CreateSalonValidationPipe implements PipeTransform {
  async transform(createSalonDto: CreateSalonDTO) {
    if (typeof createSalonDto === 'string') {
      return createSalonDto;
    }
    const createSalonDTO = plainToInstance(CreateSalonDTO, createSalonDto);

    // Validate
    const res = await validate(createSalonDTO);

    // Group error messages
    if (res.length) {
      const errors = res.map(
        ({ constraints }) => Object.values(constraints!)[0],
      );
      throw new BadRequestException({ errors });
    }
    return createSalonDTO;
  }
}
