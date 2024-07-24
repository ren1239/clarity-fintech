export interface FormValueTypes {
  principal: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  numberOfSavingYears: number;
  contribution: number;
}

export interface CalculationResult {
  year: number;
  value: string;
}

export interface Accumulator {
  amount: number;
  results: CalculationResult[];
}

export interface CombinedResult {
  year: string;
  compound: number;
  standard: number;
}

export interface RetirementArrayType {
  year: string;
  networth: number;
}

export interface SavingsData {
  principal: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  numberOfSavingYears: number;
  contribution: number;
  id: string;
}

export interface RetirementDataType {
  retirementAmount: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  annualExpenses: number;
  id: string;
}

export interface RetirementFormType {
  retirementAmount: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  annualExpenses: number;
}
