import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthHelper } from 'src/auth/helpers/auth.helper';

@Injectable()
export class WalletMiddleware implements NestMiddleware {
  constructor(private readonly authHelper: AuthHelper) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authToken = this.authHelper.extractToken(req);
    if (!authToken) throw new UnauthorizedException();

    const payload = this.authHelper.verifyToken(authToken);

    req.body = { userId: payload.sub };

    next();
  }
}
