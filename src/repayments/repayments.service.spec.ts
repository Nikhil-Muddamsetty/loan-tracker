import { Test, TestingModule } from '@nestjs/testing';
import { RepaymentsService } from './repayments.service';

describe('RepaymentsService', () => {
  let service: RepaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepaymentsService],
    }).compile();

    service = module.get<RepaymentsService>(RepaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
