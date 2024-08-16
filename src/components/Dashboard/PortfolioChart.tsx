"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { moneyFormatter, percentFormatter } from "../Calculations/Formatter";

interface portfolioValueType {
  date: string;
  [key: string]: number | string;
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

    // Filter the sorted data based on the time range
    const filteredData = sortedHistoricalData.filter((item) => {
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
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
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
            <SelectItem className="rounded-lg" value="3Y">
              3 Year
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
      <CardContent className="flex flex-col lg:flex-row gap-x-8 mt-4 gap-y-8">
        <ChartContainer
          config={chartConfig}
          className=" w-full min-w-[250px] h-[150px] md:min-h-[500px]"
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

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
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
        <PortfolioLegend filteredData={filteredData} />
      </CardContent>
    </Card>
  );
}

export function PortfolioLegend({
  filteredData,
}: {
  filteredData: portfolioValueType[];
}) {
  // Use useMemo to ensure startData and endData update with filteredData
  const startData = useMemo(() => filteredData[0], [filteredData]);
  const endData = useMemo(
    () => filteredData[filteredData.length - 1],
    [filteredData]
  );

  let difference: { [key: string]: number } = {};
  let percentageDifference: { [key: string]: number } = {};

  // Calculate the cumulative total for startData and endData excluding the date key
  const totalStart = Object.keys(startData)
    .filter((key) => key !== "date")
    .reduce((acc, key) => acc + Number(startData[key]), 0);

  const totalEnd = Object.keys(endData)
    .filter((key) => key !== "date")
    .reduce((acc, key) => acc + Number(endData[key]), 0);

  const totalDifference = totalEnd - totalStart;

  // Calculate the cumulative percentage difference
  const totalPercentageDifference =
    totalStart !== 0 ? totalDifference / totalStart : 0;

  Object.keys(endData)
    .filter((key) => key !== "date")
    .forEach((stock) => {
      const startValue = Number(startData[stock]);
      const endValue = Number(endData[stock]);

      difference[stock] = endValue - startValue;

      // Calculate percentage difference for individual stocks
      percentageDifference[stock] =
        startValue !== 0 ? (difference[stock] / startValue) * 100 : 0;
    });

  return (
    <Card className="flex flex-col min-w-[250px] lg:h-[500px] justify-between">
      <CardHeader className="mb-4">
        <CardTitle>Company</CardTitle>
        <CardDescription>value change</CardDescription>
      </CardHeader>
      <CardContent className=" overflow-y-scroll">
        {Object.keys(endData)
          .filter((key) => key !== "date")
          .map((stock) => {
            return (
              <div className="flex justify-between text-sm" key={stock}>
                <p className="font-semibold">{stock}</p>
                <div></div>
                <p
                  className={`${
                    difference[stock] >= 0 ? "bg-green-200" : "bg-red-200"
                  } px-2 rounded-sm w-20 flex justify-center items-center text-center`}
                >
                  {moneyFormatter(Number(difference[stock]))}
                </p>
              </div>
            );
          })}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t ">
        <div className="flex gap-2 font-semibold leading-none mt-4 text-xl">
          Change:{" "}
          <span className="text-sm italic font-light">
            ({percentFormatter(totalPercentageDifference)})
          </span>
        </div>
        <div className="leading-none font-bold text-primary text-right w-full text-2xl">
          {moneyFormatter(totalDifference)}
        </div>
      </CardFooter>
    </Card>
  );
}
