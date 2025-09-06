import { BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export class ValidationWithParamPipe implements PipeTransform {
  constructor(private currentDTO: ClassConstructor<object>) {}

  async transform(currentDto: object) {
    if (typeof currentDto === 'string') {
      return currentDto;
    }

    const currentDTO = plainToInstance(this.currentDTO, currentDto);

    // Validate
    const res = await validate(currentDTO);

    // Group error messages
    if (res.length) {
      const errors = res.map(
        ({ constraints }) => Object.values(constraints!)[0],
      );
      throw new BadRequestException({ errors });
    }
    return currentDTO;
  }
}
