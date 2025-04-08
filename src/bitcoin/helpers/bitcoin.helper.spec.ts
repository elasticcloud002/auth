import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinHelper } from './bitcoin.helper';

describe('BitcoinHelper', () => {
  let provider: BitcoinHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BitcoinHelper],
    }).compile();

    provider = module.get<BitcoinHelper>(BitcoinHelper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
