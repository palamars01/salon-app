import { BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { UpdateUserDTO } from '../dto/update-user.dto';

export class UpdateUserValidationPipe implements PipeTransform {
  async transform(updateDto: UpdateUserDTO) {
    const updateDTO = plainToInstance(UpdateUserDTO, updateDto);

    // Validate
    const res = await validate(updateDTO, {
      always: true,
    });

    // Group error messages
    if (res.length) {
      const errors = res.map(
        ({ constraints }) => Object.values(constraints!)[0],
      );
      throw new BadRequestException({ errors });
    }
    return updateDTO;
  }
}
