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

import {
  RetirementDataType,
  RetirementFormType,
  RetirementArrayType,
} from "@/types";
import { useEffect, useState } from "react";

//setup the chart config
const chartConfig = {
  networth: {
    label: "NetWorth",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const moneyFormatter = (value: number) => {
  return numeral(value).format("$0,0");
};

export default function RetirementChart({
  stateRetirementData,
}: {
  stateRetirementData: RetirementDataType;
}) {
  const [calculationArray, setCalculationArray] = useState<
    RetirementArrayType[]
  >([]);

  const [retirementFormValues, setRetirementFormValues] =
    useState<RetirementFormType>({
      retirementAmount: stateRetirementData?.retirementAmount || 1000000,
      rateOfReturn: stateRetirementData?.rateOfReturn || 0.07,
      numberOfCompoundingYears:
        stateRetirementData?.numberOfCompoundingYears || 30,
      annualExpenses: stateRetirementData?.annualExpenses || 35000,
    });

  useEffect(() => {
    // if the state changes,  the useeffect will change the form values
    setRetirementFormValues(stateRetirementData);
    const {
      retirementAmount,
      rateOfReturn,
      numberOfCompoundingYears,
      annualExpenses,
    } = retirementFormValues;

    const totals = calculateRetirement(retirementFormValues);

    setCalculationArray(totals);
  }, [retirementFormValues, stateRetirementData]);

  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);

  useEffect(() => {
    if (calculationArray.length > 1) {
      setStart(calculationArray[0].networth);
      setEnd(calculationArray[calculationArray.length - 1].networth);
    }
  }, [calculationArray, stateRetirementData]);

  return (
    <Card className="h-full">
      {/* Card Header */}

      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className=" grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle> Net Worth - Retirement</CardTitle>
          <CardDescription className="text-xs">
            Simply by planning out your retirement, you will still have
            <span className="text-primary font-semibold">
              {moneyFormatter(end)}
            </span>
            after you pass.
          </CardDescription>
        </div>
        <div className="flex space-x-3 pt-2">
          <Card>
            <div className="p-4 space-y-1">
              <CardTitle>{moneyFormatter(start)}</CardTitle>
              <CardDescription>start</CardDescription>
            </div>
          </Card>
          <Card>
            <div className="p-4 space-y-1">
              <CardTitle>{moneyFormatter(end)}</CardTitle>
              <CardDescription>end</CardDescription>
            </div>
          </Card>
        </div>
      </CardHeader>

      {/* Chart Body */}
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[480px] w-full"
        >
          <AreaChart data={calculationArray}>
            <defs>
              <linearGradient id="fillNetworth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-networth)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-networth)"
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
              dataKey="networth"
              type="natural"
              fill="url(#fillNetworth)"
              stroke="var(--color-networth)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const calculateRetirement = ({
  retirementAmount,
  rateOfReturn,
  numberOfCompoundingYears,
  annualExpenses,
}: RetirementFormType): RetirementArrayType[] => {
  let netWorth = retirementAmount;

  const totals: RetirementArrayType[] = [];

  for (let year = 1; year < numberOfCompoundingYears; year++) {
    //changing the net worth in each itteration
    if (netWorth > 0) {
      netWorth *= rateOfReturn + 1;
      netWorth -= annualExpenses;
    } else {
      netWorth = 0;
    }

    totals.push({
      year: year.toString(),
      networth: parseFloat(netWorth.toFixed()),
    });
  }
  return totals;
};
