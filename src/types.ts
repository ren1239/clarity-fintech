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
