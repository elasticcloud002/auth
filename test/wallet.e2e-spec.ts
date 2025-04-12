import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types } from 'mongoose';

import { WalletModule } from '../src/wallet/wallet.module';
import { WalletService } from '../src/wallet/wallet.service';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('WalletController (e2e)', () => {
  let app: INestApplication;
  const walletService = {
    createWallet: jest.fn(),
    getTransactions: jest.fn(),
    getWallet: jest.fn(),
  };

  const mockWallet = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    address: 'tb1qmockedaddress',
    privateKey: 'encrypted-key',
  };

  const mockTransactions = [
    {
      type: 'incoming',
      amount: 0.0001,
      address: 'tb1qmockedaddress',
      date: '2024-04-01T19:33:20.000Z',
      status: 'confirmed',
    },
  ];

  const mockWalletSummary = {
    address: 'tb1qmockedaddress',
    balance: 10000,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WalletModule],
    })
      .overrideProvider(WalletService)
      .useValue(walletService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/wallet/create (POST)', () => {
    it('should create and return a wallet', async () => {
      walletService.createWallet.mockResolvedValue(mockWallet);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const response = await request(app.getHttpServer())
        .post('/wallet/create')
        .send({ userId: mockWallet.userId });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({ address: mockWallet.address }),
      );
    });
  });

  describe('/wallet/transactions/:address (GET)', () => {
    it('should return transactions for an address', async () => {
      walletService.getTransactions.mockResolvedValue(mockTransactions);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const response = await request(app.getHttpServer()).get(
        `/wallet/transactions/${mockWallet.address}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTransactions);
    });
  });

  describe('/wallet (GET)', () => {
    it('should return wallet address and balance for a user', async () => {
      walletService.getWallet.mockResolvedValue(mockWalletSummary);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const response = await request(app.getHttpServer())
        .get('/wallet')
        .send({ userId: mockWallet.userId });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockWalletSummary);
    });
  });
});
