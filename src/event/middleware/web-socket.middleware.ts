import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtendedError } from 'socket.io';

import { AuthHelper } from 'src/auth/helpers/auth.helper';
import { ISocket } from '../transaction/interfaces/socket.interface';

@Injectable()
export class WebSocketMiddleware {
  constructor(private readonly authHelper: AuthHelper) {}

  use(socket: ISocket, next: (err?: ExtendedError) => void): void {
    const token = socket.handshake.headers.authorization;
    if (!token) throw new UnauthorizedException();

    const payload = this.authHelper.verifyToken(token);
    if (!payload) throw new UnauthorizedException();

    socket.data = { userId: payload.sub };

    next();
  }
}
