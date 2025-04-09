import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { AuthHelper } from 'src/auth/helpers/auth.helper';
import { TransactionRequest } from '../interfaces/transaction-request.interface';
import { WalletProvider } from 'src/wallet/providers/wallet.provider';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly walletProvider: WalletProvider,
    private readonly cryptoService: CryptoService,
  ) {}

  async use(req: TransactionRequest, res: Response, next: NextFunction) {
    const authToken = this.authHelper.extractToken(req);
    if (!authToken) throw new UnauthorizedException();

    const payload = this.authHelper.verifyToken(authToken);
    if (!payload) throw new UnauthorizedException();

    const wallet = await this.walletProvider.getByUserId(payload.sub);
    const privateKey = this.cryptoService.decrypt(wallet.privateKey);

    req.body.privateKey = privateKey;

    next();
  }
}
