import { InterestType, RepaymentFrequency, TermType } from '@prisma/client';
import {
  IsCurrency,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class AddNewLoanDto {
  @IsCurrency()
  @IsNotEmpty()
  currency: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  interest_rate: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(InterestType)
  interest_type: InterestType;

  @IsString()
  @IsNotEmpty()
  @IsEnum(RepaymentFrequency)
  repayment_freqeuncy: RepaymentFrequency;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TermType)
  term_type: TermType;

  @IsNumber()
  @IsNotEmpty()
  term: number;

  @IsDateString()
  @IsNotEmpty()
  lent_on: string;
}

export class GetLoanByIdDto {
  @IsInt()
  @IsNotEmpty()
  loan_id: number;
}

export class DeleteLoanByLoanIdDto {
  @IsInt()
  @IsNotEmpty()
  loan_id: number;
}
