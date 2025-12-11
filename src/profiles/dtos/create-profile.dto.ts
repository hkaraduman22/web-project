import { IsEmail, IsNotEmpty, Matches, IsString } from 'class-validator';

export class CreateProfileDto { // Class isminin bu olduğundan emin ol
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
}