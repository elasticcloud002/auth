import { Test, TestingModule } from '@nestjs/testing';
import { AuthHelper } from './auth.helper';

describe('AuthHelper', () => {
  let provider: AuthHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthHelper],
    }).compile();

    provider = module.get<AuthHelper>(AuthHelper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
