"use client";

//recharts requires being run on the client side

import * as React from "react";

import { SavingsData } from "@/types";
import { CalculateGrowth } from "../Calculations/CalculateGrowth";
import { CalculateExpenseLimit } from "../Calculations/CalculateExpenseLimit";
import { LivingExpenseChart } from "../Charts/LivingExpenseChart";
import { RetirementCard } from "./RetirementCard";
import { SavingsInvestingCard } from "./SavingsCard";
import { NetWorthChartCard } from "./NetworthChartCard";

export default function LifeCalculatorCard({
  dbData,
}: {
  dbData: SavingsData;
}) {
  const combinedArray = CalculateGrowth(dbData);
  const expenseLimit = CalculateExpenseLimit(combinedArray, dbData);
  const expectedExpense = dbData.annualExpense;
  const whereBankrupt = combinedArray.find((item) => item.standard === 0);
  const compound = combinedArray[combinedArray.length - 1].compound;
  const savings = combinedArray[combinedArray.length - 1].standard;
  const targetSavings = dbData.annualExpense / 0.04;
  const targetRetirementYearArray = combinedArray.find(
    (item) => item.compound >= targetSavings
  );
  const targetRetirementYear = targetRetirementYearArray?.year ?? null;

  return (
    <div className="space-y-4">
      <NetWorthChartCard
        compound={compound}
        savings={savings}
        length={combinedArray.length}
        combinedArray={combinedArray}
      />
      <div className="h-full flex flex-col md:flex-row space-3 gap-3">
        <LivingExpenseChart
          expenseLimit={expenseLimit}
          expectedExpense={expectedExpense}
        />
        <div className="flex gap-4 grow flex-col flex-1">
          <div className="flex grow gap-3">
            <SavingsInvestingCard
              title="Saving"
              amount={savings}
              description={`Saving alone, you will reach bankruptcy in ${
                whereBankrupt?.year ?? 0
              } years`}
            />
            <SavingsInvestingCard
              title="Investing"
              amount={compound}
              description={`By compounding, you will have this much in ${combinedArray.length} years.`}
            />
          </div>
          <div className="flex grow gap-3">
            <RetirementCard targetRetirementYear={targetRetirementYear} />
          </div>
        </div>
      </div>
    </div>
  );
}
