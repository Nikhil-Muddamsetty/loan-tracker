import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RepaymentsModule } from 'src/repayments/repayments.module';

@Module({
  imports: [PrismaModule, RepaymentsModule],
  providers: [LoansService],
  controllers: [LoansController],
})
export class LoansModule {}
