"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
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
import { APIFinancialGrowthType } from "@/APItypes";
import { useMemo } from "react";

const chartConfig = {
  revenueGrowth: {
    label: "revenueGrowth",
    color: "hsl(var(--chart-1))",
  },
  freeCashFlowGrowth: {
    label: "freeCashFlowGrowth",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Helper function to convert to percent
const toPercent = (decimal: number) => `${(decimal * 100).toFixed(0)}%`;

export function GrowthChartCard({
  financialGrowth,
}: {
  financialGrowth: APIFinancialGrowthType[] | null;
}) {
  const chartData = useMemo(() => {
    if (Array.isArray(financialGrowth)) {
      return financialGrowth.slice().reverse();
    }
    return [];
  }, [financialGrowth]);

  return (
    <Card className="w-2/3">
      <CardHeader>
        <CardTitle>
          Growth Chart - {chartData.length > 0 ? chartData[0].symbol : "N/A"}
        </CardTitle>
        <CardDescription>
          {chartData.length
            ? `${chartData[0].calendarYear} - ${
                chartData[chartData.length - 1].calendarYear
              }`
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="calendarYear"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value: any, name) =>
                    `${name}  ${toPercent(value)}`
                  }
                />
              }
            />
            <Line
              dataKey="revenueGrowth"
              type="linear"
              stroke="var(--color-revenueGrowth)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenueGrowth)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => toPercent(value)}
              />
            </Line>
            <Line
              dataKey="freeCashFlowGrowth"
              type="linear"
              stroke="var(--color-freeCashFlowGrowth)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-freeCashFlowGrowth)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => toPercent(value)}
              />
            </Line>
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
