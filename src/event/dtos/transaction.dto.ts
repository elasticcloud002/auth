import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  txId: string;

  @IsOptional()
  userId?: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
