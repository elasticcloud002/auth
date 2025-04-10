import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainNetworkProvider } from './blockchain-network.provider';

describe('BlockchainNetworkProvider', () => {
  let provider: BlockchainNetworkProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainNetworkProvider],
    }).compile();

    provider = module.get<BlockchainNetworkProvider>(BlockchainNetworkProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
