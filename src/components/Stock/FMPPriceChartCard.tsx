"use client";

import { TrendingUp } from "lucide-react";
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
import { moneyFormatter } from "../Calculations/Formatter";
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
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Clarity Value</CardTitle>
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
      <CardFooter className="flex-col gap-2 text-sm">
        {companyProfile && (
          <div className="leading-none text-muted-foreground">
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
