import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'supertest';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { IUser } from 'src/auth/interfaces/user.interface';
import { TransactionDto } from 'src/bitcoin/dtos/transaction.dto';

let authToken: string;

describe('BitcoinController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
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

    expect(res.text).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
});
