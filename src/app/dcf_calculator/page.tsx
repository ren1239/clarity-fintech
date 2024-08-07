"use client";

import { dcfResultsType, dcfCalculationType } from "@/types";
import { DcfForm } from "@/components/DcfForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DcfValueCard } from "@/components/DcfCalculator/DcfValueCard";

import { StockPriceCard } from "@/components/DcfCalculator/StockPriceCard";
import { useEffect, useState } from "react";
import { MarginOfSafetyCard } from "@/components/DcfCalculator/MarginOfSafetyCard";
import { FcfChartCard } from "@/components/DcfCalculator/FcfChartCard";
import { TableDialogue } from "@/components/DcfCalculator/TableDialogue";
import { dcfCalculation } from "@/components/Calculations/CalculateDcf";
import { APIFinancialGrowthType } from "@/APItypes";

export default function DcfCalculatorPage() {
  const [dcfResults, setDcfResults] = useState<dcfResultsType | null>(null);
  const [dcfInput, setDcfInput] = useState<dcfCalculationType>({
    stockPrice: 15,
    sharesOutstanding: 100,
    stGrowthRate: 9,
    ltGrowthRate: 5,
    discountRate: 9,
    terminalValue: 15,
    stockBasedComp: 0,
    netCashDebt: 0,
    fcf: 100,
    simpleCalculation: false,
    reportedCurrency: "USD",
    stockCurrency: "USD",
  });

  useEffect(() => {
    const results = dcfCalculation(dcfInput);
    setDcfResults(results);
  }, []);

  const financialGrowth: APIFinancialGrowthType[] = [
    {
      symbol: "empty",
      date: "empty",
      calendarYear: "empty",
      period: "empty",
      revenueGrowth: 0,
      grossProfitGrowth: 0,
      ebitgrowth: 0,
      operatingIncomeGrowth: 0,
      netIncomeGrowth: 0,
      epsgrowth: 0,
      epsdilutedGrowth: 0,
      weightedAverageSharesGrowth: 0,
      weightedAverageSharesDilutedGrowth: 0,
      dividendsperShareGrowth: 0,
      operatingCashFlowGrowth: 0,
      freeCashFlowGrowth: 0,
      tenYRevenueGrowthPerShare: 0,
      fiveYRevenueGrowthPerShare: 0,
      threeYRevenueGrowthPerShare: 0,
      tenYOperatingCFGrowthPerShare: 0,
      fiveYOperatingCFGrowthPerShare: 0,
      threeYOperatingCFGrowthPerShare: 0,
      tenYNetIncomeGrowthPerShare: 0,
      fiveYNetIncomeGrowthPerShare: 0,
      threeYNetIncomeGrowthPerShare: 0,
      tenYShareholdersEquityGrowthPerShare: 0,
      fiveYShareholdersEquityGrowthPerShare: 0,
      threeYShareholdersEquityGrowthPerShare: 0,
      tenYDividendperShareGrowthPerShare: 0,
      fiveYDividendperShareGrowthPerShare: 0,
      threeYDividendperShareGrowthPerShare: 0,
      receivablesGrowth: 0,
      inventoryGrowth: 0,
      assetGrowth: 0,
      bookValueperShareGrowth: 0,
      debtGrowth: 0,
      rdexpenseGrowth: 0,
      sgaexpensesGrowth: 0,
    },
  ];

  return (
    <div className="flex-[1] pt-4 justify-between flex flex-col  relative space-y-4">
      <div className="mx-auto w-full grow lg:flex px-6 xl:px-8 gap-x-4 space-y-4 lg:space-y-0 h-full">
        {/* Left Side */}
        <div className="flex-1">
          <Card className="p-3 relative">
            <div className=" absolute top-4 left-4">
              <TableDialogue dcfResults={dcfResults} dcfInput={dcfInput} />
            </div>

            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row mb-8">
              <CardTitle className="text-center mx-auto">
                DCF Valuation
              </CardTitle>
            </CardHeader>
            <DcfForm
              setDcfResults={setDcfResults}
              setDcfInput={setDcfInput}
              dcfInput={dcfInput}
              financialGrowth={financialGrowth}
            />
          </Card>
        </div>

        {/* Right Side */}

        <div className="flex-col shrink-0 flex-[.7] lg:w-[400px] space-y-4 sticky top-16 h-full">
          <div className="flex space-x-4 text-xs h-[225px]">
            <StockPriceCard dcfInput={dcfInput} dcfResults={dcfResults} />

            <MarginOfSafetyCard dcfInput={dcfInput} dcfResults={dcfResults} />
          </div>
          <DcfValueCard dcfResults={dcfResults} dcfInput={dcfInput} />
        </div>
      </div>

      {/* Bottom Side */}

      <div className=" grow  px-6 xl:px-8 gap-x-4 space-y-4 h-full">
        <FcfChartCard dcfResults={dcfResults} />
      </div>
    </div>
  );
}
