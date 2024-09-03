import { Injectable } from '@nestjs/common';
import { AddNewCreditCardEmiLoanDto } from 'src/loans/loans.dto';
import { Response } from 'src/utils/response';

@Injectable()
export class RepaymentsService {
  constructor() {}

  async generateRepaymentSchedule(
    addNewCreditCardEmiLoanDto: AddNewCreditCardEmiLoanDto,
  ) {
    try {
      const {
        amount,
        interest_rate: interestRate,
        interest_type: interestType,
        term,
      } = addNewCreditCardEmiLoanDto;

      const repaymentSchedule = [];
      const numberOfRepayments = term;
      const emiAmount = parseFloat(
        this.calculateEMI(amount, interestRate, term).toFixed(2),
      );
      let remainingAmount = amount;

      for (let i = 0; i < numberOfRepayments; i++) {
        const interest = parseFloat(
          this.calculateInterest(
            remainingAmount,
            interestRate,
            interestType,
          ).toFixed(2),
        );
        const principal = parseFloat((emiAmount - interest).toFixed(2));
        const totalEmiAmount = emiAmount;
        const outstandingAmount = parseFloat(
          (remainingAmount - principal).toFixed(2),
        );

        const repayment = {
          repayment_number: i + 1,
          interest,
          principal,
          total_emi_amount: totalEmiAmount,
          outstanding_amount: outstandingAmount,
        };

        repaymentSchedule.push(repayment);
        remainingAmount -= principal;
      }
      return Response.success('Repayment schedule generated', {
        totalPayment: parseFloat((emiAmount * numberOfRepayments).toFixed(2)),
        repaymentSchedule,
      });
    } catch (error) {
      return Response.error('UHE-RES-GRS', 'unhandled error', error);
    }
  }

  private calculateEMI(
    principal: number,
    interestRate: number,
    tenure: number,
  ): number {
    const monthlyInterestRate = (interestRate * 12) / 100 / 12;
    const numerator =
      principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, tenure);
    const denominator = Math.pow(1 + monthlyInterestRate, tenure) - 1;
    return numerator / denominator;
  }

  private calculateInterest(
    amount: number,
    interestRate: number,
    interestType: string,
  ): number {
    if (interestType === 'SIMPLE') {
      return (amount * interestRate) / 100;
    } else {
      return (amount * interestRate) / 100 / 12;
    }
  }
}
