"use client";

import { useEffect, useState } from "react";

import { FormValueTypes, CombinedResult } from "../../types";
import CompoundGrowthChart from "@/components/CompoundGrowthChart";

import { SavingsForm } from "@/components/SavingsForm";
import { Card } from "@/components/ui/card";
import DecorativeBackground from "@/components/decorative/DecorativeBackground";

const calculateGrowth = (
  principal: number,
  rate: number,
  years: number,
  savingYears: number,
  contribution: number
): CombinedResult[] => {
  let compoundAmount = principal;
  let standardAmount = principal;

  const totals: CombinedResult[] = [];

  for (let year = 1; year <= years; year++) {
    // Compound interest calculation
    compoundAmount *= rate + 1;

    // Standard (simple) interest calculation
    standardAmount += principal * rate;

    if (year <= savingYears) {
      compoundAmount += contribution;
      standardAmount += contribution;
    }

    totals.push({
      year: year.toString(),
      compound: parseFloat(compoundAmount.toFixed()),
      standard: parseFloat(standardAmount.toFixed()),
    });
  }
  return totals;
};

export default function CompoundCalculatorPage() {
  const [formValues, setFormValues] = useState<FormValueTypes>({
    principal: 1000,
    rateOfReturn: 0.07,
    numberOfCompoundingYears: 30,
    numberOfSavingYears: 30,
    contribution: 1000,
  });

  const [combinedArray, setCombinedArray] = useState<CombinedResult[]>([]);

  const handleUpdateFormValues = (values: FormValueTypes) => {
    console.log("values", values);
    setFormValues(values);
  };

  useEffect(() => {
    const {
      principal,
      rateOfReturn,
      numberOfCompoundingYears,
      numberOfSavingYears,
      contribution,
    } = formValues;

    const totals = calculateGrowth(
      principal,
      rateOfReturn,
      numberOfCompoundingYears,
      numberOfSavingYears,
      contribution
    );
    setCombinedArray(totals);
  }, [formValues]);

  return (
    <>
      <div className=" flex-1 pt-4 justify-between flex flex-col h-[calc(100vh-4.5rem)]">
        <DecorativeBackground />
        <div className=" mx-auto w-full grow lg:flex px-6 xl:px-8 gap-4 space-y-10 lg:space-y-0">
          {/* Left Side Chart */}
          <div className="flex-1 ">
            <CompoundGrowthChart combinedArray={combinedArray} />
          </div>
          {/* Right Form  */}

          <div className="shrink-0 flex-[0.3] lg:w-[200px] ">
            <Card className="p-4 h-full">
              <SavingsForm onUpdateFormValues={handleUpdateFormValues} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
