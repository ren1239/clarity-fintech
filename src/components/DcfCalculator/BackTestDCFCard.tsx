import { format, parseISO } from "date-fns";

interface backtestResultsType {
  year: string;
  dcfValue: number;
}

interface backtestMarketType {
  year: string;
  dcfValue: number;
  marketPrice: number;
}

type DCFPriceComparisonType = "exceeds" | "isBelow" | "fallsWithin";

interface MarketDataType {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  year?: string;
}

export default function BackTestDCFCard({
  dcfInput,
  analystEstimates,
  financialGrowth,
  cashflowStatement,
  dcfResults,
  balanceSheet,
  incomeStatement,
  marketPrice,
}: {
  dcfInput: dcfCalculationType | null;
  analystEstimates: APIAnalystEstimatesType[] | null;
  financialGrowth: APIFinancialGrowthType[] | null;
  cashflowStatement: APICashflowStatementType[] | null;
  dcfResults: dcfResultsType | null;
  balanceSheet: APIBalanceSheetType[] | null;
  incomeStatement: APIIncomeStatementType[] | null;
  marketPrice: APIMarketPriceType | null;
}) {
  if (
    !analystEstimates ||
    !dcfInput ||
    !financialGrowth ||
    !cashflowStatement ||
    !dcfResults ||
    !balanceSheet ||
    !incomeStatement ||
    !marketPrice
  ) {
    return <div>Loading...</div>;
  }

  //Safely extract reported currency and stock currency
  const { reportedCurrency = "" } = dcfInput ?? {};
  const { stockCurrency = "" } = dcfInput ?? {};

  // Creating a prediction model without hindsight for last 10 years
  const backtestResults: backtestResultsType[] = [];

  for (let yearsBack = 1; yearsBack <= cashflowStatement.length; yearsBack++) {
    const backtestInputData = { ...dcfInput };
    const prevFCF = cashflowStatement[yearsBack - 1].freeCashFlow;
    backtestInputData.fcf = prevFCF;

    const backtestCalculationResult = dcfCalculation(backtestInputData);
    const convertedCurrency = convertCurrency(
      backtestCalculationResult.dcfValue,
      reportedCurrency,
      stockCurrency
    );
    const currCalanderYear = cashflowStatement[yearsBack - 1].calendarYear;

    backtestResults.unshift({
      year: currCalanderYear,
      dcfValue: convertedCurrency,
    });
  }

  // Replicate DCF results across 12 months
  const replicatedBacktestResults = backtestResults.flatMap((item) => {
    return Array.from({ length: 12 }, (_, index) => ({
      year: `${item.year}-${String(index + 1).padStart(2, "0")}`,
      dcfValue: item.dcfValue,
    }));
  });

  // Extract first data point for each month in the historic price chart
  const monthlyMarketData: MarketDataType[] = [];
  let currentMonth = "";

  marketPrice.historical.map((data) => {
    const dateObj = parseISO(data.date);
    const monthKey = format(dateObj, "yyyy-MM");

    // spread the data and only change the date to the monthkey when it is the fist data point
    if (monthKey !== currentMonth) {
      monthlyMarketData.push({ ...data, date: monthKey });
      currentMonth = monthKey;
    }
  });

  //Safely handle null inputs
  let previousValue: number | 0;

  //Merge the data market data and DCF value into one arry using the 'year' field.

  const mergedData = replicatedBacktestResults.map((dcfEntry) => {
    const marketEntry = monthlyMarketData.find(
      (marketData) => marketData.date === dcfEntry.year
    );

    if (marketEntry) {
      previousValue = marketEntry.open;
    }

    return {
      ...dcfEntry,
      marketPrice: marketEntry ? marketEntry.open : previousValue,
    };
  });

  return (
    <>
      <BacktestDcfChart replicatedBacktestResults={mergedData} />
    </>
  );
}

import { Bar, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertCurrency } from "../Calculations/Formatter";
import { dcfCalculation } from "../Calculations/CalculateDcf";
import { dcfCalculationType, dcfResultsType } from "@/types";
import {
  APIAnalystEstimatesType,
  APIBalanceSheetType,
  APICashflowStatementType,
  APIFinancialGrowthType,
  APIIncomeStatementType,
  APIMarketPriceType,
} from "@/APItypes";
import { useEffect, useState } from "react";

const chartConfig = {
  dcfValue: {
    label: "Historic DCF Value",
    color: "hsl(var(--chart-4))",
  },
  marketPrice: {
    label: "Historic Market Price",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function BacktestDcfChart({
  replicatedBacktestResults,
}: {
  replicatedBacktestResults: backtestMarketType[] | null;
}) {
  if (replicatedBacktestResults) {
    const [DCFPriceComparison, setDCFPriceComparison] =
      useState<DCFPriceComparisonType>("fallsWithin");

    useEffect(() => {
      let allExceed = true;
      let allBelow = true;

      for (let month of replicatedBacktestResults) {
        if (month.dcfValue > month.marketPrice) {
          allExceed = false;
        } else if (month.dcfValue < month.marketPrice) {
          allBelow = false;
        }
        if (!allBelow && !allExceed) {
          setDCFPriceComparison("fallsWithin");
          break;
        }
      }

      if (allBelow) {
        setDCFPriceComparison("isBelow");
      } else if (allExceed) {
        setDCFPriceComparison("exceeds");
      } else {
        setDCFPriceComparison("fallsWithin");
      }
    }, [replicatedBacktestResults]);

    const descriptions = {
      exceeds: `This company has historically traded above its intrinsic value. It implies that investors have consistently placed a premium on the stock, perhaps due to high growth expectations, strong brand equity, or market inefficiencies. The market has historically paid a premium to invest in this company.`,
      isBelow: `This company has historically traded below its intrinsic value. It suggests that the market may have consistently underappreciated the company, perhaps due to lack of visibility, market sentiment, or other factors. Despite strong cash flow or fundamentals, the market has not rewarded the stock accordingly.`,
      fallsWithin: `This company has experienced periods where it was both undervalued and overvalued relative to its intrinsic value. It implies that the market has, at different times, either overvalued or undervalued the stock. This suggests that there have been opportunities in the past to invest at a fair value.`,
    };

    const valueTitles = {
      exceeds: "Consistently Overvalued",
      isBelow: "Persistently Undervalued",
      fallsWithin: "Historically Balanced",
    };

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Historic DCF Valuation</CardTitle>
          <CardDescription>
            DCF valuation overlayed upon Historic Data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-[300px] aspect-auto"
          >
            <ComposedChart
              accessibilityLayer
              data={replicatedBacktestResults}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(2, 4)}
                minTickGap={64}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Bar
                dataKey="dcfValue"
                type="linear"
                radius={8}
                fill="var(--color-dcfValue)"
                fillOpacity={0.5}
                stroke="var(--color-dcfValue)"
              />
              <Line
                dataKey="marketPrice"
                type="natural"
                fill="var(--color-marketPrice)"
                fillOpacity={0.2}
                stroke="var(--color-marketPrice)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="3 3"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none items-center ">
            Analysis:
            <span
              className={`p-2 rounded-md ${
                DCFPriceComparison === "exceeds"
                  ? "bg-red-200"
                  : DCFPriceComparison === "isBelow"
                  ? "bg-green-200"
                  : "bg-orange-200"
              }`}
            >
              {valueTitles[DCFPriceComparison]}
            </span>
          </div>
          <div className="leading-none text-muted-foreground">
            {descriptions[DCFPriceComparison]}
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (!replicatedBacktestResults) return <>Loading...</>;
}
