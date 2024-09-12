import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LoansService } from './loans.service';
import {
  AddNewCreditCardEmiLoanCustomDto,
  AddNewCreditCardEmiLoanDto,
  AddNewLoanDto,
  DeleteLoanByLoanIdDto,
  GetLoanByIdDto,
} from './loans.dto';
import { Res } from 'src/utils/response';

@Controller('loan')
export class LoansController {
  constructor(private loanService: LoansService) {}

  @Get('')
  async getLoans() {
    try {
      return await this.loanService.getLoans();
    } catch (error) {
      return Res.error('UHE-LOC-GLS', 'unhandled error', error);
    }
  }

  @Get(':loan_id')
  async getLoanById(@Param() getLoanByIdDto: GetLoanByIdDto) {
    try {
      return this.loanService.getLoanByLoanId(getLoanByIdDto.loan_id);
    } catch (error) {
      return Res.error('UHE-LOC-GLBID', 'unhandled error', error);
    }
  }

  @Post('')
  async addNewLoan(@Body() addNewLoanDto: AddNewLoanDto) {
    try {
      return this.loanService.addNewLoan(addNewLoanDto);
    } catch (error) {
      return Res.error('UHE-LOC-ANL', 'unhandled error', error);
    }
  }

  @Post('credit-card-emi')
  async addNewCreditCardEmiLoan(
    @Body() addNewCreditCardEmiLoanDto: AddNewCreditCardEmiLoanDto,
  ) {
    try {
      return this.loanService.addNewCreditCardEmiLoan(
        addNewCreditCardEmiLoanDto,
      );
    } catch (error) {
      return Res.error('UHE-LOC-ANCCEL', 'unhandled error', error);
    }
  }

  @Post('credit-card-emi-custom')
  async addNewCreditCardEmiCustomLoan(
    @Body() addNewCreditCardEmiLoanCustomDto: AddNewCreditCardEmiLoanCustomDto,
  ) {
    try {
      return this.loanService.addNewCreditCardEmiCustomLoan(
        addNewCreditCardEmiLoanCustomDto,
      );
    } catch (error) {
      return Res.error('UHE-LOC-ANCCECL', 'unhandled error', error);
    }
  }

  @Delete(':loan_id')
  async deleteLoanByLoanId(
    @Param() deleteLoanByLoanIdDto: DeleteLoanByLoanIdDto,
  ) {
    try {
      return this.loanService.deleteLoanByloanId(deleteLoanByLoanIdDto.loan_id);
    } catch (error) {
      return Res.error('UHE-LOC-DLBLID', 'unhandled error', error);
    }
  }
}
