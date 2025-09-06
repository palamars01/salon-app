import { BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { AuthProvidersEnum } from '@repo/shared/enums';
import { SigninDTO } from '../dto';

export class SigninValidationPipe implements PipeTransform {
  async transform(signinDto: SigninDTO) {
    const signinDTOObj = plainToInstance(SigninDTO, signinDto);
    const { authValue, password, authProvider } = signinDTOObj;

    // Remove non-numeric characters
    if (authProvider === AuthProvidersEnum.PHONE) {
      signinDto.authValue = authValue.replace(/\D/g, '');
    }

    // Validate
    const res = await validate(signinDTOObj, { always: true });

    // Group error messages
    if (res.length) {
      const errors = res.map(
        ({ constraints }) => Object.values(constraints!)[0],
      );
      throw new BadRequestException({ errors });
    }
    return { authValue, password };
  }
}
