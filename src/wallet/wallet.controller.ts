import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { WalletService } from './wallet.service';
import { Wallet } from './schemas/wallet.schema';

@UseGuards(AuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  createWallet(@Body('userId') userId: Types.ObjectId): Promise<Wallet> {
    return this.walletService.createWallet(userId);
  }
}
