"use client";

import { Tent, TrendingUp } from "lucide-react";
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

const chartConfig = {
  value: {
    label: "value",
  },
  expenseLimit: {
    label: "expenseLimit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function LivingExpenseChart({
  expenseLimit,
  expectedExpense,
}: {
  expenseLimit: number;
  expectedExpense: number;
}) {
  const chartData = [
    {
      title: "expenseLimit",
      value: expenseLimit,
      fill: "var(--color-expenseLimit)",
    },
  ];

  const expenseMinimum = expectedExpense;
  const targetProgress = expenseLimit / expenseMinimum;

  let progressAngle = 0;
  if (targetProgress > 1) {
    progressAngle = 360;
  } else {
    progressAngle = targetProgress * 360;
  }

  return (
    <Card className="flex flex-col w-full md:w-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Target</CardTitle>
        <CardDescription>The 4% Rule</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={progressAngle}
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
            <RadialBar dataKey="value" background cornerRadius={10} />
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
                          {`$${chartData[0].value.toLocaleString()}`}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          budget
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
          Living in Thailand costs $24,000 <Tent className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Our expense target is 4% of our Net Worth at the time of retirement
        </div>
      </CardFooter>
    </Card>
  );
}
