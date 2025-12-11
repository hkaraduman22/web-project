import { IsEmail, IsNotEmpty, Matches, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message: 'Password must contain uppercase, lowercase, number and symbol',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value)) 
  profileTypeId: number;
}