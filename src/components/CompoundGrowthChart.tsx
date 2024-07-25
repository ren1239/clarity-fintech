"use client";

//recharts requires being run on the client side

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import numeral from "numeral";

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

import { CombinedResult, SavingsData } from "@/types";
import { CalculateGrowth } from "./Calculations/CalculateGrowth";
import { CalculateExpenseLimit } from "./Calculations/CalculateExpenseLimit";
import { RadialPieClarity } from "./RadialPieClarity";
import { LivingExpenseChart } from "./Charts/LivingExpenseChart";

const chartConfig = {
  Networth: {
    label: "NetWorth",
  },
  compound: {
    label: "Compound",
    color: "hsl(var(--chart-2))",
  },
  standard: {
    label: "Standard",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const moneyFormatter = (value: number) => {
  return numeral(value).format("$0,0");
};

export default function CompoundGrowthChart({
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

  return (
    <div className=" space-y-4">
      <Card className="h-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row ">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Net Worth </CardTitle>
            <CardDescription className="text-xs">
              Simply by investing your money, you will have
              <span className="text-primary font-semibold">
                {moneyFormatter(compound - savings)}
              </span>
              more.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full "
          >
            <AreaChart data={combinedArray}>
              <defs>
                <linearGradient id="fillCompound" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-compound)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-compound)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillStandard" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-standard)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-standard)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => `Year ${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Year ${value}`}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="compound"
                type="natural"
                fill="url(#fillCompound)"
                stroke="var(--color-compound)"
                // stackId="a"
              />
              <Area
                dataKey="standard"
                type="natural"
                fill="url(#fillStandard)"
                stroke="var(--color-standard)"
                // stackId="a"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Mini Charts */}

      <div className="h-full flex flex-col md:flex-row space-3 gap-3">
        <LivingExpenseChart
          expenseLimit={expenseLimit}
          expectedExpense={expectedExpense}
        />

        {/* Detailed Charts */}
        <div className="flex gap-4 grow flex-col md:flex-row">
          <Card className="w-full">
            <div className="p-4 space-y-1 items-center justify-center flex-col flex  h-3/4">
              <CardTitle>{moneyFormatter(savings)}</CardTitle>
              <CardDescription className="text-center">
                Bankruptcy in {whereBankrupt?.year ? whereBankrupt?.year : 0}{" "}
                years
              </CardDescription>
            </div>
            <CardFooter className="flex items-center gap-2 space-y-0 border-t py-5 sm:flex-row">
              <CardTitle className="text-center mx-auto"> Saving</CardTitle>
            </CardFooter>
          </Card>
          <Card className="w-full ">
            <div className="p-4 space-y-1 items-center justify-center flex-col flex  h-3/4">
              <CardTitle>{moneyFormatter(compound)}</CardTitle>
              <CardDescription>Left over</CardDescription>
            </div>
            <CardFooter className="flex items-center gap-2 space-y-0 border-t py-5 sm:flex-row">
              <CardTitle className="text-center mx-auto"> Investing</CardTitle>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex flex-1 space-x-3 pt-2 h-[320px]  justify-between">
          <Card className="w-full">
            <div className="p-4 space-y-1 items-center justify-center flex-col flex  h-3/4">
              <CardTitle>{moneyFormatter(savings)}</CardTitle>
              <CardDescription className="text-center">
                Bankruptcy in {whereBankrupt?.year} years
              </CardDescription>
            </div>
            <CardFooter className="flex items-center gap-2 space-y-0 border-t py-5 sm:flex-row">
              <CardTitle className="text-center mx-auto"> Saving</CardTitle>
            </CardFooter>
          </Card>
          <Card className="w-full ">
            <div className="p-4 space-y-1 items-center justify-center flex-col flex  h-3/4">
              <CardTitle>{moneyFormatter(compound)}</CardTitle>
              <CardDescription>investing</CardDescription>
            </div>
            <CardFooter className="flex items-center gap-2 space-y-0 border-t py-5 sm:flex-row">
              <CardTitle className="text-center mx-auto"> Investing</CardTitle>
            </CardFooter>
          </Card>
          <Card className="w-full">
            <div className="p-4 space-y-1 items-center justify-center flex-col flex  h-3/4">
              <CardTitle>{moneyFormatter(expenseLimit)}</CardTitle>
              <CardDescription>Expense Limit</CardDescription>
            </div>
            <CardFooter className="flex items-center gap-2 space-y-0 border-t py-5 sm:flex-row ">
              <CardTitle className="text-center mx-auto"> Expense</CardTitle>
            </CardFooter>
          </Card>
        </div>*/
}
