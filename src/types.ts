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
  annualExpense: number;
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

export interface dcfCalculationType {
  stockPrice: number;
  sharesOutstanding: number;
  stGrowthRate: number;
  ltGrowthRate: number;
  discountRate: number;
  terminalValue: number;
  stockBasedComp: number;
  netCashDebt: number;
  fcf: number;
  simpleCalculation: Boolean;
}
