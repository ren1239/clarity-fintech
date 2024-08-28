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

export interface PortfolioInputFormType {
  ticker: string;
  purchaseDate: Date;
  purchasePrice: number;
  quantity: number;
  currency: string;
  country: string;
  sector?: string;
  industry?: string;
  exchange?: string;
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
  simpleCalculation: boolean;
  reportedCurrency: string;
  stockCurrency: string;
}

export interface dcfResultsType {
  dcfValue: number;
  totalFcf: number;
  totalPvFcf: number;
  fcfArray: {
    year: number;
    fcf: number;
    pvFcf: number;
  }[];
  terminalYearFcf: number;
  terminalYearPvFcf: number;
}

export interface PortfolioSnapshotType {
  ticker: string;
  currency: string;
  _avg: {
    purchasePrice: number | null;
  };
  _sum: {
    quantity: number | null;
  };
  targetPrice: number;
}
[];

export interface PriceByDateType {
  date: string;
  prices: { [symbol: string]: number };
}

export interface PortfolioValueDataType {
  totalValue: number;
  breakdown: {
    [ticker: string]: number;
  };
  date: string;
  countryBreakdown: { [country: string]: { [ticker: string]: number } };
}

export interface StockNameType {
  symbol: string;
  name: string;
  stockExchange: string;
  exchangeShortName: string;
}

export interface PortfolioDBDataType {
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  ticker: string;
  purchasePrice: number;
  quantity: number;
  currency: string;
  country: string;
  sector: string | null;
  industry: string | null;
  exchange: string | null;
  userId: string | null;
}

export interface GroupedPortfolioType {
  symbol: string;
  earliestPurchaseDate: string;
}

export interface PortfolioValueBreakdown {
  totalValue: number;
  breakdown: { [ticker: string]: number };
  countryBreakdown: { [country: string]: { [ticker: string]: number } };
}
