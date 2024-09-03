import { Module } from '@nestjs/common';
import { RepaymentsService } from './repayments.service';
import { RepaymentsController } from './repayments.controller';

@Module({
  providers: [RepaymentsService],
  controllers: [RepaymentsController],
  exports: [RepaymentsService],
})
export class RepaymentsModule {}
