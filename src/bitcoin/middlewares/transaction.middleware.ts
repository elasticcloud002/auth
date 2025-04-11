import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';

import { AuthHelper } from '../../auth/helpers/auth.helper';
import { WalletProvider } from '../../wallet/providers/wallet.provider';
import { CryptoService } from '../../crypto/crypto.service';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly walletProvider: WalletProvider,
    private readonly cryptoService: CryptoService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authToken = this.authHelper.extractToken(req);
    if (!authToken) throw new UnauthorizedException();

    const payload = this.authHelper.verifyToken(authToken);
    if (!payload) throw new UnauthorizedException();

    const wallet = await this.walletProvider.getByUserId(payload.sub);
    const privateKey = this.cryptoService.decrypt(wallet.privateKey);

    req.body = { privateKey };

    next();
  }
}
