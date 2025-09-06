import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AddPrivateWorkerDTO {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @MinLength(8, {
    message: 'Temporary password should be at least 8 characters',
  })
  @IsNotEmpty({ message: 'Temporary password is required' })
  tempPassword: string;
}
