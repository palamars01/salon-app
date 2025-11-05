import { BadRequestException, PipeTransform } from '@nestjs/common';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { SignupDTO } from '../dto/signup.dto';
import { AuthProvidersEnum } from '@repo/shared/enums';
import { phoneNumberValidation } from '@/validations/phoneNumber.validation';

export class SignupValidationPipe implements PipeTransform {
  async transform(signupDto: SignupDTO) {
    const signupDTO = plainToInstance(SignupDTO, signupDto);
    const { authProvider, authValue } = signupDTO;
    let phoneNumberValidationError = '';

    // Remove non-numeric characters
    if (authProvider === AuthProvidersEnum.PHONE) {
      signupDTO.authValue =
        '+' + signupDTO.phone?.dialCode + authValue.replace(/\D/g, '');
      const isPhoneNumberValid = signupDTO.authValue.match(
        phoneNumberValidation[signupDTO.country!].regExp,
      );

      if (!isPhoneNumberValid) {
        phoneNumberValidationError = 'Phone number format is not valid';
      }
    }

    // Validate
    const res = await validate(signupDTO, {
      groups: [signupDTO.authProvider],
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

    return signupDTO;
  }
}
