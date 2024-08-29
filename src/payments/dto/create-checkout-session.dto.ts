import {
  IsString,
  IsEmail,
  MaxLength,
  IsOptional,
  Matches,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  @IsNotEmpty()
  priceId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['perfectgel', 'propress'])
  course: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsString()
  @MaxLength(40)
  @IsOptional()
  lastname?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{7,12}$/, {
    message: 'phone must be a string with 7 to 12 digits',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  comment?: string;
}
