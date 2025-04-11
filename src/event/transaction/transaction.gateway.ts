import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebSocketMiddleware } from '../middleware/web-socket.middleware';
import { TransactionDto } from '../dtos/transaction.dto';
import { ISocket } from './interfaces/socket.interface';

@WebSocketGateway(8181, {
  namespace: 'api/transaction',
  transports: ['websocket'],
})
export class TransactionGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map();

  constructor(private readonly webSocketMiddleware: WebSocketMiddleware) {}

  afterInit(server: Server) {
    server.use((socket, next) => this.webSocketMiddleware.use(socket, next));
  }

  handleConnection(socket: Socket) {
    const clientId = socket.id;
    this.clients.set(clientId, socket);
  }

  handleDisconnect(socket: Socket) {
    const clientId = socket.id;
    this.clients.delete(clientId);
  }

  @SubscribeMessage('transactionApprove')
  handleMessage(
    @ConnectedSocket() socket: ISocket,
    @MessageBody() dto: TransactionDto,
  ) {
    dto.userId = socket.data.userId;
    this.server.to(socket.id).emit('transactionApprove', JSON.stringify(dto));
  }
}
