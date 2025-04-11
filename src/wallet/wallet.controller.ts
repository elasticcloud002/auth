import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { WalletService } from './wallet.service';
import { Wallet } from './schemas/wallet.schema';
import { ITransaction } from './interfaces/transaction.interface';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  createWallet(@Body('userId') userId: Types.ObjectId): Promise<Wallet> {
    return this.walletService.createWallet(userId);
  }

  @UseGuards(AuthGuard)
  @Get('transactions/:address')
  getTransactions(@Param('address') address: string): Promise<ITransaction[]> {
    return this.walletService.getTransactions(address);
  }
}
