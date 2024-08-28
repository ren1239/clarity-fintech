"use client";

import { ArrowBigDownDash, ArrowBigUpDash, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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
import { APICompanyProfileType } from "@/APItypes";
import { moneyFormatter, percentFormatter } from "../Calculations/Formatter";
import { useMemo } from "react";

const chartConfig = {
  clarityValue: {
    label: "Clarity Value",
    color: "hsl(var(--chart-2))",
  },
  priceDifference: {
    label: "Difference",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function FMPPriceChartCard({
  companyProfile,
}: {
  companyProfile: APICompanyProfileType | null;
}) {
  const chartData = useMemo(() => {
    if (companyProfile !== null) {
      return [
        {
          title: "Company Valuation",
          clarityValue: companyProfile.dcf,
          priceDifference: companyProfile.dcfDiff,
        },
      ];
    } else {
      return [
        {
          title: "Company Valuation",
          clarityValue: 0,
          priceDifference: 0,
        },
      ];
    }
  }, [companyProfile]);

  let yearRange: number[] = [0, 0];

  if (companyProfile && companyProfile.range) {
    yearRange = companyProfile.range
      .split("-")
      .map((value) => parseFloat(value));
  }

  const value = companyProfile ? companyProfile.price : 0;

  // Calculate the percentage width
  const progressBarPercentage =
    ((value - yearRange[0]) / (yearRange[1] - yearRange[0])) * 100;

  const priceDifference = companyProfile ? companyProfile.dcfDiff : 0;
  const marginOfSafety = companyProfile
    ? (companyProfile.dcf - companyProfile.price) / companyProfile.dcf
    : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Analyst Price</CardTitle>
        <CardDescription>Recommended Intrinsic Value</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        {companyProfile && (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-auto w-full h-[200px] translate-y-1/4"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {moneyFormatter(companyProfile.dcf)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            {companyProfile?.symbol}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="clarityValue"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-clarityValue)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="priceDifference"
                fill="var(--color-priceDifference)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      {/* Progress Bar  */}

      <div className="flex flex-col items-center justify-center -translate-y-4 ">
        <p className="tracking-tighter text-muted-foreground text-sm italic">
          52 Week Range
        </p>

        <div className="flex gap-x-4 items-center justify-center mb-4 ">
          <p className="tracking-tighter text-muted-foreground text-sm italic">
            {moneyFormatter(yearRange[0])}
          </p>
          <div className="h-4 min-w-32 max-w-64 ring-2 rounded-full ring-primary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progressBarPercentage}%` }}
            ></div>
          </div>
          <p className="tracking-tighter text-muted-foreground text-sm italic">
            {moneyFormatter(yearRange[1])}
          </p>
        </div>
      </div>

      {/* Card Footer Description */}

      <CardFooter className="flex gap-x-4 text-sm border-t  justify-center py-4">
        {/* Margin of Safety Number */}

        <div className="flex-col items-center justify-center border-r pr-6">
          {priceDifference <= 0 ? (
            <div className="flex flex-col items-center">
              <div className="flex text-green-500 items-center justify-center">
                <h3 className="fill-foreground text-xl font-bold flex items-center">
                  {percentFormatter(marginOfSafety)}
                </h3>
                <ArrowBigUpDash />
              </div>
              <p className="text-center p-2 bg-green-500 rounded-md bg-opacity-40 min-w-32 max-w-64 text-xs font-semibold">
                {moneyFormatter(Math.abs(priceDifference))} Undervalued
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex text-red-500 items-center justify-center">
                <h3 className="fill-foreground text-3xl font-bold flex items-center">
                  {percentFormatter(marginOfSafety)}
                </h3>
                <ArrowBigDownDash />
              </div>
              <p className="text-center p-2 bg-red-500 rounded-md bg-opacity-40 min-w-32 max-w-64 font-semibold">
                {moneyFormatter(Math.abs(priceDifference))} Overvalued
              </p>
            </div>
          )}
        </div>

        {companyProfile && (
          <div className=" leading-3 text-muted-foreground text-xs">
            The recommended intrinsic value of {companyProfile?.companyName} is{" "}
            <span className="font-semibold text-black">
              {moneyFormatter(companyProfile?.dcf)}
            </span>
            , this is a difference of
            <span
              className={`font-semibold ${
                companyProfile?.price > companyProfile?.dcf
                  ? `text-red-600`
                  : "text-green-600"
              }`}
            >
              {moneyFormatter(companyProfile?.dcfDiff)}
            </span>
            .
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
