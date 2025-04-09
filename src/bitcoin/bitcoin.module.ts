import { Module } from '@nestjs/common';

import { BitcoinService } from './bitcoin.service';
import { BitcoinController } from './bitcoin.controller';
import { BlockchainProvider } from './providers/blockchain.provider';
import { BitcoinHelper } from './helpers/bitcoin.helper';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [CryptoModule, AuthModule],
  providers: [BitcoinService, BlockchainProvider, BitcoinHelper],
  controllers: [BitcoinController],
})
export class BitcoinModule {}
