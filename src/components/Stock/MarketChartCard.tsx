"use client";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MarketPriceType, APIMarketPriceType } from "@/APItypes";
import { subMonths, subYears } from "date-fns";

const chartConfig = {
  open: {
    label: "Market Price",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MarketChartCard({
  marketPrice,
}: {
  marketPrice: APIMarketPriceType | null;
}) {
  const historicalData: MarketPriceType[] = useMemo(
    () => (marketPrice ? marketPrice.historical.slice().reverse() : []),
    [marketPrice]
  );

  const [timeRange, setTimeRange] = useState("5Y");

  const filteredData: MarketPriceType[] = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    switch (timeRange) {
      case "1Y":
        startDate = subYears(now, 1);
        break;
      case "6M":
        startDate = subMonths(now, 6);
        break;
      case "1M":
        startDate = subMonths(now, 1);
        break;
      case "5Y":
      default:
        startDate = subYears(now, 5);
        break;
    }
    return historicalData.filter((item) => new Date(item.date) >= startDate);
  }, [timeRange, historicalData]);

  return (
    <div className=" lg:w-3/4 lg:px-0 w-full px-4 ">
      <Card className="">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Market Price - {marketPrice?.symbol}</CardTitle>
            <CardDescription className="">
              ${filteredData[filteredData.length - 1].open}
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
              <SelectItem className="rounded-lg" value="5Y">
                5 Years
              </SelectItem>
              <SelectItem className="rounded-lg" value="1Y">
                1 Year
              </SelectItem>
              <SelectItem className="rounded-lg" value="6M">
                6 Months
              </SelectItem>
              <SelectItem className="rounded-lg" value="1M">
                1 Month
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <ChartContainer
            className=" w-full min-w-[250px] h-[150px] md:h-[300px]"
            config={chartConfig}
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillOpen" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-open)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-open)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} horizontal={true} />

              <YAxis type="number" domain={["auto", "auto"]} hide={true} />

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
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="open"
                type="natural"
                fill="url(#fillOpen)"
                stroke="var(--color-open)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
