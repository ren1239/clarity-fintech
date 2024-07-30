"use client";

import numeral from "numeral";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { dcfResultsType } from "@/types";
import { moneyFormatter } from "../Calculations/Formatter";

const chartConfig = {
  valuation: {
    label: "Valuation",
  },
  price: {
    label: "Price",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DcfValueCard({
  dcfResults,
}: {
  dcfResults: dcfResultsType | null;
}) {
  const dcfValue = dcfResults?.dcfValue ?? 0;

  const chartData = [
    { title: "price", price: dcfValue, fill: "var(--color-price)" },
  ];

  type MapValueParams = {
    value: number;
    inMin: number;
    inMax: number;
    outMin: number;
    outMax: number;
  };
  // if dcfValue is 1 , or dcf value is 1000, i want endAngle to be between 200 and 360

  function mapValue({
    value,
    inMin,
    inMax,
    outMin,
    outMax,
  }: MapValueParams): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  const endAngle = mapValue({
    value: dcfValue,
    inMin: 1,
    inMax: 2000,
    outMin: 50,
    outMax: 360,
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Fair Price</CardTitle>
        <CardDescription className="text-center">
          The stock price which is fair value for this business
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="price" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {moneyFormatter(chartData[0].price)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Target Price
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Is this price what you expected? <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          The larger the margin of safety, the better your returns
        </div>
      </CardFooter>
    </Card>
  );
}
