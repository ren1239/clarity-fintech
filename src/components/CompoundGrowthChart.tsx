"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import numeral from "numeral";

import {
  Card,
  CardContent,
  CardDescription,
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

import { CombinedResult, FormValueTypes } from "@/types";
import { useEffect, useState } from "react";

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

type SavingsData = {
  principal: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  numberOfSavingYears: number;
  contribution: number;
  id: string;
};

export default function CompoundGrowthChart({
  stateSavingsData,
}: {
  stateSavingsData: SavingsData;
}) {
  const [combinedArray, setCombinedArray] = useState<CombinedResult[]>([]);

  const [formValues, setFormValues] = useState<FormValueTypes>({
    principal: stateSavingsData?.principal || 1000,
    rateOfReturn: stateSavingsData?.rateOfReturn || 0.07,
    numberOfCompoundingYears: stateSavingsData?.numberOfCompoundingYears || 30,
    numberOfSavingYears: stateSavingsData?.numberOfSavingYears || 30,
    contribution: stateSavingsData?.contribution || 1000,
  });

  useEffect(() => {
    setFormValues(stateSavingsData);
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
  }, [formValues, stateSavingsData]);

  const [savings, setSavings] = useState<number>(0);
  const [compound, setCompound] = useState<number>(0);

  useEffect(() => {
    if (combinedArray.length > 1) {
      setSavings(combinedArray[combinedArray.length - 1].standard);
      setCompound(combinedArray[combinedArray.length - 1].compound);
    }
  }, [combinedArray]);

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Net Worth - Compounding</CardTitle>
          <CardDescription className="text-xs">
            Simply by investing your money, you will have
            <span className="text-primary font-semibold">
              {moneyFormatter(compound - savings)}
            </span>
            more.
          </CardDescription>
        </div>
        <div className="flex space-x-3 pt-2">
          <Card>
            <div className="p-4 space-y-1">
              <CardTitle>{moneyFormatter(savings)}</CardTitle>
              <CardDescription>saving</CardDescription>
            </div>
          </Card>
          <Card>
            <div className="p-4 space-y-1">
              <CardTitle>{moneyFormatter(compound)}</CardTitle>
              <CardDescription>investing</CardDescription>
            </div>
          </Card>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[480px] w-full "
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
              dataKey="standard"
              type="natural"
              fill="url(#fillStandard)"
              stroke="var(--color-standard)"
              stackId="a"
            />
            <Area
              dataKey="compound"
              type="natural"
              fill="url(#fillCompound)"
              stroke="var(--color-compound)"
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

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

  // year 1 - 10 000 ,

  for (let year = 1; year <= years; year++) {
    // Compound interest calculation
    compoundAmount *= rate + 1;

    // Standard (simple) interest calculation
    standardAmount += 0;

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
