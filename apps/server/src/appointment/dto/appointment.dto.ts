import {
  ArrayMinSize,
  IsArray,
  IsMobilePhone,
  IsNotEmpty,
  IsObject,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class AppointmentDTO {
  @IsArray()
  @IsObject({ each: true })
  @ArrayMinSize(1, { message: 'You have to select service' })
  services: { id: string; duration: number; name: string }[];

  @IsNotEmpty({ message: 'Required field is missed' })
  @IsString()
  salon: string;

  @ValidateIf((o) => Object.keys(o).includes('privateWorkerId'))
  @IsNotEmpty({ message: 'Required field is missed' })
  @IsString()
  privateWorkerId: string;

  @IsMobilePhone(
    undefined,
    {},
    {
      message: 'Phone number format is not valid',
    },
  )
  phone: string;
  @ValidateIf((o) => Object.keys(o).includes('fName'))
  @MinLength(3, {
    message: 'First name be at least 2 characters',
  })
  @IsNotEmpty({ message: 'First name is required' })
  fName: string;
}
