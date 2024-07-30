"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

import { dcfResultsType } from "@/types";
import { moneyFormatter } from "../Calculations/Formatter";

const chartConfig = {
  freeCashFlow: {
    label: "FreeCashFlow",
  },
  fcf: {
    label: "Total Cash",
    color: "hsl(var(--chart-1))",
  },
  pvFcf: {
    label: "Present Day Value ",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function FcfChartCard({
  dcfResults,
}: {
  dcfResults: dcfResultsType | null;
}) {
  const chartData = dcfResults?.fcfArray
    ? dcfResults.fcfArray.slice(0, -1)
    : [];

  const cumulativePvFcf = dcfResults?.totalPvFcf ?? 0;
  const cumulativeFcf = dcfResults?.totalFcf ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Free Cash Flow </CardTitle>
          <CardDescription>
            Showing the value that {moneyFormatter(cumulativeFcf)} in 10 years
            is only worth {moneyFormatter(cumulativePvFcf)} today.
          </CardDescription>
        </div>
        <div className="flex">
          <button className="relative z-30 flex flex-2 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              Total Free Cash Flow
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {moneyFormatter(cumulativeFcf)}
            </span>
          </button>
          <button className="relative z-30 flex flex-2 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              Present Day Value
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {moneyFormatter(cumulativePvFcf)}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pvFcf)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pvFcf)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-fcf)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-fcf)"
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
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="fcf"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-fcf)"
            />
            <Area
              dataKey="pvFcf"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-pvFcf)"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
