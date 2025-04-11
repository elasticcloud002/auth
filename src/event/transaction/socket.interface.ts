import { Types } from 'mongoose';
import { Socket } from 'socket.io';

export interface ISocket extends Socket {
  data: { userId: Types.ObjectId };
}
