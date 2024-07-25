import { CombinedResult, SavingsData } from "@/types";

export const CalculateGrowth = ({
  principal,
  rateOfReturn,
  numberOfCompoundingYears,
  numberOfSavingYears,
  contribution,
  annualExpense,
}: SavingsData): CombinedResult[] => {
  let compoundAmount = principal;
  let standardAmount = principal;

  const totals: CombinedResult[] = [];
  // const annualExpense = 35000;

  for (let year = 1; year <= numberOfCompoundingYears; year++) {
    // Compound interest calculation
    compoundAmount *= rateOfReturn + 1;

    // Standard (simple) interest calculation
    standardAmount += 0;

    if (year <= numberOfSavingYears) {
      compoundAmount += contribution;
      standardAmount += contribution;
    } else {
      compoundAmount -= annualExpense;
      standardAmount -= annualExpense;
    }

    if (compoundAmount < 0) {
      compoundAmount = 0;
    }
    if (standardAmount < 0) {
      standardAmount = 0;
    }

    totals.push({
      year: year.toString(),
      compound: parseFloat(compoundAmount.toFixed()),
      standard: parseFloat(standardAmount.toFixed()),
    });
  }
  const expenseRecommendation = totals[numberOfSavingYears - 1].compound * 0.04;
  return totals;
};
