import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddNewLoanDto } from './loans.dto';
import { Response } from 'src/utils/response';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async addNewLoan(data: AddNewLoanDto) {
    try {
      const loan = await this.prisma.loan.create({ data });
      if (!loan) {
        return Response.error(
          'LOS-ANL-1',
          'Failed to add new loan to the database',
        );
      } else {
        return Response.success('Loan added', null);
      }
    } catch (error) {
      return Response.error('UHE-LOS-ANL', 'unhandled error', error);
    }
  }

  async getLoans() {
    try {
      const loans = await this.prisma.loan.findMany({});
      return Response.success('Fetched loans', loans);
    } catch (error) {
      return Response.error('UHE-LOS-GLS', 'unhandled error', error);
    }
  }

  async getLoanByLoanId(loan_id: number) {
    try {
      const loan = await this.prisma.loan.findFirst({ where: { id: loan_id } });
      if (!loan) {
        return Response.error(
          'LOS-GLBID-1',
          'No load with the provided loan_id exists',
        );
      } else {
        return Response.success('Fetched loan', loan);
      }
    } catch (error) {
      return Response.error('UHE-LOS-GLBLID', 'unhandled error', error);
    }
  }

  async deleteLoanByloanId(loan_id: number) {
    try {
      const loan = await this.prisma.loan.update({
        where: { id: loan_id },
        data: { mark_for_deletion: true },
      });
      if (!loan) {
        return Response.error(
          'LOS-DL-1',
          'Failed to delete loan from the database',
        );
      } else {
        return Response.success('Loan deleted', null);
      }
    } catch (error) {
      return Response.error('UHE-LOS-DLBLID', 'unhandled error', error);
    }
  }
}
