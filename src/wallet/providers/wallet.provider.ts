import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Wallet } from '../schemas/wallet.schema';
import { BalanceEvent } from '../enums/balance-event.enum';

@Injectable()
export class WalletProvider {
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>,
  ) {}

  async create(
    userId: Types.ObjectId,
    privateKey: string,
    address: string,
  ): Promise<Wallet> {
    userId = new Types.ObjectId(userId);
    return await this.walletModel.create({ userId, privateKey, address });
  }

  async getByUserId(userId: Types.ObjectId): Promise<Wallet> {
    userId = new Types.ObjectId(userId);
    const wallet = await this.walletModel.findOne({ userId });
    if (!wallet) throw new HttpException('Wallet not found', 404);

    return wallet;
  }

  async updateBalance(
    userId: Types.ObjectId,
    value: number,
    event: BalanceEvent,
  ): Promise<Wallet | null> {
    userId = new Types.ObjectId(userId);
    if (event === BalanceEvent.dec) value = -value;

    return await this.walletModel.findOneAndUpdate(
      { userId },
      { $inc: { balance: value } },
      { new: true },
    );
  }
}
