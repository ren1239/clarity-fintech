"use client";

import { APIAnalystEstimatesType, APIStockDataWrapper } from "@/APItypes";
import {
  moneyFormatter,
  percentFormatter,
} from "@/components/Calculations/Formatter";
import { DcfValueCard } from "@/components/DcfCalculator/DcfValueCard";
import { MarginOfSafetyCard } from "@/components/DcfCalculator/MarginOfSafetyCard";
import { StockPriceCard } from "@/components/DcfCalculator/StockPriceCard";
import { TableDialogue } from "@/components/DcfCalculator/TableDialogue";
import { DcfForm } from "@/components/DcfForm";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { dcfCalculationType, dcfResultsType } from "@/types";
import { dcfCalculation } from "@/components/Calculations/CalculateDcf";
import { CompanyBanner } from "@/components/CompanyBanner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DCFCalculatorPage({
  data,
}: {
  data: APIStockDataWrapper;
}) {
  const [dcfResults, setDcfResults] = useState<dcfResultsType | null>(null);
  const [dcfInput, setDcfInput] = useState<dcfCalculationType>({
    stockPrice: data.marketPrice?.historical?.[0]?.close || 15,
    sharesOutstanding: data.incomeStatement?.[0]?.weightedAverageShsOut || 100,
    stGrowthRate: 9,
    ltGrowthRate: 5,
    discountRate: 9,
    terminalValue: 15,
    stockBasedComp: data.cashflowStatement?.[0]?.stockBasedCompensation || 0,
    netCashDebt: data.balanceSheet?.[0]?.netDebt || 0,
    fcf: data.cashflowStatement?.[0]?.freeCashFlow || 100,
    simpleCalculation: false,
    reportedCurrency: data.balanceSheet?.[0].reportedCurrency || "USD",
    stockCurrency: data.companyProfile?.currency || "USD",
  });

  function calculateCAGR(growthRate: number, years: number) {
    return Number((((1 + growthRate) ** (1 / years) - 1) * 100).toFixed());
  }

  // Safely accessing the growth rates

  useEffect(() => {
    if (data) {
      const fiveYearGrowthRate =
        data.financialGrowth?.[0]?.fiveYRevenueGrowthPerShare ?? 0;
      const fiveYearCAGR = calculateCAGR(fiveYearGrowthRate, 5);
      setDcfInput((prevInput) => ({
        ...prevInput,
        stGrowthRate: fiveYearCAGR * 0.6,
        ltGrowthRate: fiveYearCAGR * 0.1,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (dcfInput) {
      const results = dcfCalculation(dcfInput);
      setDcfResults(results);
    }
  }, [dcfInput]);

  if (
    !data ||
    !data.companyProfile ||
    !data.balanceSheet ||
    !data.cashflowStatement ||
    !data.incomeStatement ||
    !data.financialGrowth ||
    !data.analystEstimates
  ) {
    return (
      <div>
        <h1>404 - Not Found</h1>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto flex flex-col items-center ">
      <div className=" lg:w-3/4 lg:px-0 w-full px-4  pt-4 ">
        <div className=" mx-auto grow flex-col space-y-4 min-h-full">
          {/* Company Banner */}
          <CompanyBanner companyProfile={data.companyProfile} />

          {/* DCF Card */}
          <div className="mx-auto w-full grow lg:flex gap-x-4 space-y-4 lg:space-y-0 h-full">
            {/* Left Side */}
            <div className="flex-1">
              <Card className="p-3">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row mb-8 relative">
                  <div className="absolute top-0 left-0 translate-y-1/2">
                    <TableDialogue
                      dcfResults={dcfResults}
                      dcfInput={dcfInput}
                    />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <CardTitle className="text-center mx-auto text-xl md:text-2xl">
                      DCF Valuation
                    </CardTitle>
                    <p className="text-xs  text-muted-foreground">
                      Reported currancy {dcfInput.reportedCurrency}
                    </p>
                  </div>
                </CardHeader>
                <DcfForm
                  setDcfResults={setDcfResults}
                  setDcfInput={setDcfInput}
                  dcfInput={dcfInput}
                  financialGrowth={data.financialGrowth}
                />
              </Card>
            </div>

            {/* Right Side */}
            <div className="flex-col shrink-0 flex-[.7] lg:w-[400px] space-y-4 sticky top-16 h-full">
              <div className="flex space-x-4 text-xs h-[225px]">
                <StockPriceCard dcfInput={dcfInput} dcfResults={dcfResults} />

                <MarginOfSafetyCard
                  dcfInput={dcfInput}
                  dcfResults={dcfResults}
                />
              </div>
              <DcfValueCard dcfResults={dcfResults} dcfInput={dcfInput} />
            </div>
          </div>

          {/* Bottom Side */}
          <div className="grow space-y-4">
            {/* <FcfChartCard dcfResults={dcfResults} /> */}
            <AnalystEstimatesCard analystEstimates={data.analystEstimates} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const AnalystEstimatesCard = ({
  analystEstimates,
}: {
  analystEstimates: APIAnalystEstimatesType[];
}) => {
  if (!analystEstimates) return <>Loading...</>;

  const calculateAverageGrowth = (
    analystEstimates: APIAnalystEstimatesType[]
  ) => {
    return analystEstimates.map((year, i) => {
      if (i === analystEstimates.length - 1)
        return { ...year, growthRate: null }; // No previous year to compare with
      const growthRate =
        (year.estimatedEpsAvg - analystEstimates[i + 1].estimatedEpsAvg) /
        analystEstimates[i + 1].estimatedEpsAvg;
      return { ...year, growthRate };
    });
  };

  const analystEstimatesWithGrowth = calculateAverageGrowth(analystEstimates);

  return (
    <div className="w-full h-[50vh] overflow-y-auto">
      <Card className="  ">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row mb-8 relative">
          <div className="flex flex-col items-center w-full">
            <CardTitle className="text-center mx-auto text-xl md:text-2xl">
              Analyst Estimates
            </CardTitle>
            <CardDescription>
              These are the estimates of growth by financial institutions - Take
              this with a grain of salt.
            </CardDescription>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Year</TableHead>
              <TableHead>Estimated EPS (Low)</TableHead>
              <TableHead>Estimated EPS (Avg)</TableHead>
              <TableHead>Estimated EPS (High)</TableHead>

              <TableHead>Estimated Growth </TableHead>
              <TableHead>Number of Analysts EPS </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analystEstimatesWithGrowth.map((year) => (
              <TableRow key={year.date}>
                <TableCell className="font-medium">
                  {year.date.slice(0, 4)}
                </TableCell>
                <TableCell className="font-medium">
                  {moneyFormatter(year.estimatedEpsLow)}
                </TableCell>
                <TableCell>{moneyFormatter(year.estimatedEpsAvg)}</TableCell>
                <TableCell>{moneyFormatter(year.estimatedEpsHigh)}</TableCell>
                <TableCell>
                  {year.growthRate !== null
                    ? percentFormatter(year.growthRate)
                    : "N/A"}
                </TableCell>
                <TableCell>{year.numberAnalystsEstimatedEps}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
