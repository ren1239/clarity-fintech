"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import { useMemo, useState } from "react";
import { subDays, subMonths, subYears } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { moneyFormatter } from "../Calculations/Formatter";

interface portfolioValueType {
  date: string;
}

export function PortfolioChart({
  portfolioMarketData,
  portfolioSymbols,
  totalPortfolioValue,
}: {
  portfolioMarketData: portfolioValueType[];
  portfolioSymbols: string[];
  totalPortfolioValue: number | null;
}) {
  const [timeRange, setTimeRange] = useState("1M");

  const historicalData = useMemo(
    () => (portfolioMarketData ? portfolioMarketData : []),
    [portfolioMarketData]
  );

  const filteredData: portfolioValueType[] = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    // Ensure historicalData is sorted by date
    const sortedHistoricalData = historicalData.slice().sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

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
      case "5Y":
        startDate = subYears(now, 5);
        break;
      case "All":
        startDate = subYears(now, 20);
        break;
      default:
        throw new Error(`Unexpected timeRange value: ${timeRange}`);
    }

    // Filter the sorted data based on the time range
    const filteredData = sortedHistoricalData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });

    // Further reduce the data points for "5Y" and "All" time ranges
    if (timeRange === "All") {
      return filteredData.filter((item, index) => index % 50 === 0);
    } else if (timeRange === "5Y") {
      return filteredData.filter((item, index) => index % 20 === 0);
    } else if (timeRange === "1Y") {
      return filteredData.filter((item, index) => index % 5 === 0);
    } else {
      return filteredData;
    }
  }, [timeRange, historicalData]);

  if (!portfolioMarketData || !portfolioSymbols) {
    return <div>Loading...</div>;
  }

  let chartConfig = {} satisfies ChartConfig;

  chartConfig = portfolioSymbols.map((symbol) => ({
    symbol: symbol,
    color: "hsl(var(--chart-2))",
  }));

  // Type definition for HSL color components
  type HSLColor = {
    h: number;
    s: number;
    l: number;
  };

  // Function to parse an HSL string into an object with h, s, l properties
  const parseHSL = (hsl: string): HSLColor => {
    const [h, s, l] = hsl.match(/\d+/g)!.map(Number); // The `!` tells TypeScript you are sure that match will not return null
    return { h, s, l };
  };

  // Function to interpolate between two numbers
  const interpolate = (start: number, end: number, factor: number): number => {
    return Math.round(start + (end - start) * factor);
  };

  // Function to interpolate between two HSL colors
  const interpolateHSL = (
    hsl1: string,
    hsl2: string,
    factor: number
  ): string => {
    const hsl1Parsed = parseHSL(hsl1);
    const hsl2Parsed = parseHSL(hsl2);

    const h = interpolate(hsl1Parsed.h, hsl2Parsed.h, factor);
    const s = interpolate(hsl1Parsed.s, hsl2Parsed.s, factor);
    const l = interpolate(hsl1Parsed.l, hsl2Parsed.l, factor);

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // Example usage
  const color2 = "123 58% 79%"; // A slightly different shade of reddish-orange
  const color1 = "173 58% 40%"; // The original reddish-orange color

  return (
    <Card>
      <CardHeader>
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>
            Total Portfolio Value -{" "}
            {totalPortfolioValue !== null
              ? moneyFormatter(totalPortfolioValue)
              : "N/A"}
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
        <ChartContainer config={chartConfig} className="h-[450px] aspect-auto">
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
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

            {portfolioSymbols.map((symbol, index) => {
              const factor = index / (portfolioSymbols.length - 1); // Normalize index to [0, 1]
              const fillColor = interpolateHSL(color1, color2, factor);

              return (
                <Area
                  key={symbol}
                  dataKey={symbol}
                  type="natural"
                  fill={`${fillColor}`}
                  fillOpacity={0.4}
                  stroke={`${fillColor}`}
                  stackId="a"
                />
              );
            })}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
