"use client";

import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
} from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { moneyFormatter } from "../Calculations/Formatter";
const chartData = [
  { month: "January", visitors: 186 },
  { month: "February", visitors: 205 },
  { month: "March", visitors: -207 },
  { month: "April", visitors: 173 },
  { month: "May", visitors: -209 },
  { month: "June", visitors: 214 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;

export function CoreGrowthChart({
  title,
  chartKey,
  data,
}: {
  title: string;
  chartKey: string;
  data: any[];
}) {
  const chartData = useMemo(() => data.slice().reverse(), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[120px] aspect-auto">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => moneyFormatter(Number(value))}
                  hideIndicator
                  hidden
                />
              }
            />
            <XAxis
              dataKey="calendarYear"
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              tickFormatter={(value) => value.slice(2, 4)}
            />
            <Area
              dataKey={chartKey}
              type="step"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.1}
              stroke="hsl(var(--chart-2))"
            ></Area>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
