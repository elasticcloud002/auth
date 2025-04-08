import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainProvider } from './blockchain.provider';

describe('BlockchainProvider', () => {
  let provider: BlockchainProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainProvider],
    }).compile();

    provider = module.get<BlockchainProvider>(BlockchainProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
