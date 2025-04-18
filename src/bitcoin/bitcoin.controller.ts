import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BitcoinService } from './bitcoin.service';
import { TransactionDto } from './dtos/transaction.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('bitcoin')
export class BitcoinController {
  constructor(private readonly bitcoinService: BitcoinService) {}

  @HttpCode(HttpStatus.OK)
  @Post('transaction')
  transaction(@Body() dto: TransactionDto): Promise<string> {
    return this.bitcoinService.transaction(dto);
  }
}
