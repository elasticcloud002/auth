import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { AuthHelper } from 'src/auth/helpers/auth.helper';
import { TransactionRequest } from '../interfaces/transaction-request.interface';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private readonly authHelper: AuthHelper) {}

  use(req: TransactionRequest, res: Response, next: NextFunction) {
    const authToken = this.authHelper.extractToken(req);
    if (!authToken) throw new UnauthorizedException();

    const payload = this.authHelper.verifyToken(authToken);
    if (!payload) throw new UnauthorizedException();

    req.body.privateKey = 'private   Key';

    next();
  }
}
