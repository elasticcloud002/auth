import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletProvider } from './providers/wallet.provider';
import { Wallet, walletSchema } from './schemas/wallet.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: walletSchema }]),
    AuthModule,
  ],
  providers: [WalletService, WalletProvider],
  controllers: [WalletController],
  exports: [WalletProvider],
})
export class WalletModule {}
