import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
import { Response } from 'supertest';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { IUser } from 'src/auth/interfaces/user.interface';
import { TransactionDto } from 'src/bitcoin/dtos/transaction.dto';
// import { Wallet } from 'src/wallet/schemas/wallet.schema';

// let userModel: Model<any>;
// let walletModel: Model<Wallet>;
let authToken: string;
// let userId: Types.ObjectId;

describe('BitcoinController (e2e)', () => {
  let app: INestApplication;

  // const testUser = {
  //   name: 'BitcoinTestUser',
  //   email: 'btcuser@example.com',
  //   password: 'strongPass123',
  //   confirmPassword: 'strongPass123',
  // };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // userModel = moduleFixture.get<Model<any>>(getModelToken('User'));
    // walletModel = moduleFixture.get<Model<Wallet>>(getModelToken('Wallet'));
  });

  beforeEach(async () => {
    // await userModel.deleteMany({ email: testUser.email });
    // await walletModel.deleteMany({ userId: userId });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/sign-in - should sign in user', async () => {
    const credentials = { email: 'test@email.com', password: 'pass1234' };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res: Response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(credentials)
      .expect(200);

    const body = res.body as IUser;

    expect(body).toHaveProperty('authToken');
    expect(body).toHaveProperty('refreshToken');
    authToken = body.authToken!;
  });

  it('POST /bitcoin/transaction - should process transaction', async () => {
    // await walletModel.create({
    //   privateKey:
    //     '0403b61a8bd3aff65bf354469f8d4cc623938560abfdec7f2bbdd353f58bdb680da90cf11bc39ebf9fb0e63b421a8c39be7135d289d822af88c6b1a5127bfcb42dfc267aebfd4a2e88dd43a120ffc23bb6b1f83c701b6566d395f10c',
    //   address: 'tb1pry4u22ghxhmlrcxk3esldj0g8cxxuk6lh0matsza3h5yx4cyn79sqy5y50',
    //   userId,
    // });

    const dto: TransactionDto = {
      privateKey: '',
      receivers: [
        {
          address:
            'tb1pry4u22ghxhmlrcxk3esldj0g8cxxuk6lh0matsza3h5yx4cyn79sqy5y50',
          amount: 0.00001,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .post('/bitcoin/transaction')
      .set('Authorization', `Bearer ${authToken}`)
      .send(dto)
      .expect(200);

    // await walletModel.deleteMany({ userId: userId });

    expect(res.text).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
});
