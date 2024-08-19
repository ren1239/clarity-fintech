"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";
import { subDays, subMonths, subYears } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { moneyFormatter } from "../Calculations/Formatter";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const chartConfig = {
  totalValue: {
    label: "Total Value",
    color: "hsl(var(--chart-2))",
  },
  breakdown: {
    label: "Breakdown",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface PortfolioValueDataType {
  totalValue: number;
  breakdown: {
    [ticker: string]: number;
  };
  date: string;
}

export function PortfolioValueChart({
  portfolioValueData,
}: {
  portfolioValueData: PortfolioValueDataType[];
}) {
  const [timeRange, setTimeRange] = useState("6M");
  const [displayMode, setDisplayMode] = useState<string>("totalValue");

  const historicalData = useMemo(
    () => (portfolioValueData ? portfolioValueData : []),
    [portfolioValueData]
  );

  const filteredData: PortfolioValueDataType[] = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "1W":
        startDate = subDays(now, 7);
        break;
      case "1M":
        startDate = subMonths(now, 1);
        break;
      case "6M":
        startDate = subMonths(now, 6);
        break;
      case "1Y":
        startDate = subYears(now, 1);
        break;
      case "3Y":
        startDate = subYears(now, 3);
        break;
      case "5Y":
        startDate = subYears(now, 5);
        break;
      case "All":
        startDate = subYears(now, 20);
        break;
      default:
        throw new Error(`Unexpected timeRange value: ${timeRange}`);
    }

    // Filter the data based on the time range
    const filteredData = historicalData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });

    // Further reduce the data points for "5Y" and "All" time ranges
    if (timeRange === "All") {
      return filteredData.filter((item, index) => index % 50 === 0);
    } else if (timeRange === "5Y") {
      return filteredData.filter((item, index) => index % 30 === 0);
    } else if (timeRange === "3Y") {
      return filteredData.filter((item, index) => index % 20 === 0);
    } else if (timeRange === "1Y") {
      return filteredData.filter((item, index) => index % 10 === 0);
    } else {
      return filteredData;
    }
  }, [timeRange, historicalData]);

  const totalPortfolioValue = filteredData[filteredData.length - 1].totalValue;

  const chartConfigMulti = Object.keys(
    filteredData[filteredData.length - 1].breakdown
  ).reduce((acc, ticker, index) => {
    acc[ticker] = {
      label: ticker, // Each ticker as the label
      color: "hsl(var(--chart-2))",
    };
    return acc;
  }, {} as ChartConfig);

  console.log(chartConfigMulti);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>
            {displayMode === "totalValue"
              ? `Total Portfolio Value - ${
                  totalPortfolioValue !== null
                    ? moneyFormatter(totalPortfolioValue)
                    : "N/A"
                }`
              : "Portfolio Breakdown"}
          </CardTitle>
          <CardDescription className="">
            A detailed look across your portfolio
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="5 Years" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem className="rounded-lg" value="1W">
              1 Week
            </SelectItem>
            <SelectItem className="rounded-lg" value="1M">
              1 Month
            </SelectItem>
            <SelectItem className="rounded-lg" value="6M">
              6 Months
            </SelectItem>
            <SelectItem className="rounded-lg" value="1Y">
              1 Year
            </SelectItem>
            <SelectItem className="rounded-lg" value="3Y">
              3 Years
            </SelectItem>
            <SelectItem className="rounded-lg" value="5Y">
              5 Years
            </SelectItem>
            <SelectItem className="rounded-lg" value="All">
              All
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={displayMode === "totalValue" ? chartConfig : chartConfigMulti}
          className="w-full min-w-[250px] h-[150px] md:min-h-[500px]"
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={64}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (timeRange === "1M") {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } else {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  });
                }
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {displayMode === "totalValue" ? (
              <Area
                dataKey="totalValue"
                fill="var(--color-totalValue)"
                fillOpacity={0.4}
                stroke="var(--color-totalValue)"
              />
            ) : (
              Object.keys(filteredData[0].breakdown).map((ticker) => (
                <Area
                  key={ticker}
                  dataKey={(data) => data.breakdown[ticker]}
                  name={ticker}
                  fillOpacity={0.2}
                  stroke="hsl(var(--chart-4))"
                  fill="hsl(var(--chart-4))"
                  stackId="a"
                />
              ))
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-end">
        <ToggleGroup
          type="single"
          size="sm"
          value={displayMode}
          onValueChange={(mode) => setDisplayMode(mode)}
        >
          <ToggleGroupItem value="totalValue">Total Value</ToggleGroupItem>
          <ToggleGroupItem value="breakdown">Breakdown</ToggleGroupItem>
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
}
