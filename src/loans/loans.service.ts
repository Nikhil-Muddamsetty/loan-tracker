import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddNewCreditCardEmiLoanCustomDto,
  AddNewCreditCardEmiLoanDto,
  AddNewLoanDto,
} from './loans.dto';
import { Response } from 'src/utils/response';
import { RepaymentsService } from 'src/repayments/repayments.service';

@Injectable()
export class LoansService {
  constructor(
    private prisma: PrismaService,
    private repaymentsService: RepaymentsService,
  ) {}

  async addNewLoan(addNewLoadDto: AddNewLoanDto) {
    // try {
    //   const loan = await this.prisma.loans.create({
    //     data: { ...addNewLoadDto },
    //   });
    //   if (!loan) {
    //     return Response.error(
    //       'LOS-ANL-1',
    //       'Failed to add new loan to the database',
    //     );
    //   } else {
    //     return Response.success('Loan added', null);
    //   }
    // } catch (error) {
    //   return Response.error('UHE-LOS-ANL', 'unhandled error', error);
    // }
  }

  async addNewCreditCardEmiLoan(
    addNewCreditCardEmiLoadDto: AddNewCreditCardEmiLoanDto,
  ) {
    try {
      const repaymentSchedule =
        await this.repaymentsService.generateRepaymentSchedule(
          addNewCreditCardEmiLoadDto,
        );
      return repaymentSchedule;
    } catch (error) {
      return Response.error('UHE-LOS-ANCCEL', 'unhandled error', error);
    }
  }

  async addNewCreditCardEmiCustomLoan(
    addNewCreditCardEmiLoanCustomDto: AddNewCreditCardEmiLoanCustomDto,
  ) {
    try {
      const generateLoansPayloadResponse = await this.generateLoansPayload(
        addNewCreditCardEmiLoanCustomDto,
      );
      if (generateLoansPayloadResponse.success === false) {
        return generateLoansPayloadResponse;
      }
      const generateTransactionPayloadResponse =
        await this.generateTransactionPayload(addNewCreditCardEmiLoanCustomDto);
      if (generateTransactionPayloadResponse.success === false) {
        return generateTransactionPayloadResponse;
      }
      const loan = await this.prisma.loans.create({
        data: {
          ...(generateLoansPayloadResponse?.data ?? {}),
          repayments: { create: generateTransactionPayloadResponse.data },
        },
      });
      return Response.success('Loan added', loan);
    } catch (error) {
      console.log(error);
      return Response.error('UHE-LOS-ANCCECL', 'unhandled error', error);
    }
  }

  async getLoans() {
    try {
      const loans = await this.prisma.loans.findMany({});
      return Response.success('Fetched loans', loans);
    } catch (error) {
      return Response.error('UHE-LOS-GLS', 'unhandled error', error);
    }
  }

  async getLoanByLoanId(loan_id: number) {
    try {
      const loan = await this.prisma.loans.findFirst({
        where: { id: loan_id },
      });
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
      const loan = await this.prisma.loans.update({
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

  async generateTransactionPayload(
    addNewCreditCardEmiLoanCustomDto: AddNewCreditCardEmiLoanCustomDto,
  ) {
    try {
      const { repayments } = addNewCreditCardEmiLoanCustomDto;
      const repaymentList = repayments
        .sort((a, b) => {
          return (
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          );
        })
        .map((repayment) => {
          return {
            currency: addNewCreditCardEmiLoanCustomDto.currency,
            interest: 0.0,
            principal: 0.0,
            amount: repayment.amount,
            due_date: repayment.due_date,
            status: 'ACTIVE',
            total_due:
              repayment.amount +
              repayment.additional_charges_on_emis.reduce(
                (total, additionCharges) => total + additionCharges.amount,
                0,
              ),
          };
        });
      return Response.success('Transaction payload generated', repaymentList);
    } catch (error) {
      return Response.error('UHE-LOS-GTP', 'unhandled error', error);
    }
  }

  async generateLoansPayload(
    addNewCreditCardEmiLoanCustomDto: AddNewCreditCardEmiLoanCustomDto,
  ) {
    try {
      const loans = {
        currency: addNewCreditCardEmiLoanCustomDto.currency,
        amount: addNewCreditCardEmiLoanCustomDto.amount,
        interest_rate: addNewCreditCardEmiLoanCustomDto.interest_rate,
        interest_type: addNewCreditCardEmiLoanCustomDto.interest_type,
        repayment_frequency:
          addNewCreditCardEmiLoanCustomDto.repayment_frequency,
        term: addNewCreditCardEmiLoanCustomDto.repayments.length,
        lent_on: addNewCreditCardEmiLoanCustomDto.lent_on,
        lender_id: addNewCreditCardEmiLoanCustomDto.lender_id,
      };
      if (addNewCreditCardEmiLoanCustomDto.borrower_id) {
        loans['borrower_id'] = addNewCreditCardEmiLoanCustomDto.borrower_id;
      } else {
        loans['borrower_email'] =
          addNewCreditCardEmiLoanCustomDto.borrower_email;
        loans['borrower_phone'] =
          addNewCreditCardEmiLoanCustomDto.borrower_phone;
      }
      return Response.success('Loans payload generated', loans);
    } catch (error) {
      return Response.error('UHE-LOS-GLP', 'unhandled error', error);
    }
  }
}
