import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';

import { WalletProvider } from './providers/wallet.provider';
import { Wallet } from './schemas/wallet.schema';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class WalletService {
  private readonly network = bitcoin.networks.testnet;
  private readonly ECPair = ECPairFactory(ecc);

  constructor(
    private readonly walletProvider: WalletProvider,
    private readonly cryptoService: CryptoService,
  ) {
    bitcoin.initEccLib(ecc);
  }

  async createWallet(userId: Types.ObjectId): Promise<Wallet> {
    const keyPair = this.ECPair.makeRandom({
      network: this.network,
    });

    const privateKey = keyPair.privateKey?.toString('hex');
    const privateKeyEncrypted = this.cryptoService.encrypt(privateKey!);

    const p2tr = bitcoin.payments.p2tr({
      internalPubkey: Buffer.from(ecc.xOnlyPointFromPoint(keyPair.publicKey)),
      network: this.network,
    });
    const address = p2tr.address!.toString();

    return await this.walletProvider.create(
      userId,
      privateKeyEncrypted,
      address,
    );
  }
}
