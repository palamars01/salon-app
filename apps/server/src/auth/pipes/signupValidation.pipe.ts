import { BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { SignupDTO } from '../dto/signup.dto';
import { AuthProvidersEnum } from '@repo/shared/enums';

export class SignupValidationPipe implements PipeTransform {
  async transform(signupDto: SignupDTO) {
    const signupDTO = plainToInstance(SignupDTO, signupDto);
    const { authProvider, authValue } = signupDTO;

    // Remove non-numeric characters
    if (authProvider === AuthProvidersEnum.PHONE) {
      signupDTO.authValue = authValue.replace(/\D/g, '');
    }

    // Validate
    const res = await validate(signupDTO, {
      groups: [signupDTO.authProvider],
      always: true,
    });

    // Group error messages
    if (res.length) {
      const errors = res.map(
        ({ constraints }) => Object.values(constraints!)[0],
      );
      throw new BadRequestException({ errors });
    }
    const phone =
      signupDTO.authProvider === AuthProvidersEnum.PHONE
        ? signupDTO.authValue
        : null;

    return { ...signupDTO, phone };
  }
}
