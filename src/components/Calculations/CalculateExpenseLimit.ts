import { CombinedResult, SavingsData } from "@/types";

export const CalculateExpenseLimit = (
  combinedArray: CombinedResult[],
  dbData: SavingsData
): number => {
  const expenseLimit = Math.floor(
    combinedArray[dbData.numberOfSavingYears - 1].compound * 0.04
  );
  return expenseLimit;
};
