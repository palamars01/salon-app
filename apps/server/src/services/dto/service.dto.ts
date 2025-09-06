import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import { Service } from '@repo/shared/interfaces/salon/service';

type Ommited = Omit<Service, 'id'>;

export class ServiceDTO implements Ommited {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Min(1, { message: 'Price is required' })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  @Transform(({ value }) => +value)
  price: number;

  @Min(1, { message: 'Estimated duration is required' })
  @IsNotEmpty({ message: 'Estimated duration is required' })
  @IsNumber()
  @Transform(({ value }) => +value)
  estimatedDuration: number;

  @ArrayNotEmpty({ message: 'Availability is required' })
  @IsString({ each: true })
  availability: string[];
}
