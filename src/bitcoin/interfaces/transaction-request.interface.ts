import { Request } from 'express';

import { TransactionDto } from '../dtos/transaction.dto';

export interface TransactionRequest extends Request {
  body: TransactionDto;
}
