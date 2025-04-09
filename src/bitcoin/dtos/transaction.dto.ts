import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class ToAddress {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  privateKey: string;

  @IsArray()
  @IsNotEmpty()
  receivers: ToAddress[];
}
