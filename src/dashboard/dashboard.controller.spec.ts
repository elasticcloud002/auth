import { Test, TestingModule } from '@nestjs/testing';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  class FakeAuthGuard {
    canActivate(): boolean {
      return true;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [DashboardService],
    })
      .overrideGuard(AuthGuard)
      .useClass(FakeAuthGuard)
      .compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a success message from dashboardService', () => {
    const expectedResponse = { message: 'Successful' };
    jest.spyOn(service, 'dashboard').mockReturnValue(expectedResponse);

    const result = controller.dashboard();
    expect(result).toEqual(expectedResponse);
  });
});
