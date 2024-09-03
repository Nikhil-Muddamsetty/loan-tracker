import { Test, TestingModule } from '@nestjs/testing';
import { RepaymentsController } from './repayments.controller';

describe('RepaymentsController', () => {
  let controller: RepaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepaymentsController],
    }).compile();

    controller = module.get<RepaymentsController>(RepaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
