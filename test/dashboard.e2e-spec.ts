import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'supertest';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { IUser } from 'src/auth/interfaces/user.interface';

let userModel: Model<any>;
let authToken: string;

describe('DashboardController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    name: 'DashboardTestUser',
    email: 'dashboard@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userModel = moduleFixture.get<Model<any>>(getModelToken('User'));
  });

  beforeEach(async () => {
    await userModel.deleteMany({ email: testUser.email });
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
  });

  interface IResponse {
    message: string;
  }

  it('GET /dashboard - should return a successful dashboard message', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res: Response = await request(app.getHttpServer())
      .get('/dashboard')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const body = res.body as IResponse;

    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Successful');
  });

  it('GET /dashboard - should return 401 if no valid token is provided', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res: Response = await request(app.getHttpServer())
      .get('/dashboard')
      .expect(401);

    const body = res.body as IResponse;

    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Unauthorized');
  });
});
