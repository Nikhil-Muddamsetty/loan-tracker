import { InterestType, RepaymentFrequency } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class AdditionalCharges {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class AdditionalChargesOnInterestOrPrincipalType {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNotEmpty()
  @IsEnum(['PERCENTAGE', 'FIXED'])
  @IsString()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class RepaymentsType {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  emi_number: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  due_date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalCharges)
  additional_charges_on_emis: AdditionalCharges[];
}

export class AddNewLoanDto {
  @IsNotEmpty()
  @IsString()
  @IsISO4217CurrencyCode()
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
  repayment_frequency: RepaymentFrequency;

  @IsNumber()
  @IsNotEmpty()
  term: number;

  @IsDateString()
  @IsNotEmpty()
  lent_on: string;
}

export class AddNewCreditCardEmiLoanDto {
  @IsNotEmpty()
  @IsString()
  @IsISO4217CurrencyCode()
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
  repayment_frequency: RepaymentFrequency;

  @IsInt()
  @IsNotEmpty()
  term: number;

  @IsDateString()
  @IsNotEmpty()
  lent_on: string;

  @IsDateString()
  @IsNotEmpty()
  first_emi_date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalChargesOnInterestOrPrincipalType)
  additional_charges_on_principal?: AdditionalChargesOnInterestOrPrincipalType[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalChargesOnInterestOrPrincipalType)
  additional_charges_on_interest: AdditionalChargesOnInterestOrPrincipalType[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalCharges)
  additional_charges_on_1st_emi: AdditionalCharges[];
}

export class AddNewCreditCardEmiLoanCustomDto {
  @IsNotEmpty()
  @IsString()
  @IsISO4217CurrencyCode()
  currency: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Min(0)
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
  repayment_frequency: RepaymentFrequency;

  @IsInt()
  @IsNotEmpty()
  term: number;

  @IsDateString()
  @IsNotEmpty()
  lent_on: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepaymentsType)
  repayments: RepaymentsType[];
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
