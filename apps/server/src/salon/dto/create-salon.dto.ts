import { Salon } from '@repo/shared/interfaces/salon';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min, ValidateIf } from 'class-validator';

export class CreateSalonDTO
  implements
    Omit<
      Salon,
      | 'services'
      | 'privateWorkers'
      | 'defaultWaitTimeInMinutes'
      | 'id'
      | 'notificationsSettings'
    >
{
  @IsNotEmpty({ message: 'Salon name is required' })
  name: string;

  @IsNotEmpty({ message: 'Salon address is required' })
  address: string;

  @IsNotEmpty({ message: 'Salon city is required' })
  city: string;

  @IsNotEmpty({ message: 'Salon owner name is required' })
  ownerName: string;

  @ValidateIf((o) => o.employees)
  @Min(1, { message: 'Total employees count is required' })
  @IsNotEmpty({ message: 'Total employees count is required' })
  @IsNumber()
  @Transform(({ value }) => +value)
  employees: number;
}
