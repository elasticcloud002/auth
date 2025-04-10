import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response } from 'supertest';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { IUser } from 'src/auth/interfaces/user.interface';
import { TransactionDto } from 'src/bitcoin/dtos/transaction.dto';
import { Wallet } from 'src/wallet/schemas/wallet.schema';

let userModel: Model<any>;
let walletModel: Model<Wallet>;
let authToken: string;
let userId: Types.ObjectId;

describe('BitcoinController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    name: 'BitcoinTestUser',
    email: 'btcuser@example.com',
    password: 'strongPass123',
    confirmPassword: 'strongPass123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userModel = moduleFixture.get<Model<any>>(getModelToken('User'));
    walletModel = moduleFixture.get<Model<Wallet>>(getModelToken('Wallet'));
  });

  beforeEach(async () => {
    await userModel.deleteMany({ email: testUser.email });
    await walletModel.deleteMany({ userId: userId });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/sign-up - should register a new user', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res: Response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(testUser)
      .expect(201);

    const body = res.body as IUser;

    expect(body).toHaveProperty('authToken');
    expect(body).toHaveProperty('refreshToken');
    authToken = body.authToken!;
    userId = new Types.ObjectId(body.id);
  });

  it('POST /bitcoin/transaction - should process transaction', async () => {
    await walletModel.create({
      privateKey:
        'e58656731bf1ab63b06c6158a373c3b2cb5d59d5cd27a11360008c12a1b544dfcb26af2f97800ae4a350538bce193fe7a1ef9dc219b216a5182bb621ab0c1f63ce3dd46889c410240713f33cb088e343735a2d11d672ddc0da4bfff9',
      address: 'tb1pemsp688wg8gf4jzxtaz6p88yhstd9z85y4mvwrsj972xkpkwd43sd3p4r0',
      userId,
    });

    const dto: TransactionDto = {
      privateKey: '',
      receivers: [
        {
          address:
            'tb1pjcwk4kmuqqfxyj9a6ldqxph9qxtcm0k7gdfpmmvmtjrytd3enf2qv4p8pn',
          amount: 0.000001,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .post('/bitcoin/transaction')
      .set('Authorization', `Bearer ${authToken}`)
      .send(dto)
      .expect(200);

    await walletModel.deleteMany({ userId: userId });

    expect(res.text).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
});
