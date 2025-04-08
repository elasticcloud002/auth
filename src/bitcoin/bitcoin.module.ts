import { Module } from '@nestjs/common';

import { BitcoinService } from './bitcoin.service';
import { BitcoinController } from './bitcoin.controller';
import { BlockchainProvider } from './providers/blockchain.provider';
import { BitcoinHelper } from './helpers/bitcoin.helper';

@Module({
  providers: [BitcoinService, BlockchainProvider, BitcoinHelper],
  controllers: [BitcoinController],
})
export class BitcoinModule {}
