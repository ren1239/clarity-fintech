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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { GrowthTableDialogue } from "./GrowthTableDialogue";

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

  const [timeRange, setTimeRange] = useState("10 years");

  const filteredData = useMemo(() => {
    if (timeRange === "10 years") {
      return chartData.slice(chartData.length - 10, chartData.length);
    } else if (timeRange === "5 years") {
      return chartData.slice(chartData.length - 5, chartData.length);
    } else if (timeRange === "3 years") {
      return chartData.slice(chartData.length - 3, chartData.length);
    }
    return [];
  }, [timeRange, chartData]);

  const averageResults = calculateAverages(filteredData, chartKeyArray);

  return (
    <div className=" lg:w-3/4 lg:px-0 w-full px-4 ">
      <Card className="">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>
              Growth Chart -
              {filteredData.length > 0 ? filteredData[0].symbol : "N/A"}
            </CardTitle>
            <CardDescription>
              {filteredData.length
                ? `${filteredData[0].calendarYear} - ${
                    filteredData[filteredData.length - 1].calendarYear
                  }`
                : ""}
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="10 years" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem className="rounded-lg" value={"10 years"}>
                Last 10 years
              </SelectItem>
              <SelectItem className="rounded-lg" value={"5 years"}>
                Last 5 years
              </SelectItem>
              <SelectItem className="rounded-lg" value={"3 years"}>
                Last 3 years
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-x-8 mt-4 gap-y-8">
          <ChartContainer
            className=" w-full min-w-[250px] h-[150px] md:min-h-[500px]"
            config={chartConfig}
          >
            <LineChart
              accessibilityLayer
              data={filteredData}
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
                  <ChartTooltipContent indicator="line" percent={true} />
                }
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

              <ChartLegend
                content={<ChartLegendContent />}
                className="hidden md:flex"
              />
            </LineChart>
          </ChartContainer>
          <GrowthChartLegend
            chartConfigArray={chartConfigArray}
            visibleLines={visibleLines}
            toggleLineVisibility={toggleLineVisibility}
            averageResults={averageResults}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <GrowthTableDialogue filteredData={filteredData} />
        </CardFooter>
      </Card>
    </div>
  );
}
