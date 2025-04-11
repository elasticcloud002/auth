import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { TransactionGateway } from './transaction/transaction.gateway';
import { WebSocketMiddleware } from './middleware/web-socket.middleware';

@Module({
  imports: [WalletModule, AuthModule],
  providers: [TransactionGateway, WebSocketMiddleware],
})
export class EventModule {}
