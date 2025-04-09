import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Wallet } from '../schemas/wallet.schema';

@Injectable()
export class WalletProvider {
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>,
  ) {}

  async getByUserId(userId: Types.ObjectId): Promise<Wallet> {
    const wallet = await this.walletModel.findOne({ userId });
    if (!wallet) throw new HttpException('Wallet not found', 404);

    return wallet;
  }
}
