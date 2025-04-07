import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  dashboard(): { message: string } {
    return { message: 'Successful' };
  }
}
