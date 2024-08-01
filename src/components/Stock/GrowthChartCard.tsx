"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
import { useMemo, useState } from "react";
import { GrowthChartLegend } from "./GrowthChartLegend";
import { calculateAverages } from "./CalculateAverages";

const chartConfig = {
  revenueGrowth: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  freeCashFlowGrowth: {
    label: "Free Cash Flow",
    color: "hsl(var(--chart-2))",
  },
  netIncomeGrowth: {
    label: "Net Income",
    color: "hsl(var(--chart-3))",
  },
  epsgrowth: {
    label: "Earnings",
    color: "hsl(var(--chart-4))",
  },
  bookValueperShareGrowth: {
    label: "Book Value",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

//Helper functions to convert ChartConfig into Arrays

const chartConfigArray = Object.entries(chartConfig).map(([key, value]) => ({
  key,
  ...value,
}));

console.log("arrya", chartConfigArray);

const chartKeyArray = chartConfigArray.map((obj) => obj.key);

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

  // Initial state setup for visibility of chart lines

  const [visibleLines, setVisibleLines] = useState(() => {
    // Initialize an empty object to store visibility state
    const initialVisibilityState = {} as { [key: string]: boolean };

    // Convert chartConfig to an array and populate initialVisibilityState
    Object.entries(chartConfig).forEach(([key, value]) => {
      initialVisibilityState[key] = true;
    });

    // Return the initial state object
    return initialVisibilityState;
  });

  // Prev state is the object holds all the line visibility
  const toggleLineVisibility = (key: string) => {
    setVisibleLines((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const averageResults = calculateAverages(chartData, chartKeyArray);

  return (
    <Card className="w-2/3">
      <CardHeader className="border-b mb-4">
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
      <CardContent className="flex gap-x-4">
        <ChartContainer className=" w-full min-w-[350px]" config={chartConfig}>
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

            <YAxis
              // dataKey="calendarYear"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value * 100 + "%"}
            />
            <XAxis
              dataKey="calendarYear"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" percent={true} />}
            />

            {/* Render lines conditionally based on visibility */}
            {visibleLines.revenueGrowth && (
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
              />
            )}

            {visibleLines.freeCashFlowGrowth && (
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
              />
            )}

            {visibleLines.netIncomeGrowth && (
              <Line
                dataKey="netIncomeGrowth"
                type="linear"
                stroke="var(--color-netIncomeGrowth)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-netIncomeGrowth)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            )}

            {visibleLines.epsgrowth && (
              <Line
                dataKey="epsgrowth"
                type="linear"
                stroke="var(--color-epsgrowth)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-epsgrowth)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            )}

            {visibleLines.bookValueperShareGrowth && (
              <Line
                dataKey="bookValueperShareGrowth"
                type="linear"
                stroke="var(--color-bookValueperShareGrowth)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-bookValueperShareGrowth)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            )}

            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
        <GrowthChartLegend
          chartConfigArray={chartConfigArray}
          visibleLines={visibleLines}
          toggleLineVisibility={toggleLineVisibility}
          averageResults={averageResults}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t ">
        <div className="flex gap-2 font-medium leading-none mt-4">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
