"use client";

import { APIStockDataWrapper } from "@/APItypes";
import { moneyFormatter } from "@/components/Calculations/Formatter";
import { DcfValueCard } from "@/components/DcfCalculator/DcfValueCard";
import { FcfChartCard } from "@/components/DcfCalculator/FcfChartCard";
import { MarginOfSafetyCard } from "@/components/DcfCalculator/MarginOfSafetyCard";
import { StockPriceCard } from "@/components/DcfCalculator/StockPriceCard";
import { TableDialogue } from "@/components/DcfCalculator/TableDialogue";
import { DcfForm } from "@/components/DcfForm";

import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { dcfCalculationType, dcfResultsType } from "@/types";
import { dcfCalculation } from "@/components/Calculations/CalculateDcf";

type ExchangeRates = {
  [key: string]: {
    [key: string]: number;
  };
};

// Example exchange rates (replace with real API data)
const exchangeRates: ExchangeRates = {
  CNY: { USD: 0.15, HKD: 1.17 },
  USD: { CNY: 6.5, HKD: 7.8 },
  HKD: { USD: 0.13, CNY: 0.85 },
};

function convertCurrency(
  amount: number,
  fromCurrency: keyof ExchangeRates,
  toCurrency: keyof ExchangeRates
): number {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRates[fromCurrency][toCurrency];
}

export default function DCFCalculatorPage({
  data,
}: {
  data: APIStockDataWrapper;
}) {
  if (
    !data ||
    !data.companyProfile ||
    !data.balanceSheet ||
    !data.cashflowStatement ||
    !data.incomeStatement ||
    !data.financialGrowth
  ) {
    return (
      <div>
        <h1>404 - Not Found</h1>
        <p>No data available</p>
      </div>
    );
  }

  const calculateAverageGrowth = (data: APIStockDataWrapper) => {
    const growth = data?.financialGrowth?.slice(-5) ?? [];
    return growth.length === 5
      ? Number(
          (
            (growth.reduce((sum, year) => sum + year.revenueGrowth, 0) / 5) *
            80
          ).toFixed()
        )
      : 0;
  };

  const averageGrowth5Yr = calculateAverageGrowth(data);

  const stockCurrency = data.companyProfile.currency;
  const reportCurrency =
    data.companyProfile.country === "CN" ? "CNY" : stockCurrency;

  const convertIfNeeded = (amount: number) =>
    convertCurrency(amount, reportCurrency, stockCurrency);

  const [dcfResults, setDcfResults] = useState<dcfResultsType | null>(null);
  const [dcfInput, setDcfInput] = useState<dcfCalculationType>({
    stockPrice: data.marketPrice?.historical?.[0]?.close || 15,
    sharesOutstanding: data.incomeStatement?.[0]?.weightedAverageShsOut || 100,
    stGrowthRate: averageGrowth5Yr || 9,
    ltGrowthRate: averageGrowth5Yr / 2 || 5,
    discountRate: 9,
    terminalValue: 15,
    stockBasedComp:
      convertIfNeeded(data.cashflowStatement?.[0]?.stockBasedCompensation) || 0,
    netCashDebt: convertIfNeeded(data.balanceSheet?.[0]?.netDebt) || 0,
    fcf: convertIfNeeded(data.cashflowStatement?.[0]?.freeCashFlow) || 100,
    simpleCalculation: false,
  });

  useEffect(() => {
    if (dcfInput) {
      const results = dcfCalculation(dcfInput);
      setDcfResults(results);
    }
  }, [dcfInput]);

  return (
    <div className="flex-1 pt-4 items-center flex flex-col min-h-[calc(100vh-4.5rem)] justify-center">
      <div className="w-3/4 mx-auto grow flex-col space-y-4 min-h-full">
        {/* Top Banner */}
        <Card className="flex flex-row items-center justify-between gap-4 py-2 bg-neutral-100">
          <div className="flex items-center gap-x-6 px-4">
            <div className="flex w-20 h-20 p-4 border-2 rounded-full items-center justify-center bg-neutral-200 overflow-hidden">
              <Image
                src={data.companyProfile.image}
                alt={data.companyProfile.companyName}
                width={100}
                height={100}
                style={{ backgroundSize: "cover" }}
              />
            </div>
            <div>
              <CardTitle>
                {data.companyProfile.companyName}
                <span className="italic font-light text-sm">
                  ({data.companyProfile.symbol})
                </span>
              </CardTitle>
              <CardDescription>
                {data.companyProfile.exchange} || {data.companyProfile.industry}
              </CardDescription>
            </div>
          </div>

          {/* Market Price */}
          <div className="flex gap-x-2 items-center px-4">
            <p className="text-2xl font-semibold">
              {moneyFormatter(data.companyProfile.price)}
            </p>

            {data.companyProfile.changes >= 0 ? (
              <p className="text-green-600 flex">
                <ArrowBigUp />
                {moneyFormatter(data.companyProfile.changes)}
              </p>
            ) : (
              <p className="text-red-600 flex">
                <ArrowBigDown />
                {moneyFormatter(data.companyProfile.changes)}
              </p>
            )}
          </div>
        </Card>

        {/* DCF Banner */}
        <div className="mx-auto w-full grow lg:flex gap-x-4 space-y-4 lg:space-y-0 h-full">
          {/* Left Side */}
          <div className="flex-1">
            <Card className="p-3 relative">
              <div className="absolute top-4 left-4">
                <TableDialogue dcfResults={dcfResults} />
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
              />
            </Card>
          </div>

          {/* Right Side */}
          <div className="flex-col shrink-0 flex-[.7] lg:w-[400px] space-y-4 sticky top-16 h-full">
            <div className="flex space-x-4 text-xs h-[225px]">
              <StockPriceCard dcfInput={dcfInput} dcfResults={dcfResults} />

              <MarginOfSafetyCard dcfInput={dcfInput} dcfResults={dcfResults} />
            </div>
            <DcfValueCard dcfResults={dcfResults} />
          </div>
        </div>

        {/* Bottom Side */}
        <div className="grow px-6 xl:px-8 gap-x-4 space-y-4 h-full">
          {/* <FcfChartCard dcfResults={dcfResults} /> */}
        </div>
      </div>
    </div>
  );
}
