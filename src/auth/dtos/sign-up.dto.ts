import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsEqualTo } from '../../decorators/is-equal-to.decorator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEqualTo('password')
  confirmPassword: string;
}
