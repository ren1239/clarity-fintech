// PortfolioPieChart.tsx
"use client";

import { format } from "date-fns";
import { PortfolioValueDataType } from "@/types";
import { Label, Pie, PieChart, TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type PieChartData = {
  name: string;
  value: number;
  fill: string;
};
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { moneyFormatter } from "../Calculations/Formatter";

type CountryPieChartProps = {
  countryData: Record<string, number>;
  countryCode: string;
  title: string;
  filter: number;
};

type ChartItemConfig = {
  label: string;
  color: string;
};

type ChartConfig = Record<string, ChartItemConfig>;

export function PortfolioPieChart({
  portfolioValueData,
}: {
  portfolioValueData: PortfolioValueDataType[];
}) {
  const latestPortfolioData = portfolioValueData[portfolioValueData.length - 1];

  return (
    <div className="flex w-full gap-4 flex-col md:flex-row">
      <CountryPieChart
        countryData={latestPortfolioData.countryBreakdown?.CN ?? {}}
        countryCode="CN"
        title="China Holdings"
        filter={5}
      />
      <CountryPieChart
        countryData={latestPortfolioData.countryBreakdown?.US ?? {}}
        countryCode="US"
        title="US Holdings"
        filter={5}
      />
      <CountryPieChart
        countryData={latestPortfolioData.breakdown}
        countryCode="ALL"
        title="Overall Top Holdings"
        filter={10}
      />
    </div>
  );
}

// CountryPieChart.tsx
export function CountryPieChart({
  countryData,
  countryCode,
  title,
  filter,
}: CountryPieChartProps) {
  const { topHoldings, totalValue, chartConfig } = processData(
    countryData,
    countryCode,
    filter
  );

  const today = format(new Date(), "EEE, d MMM, yyyy");

  // Check if there's no data to display
  if (topHoldings.length === 0) {
    return (
      <Card className="flex flex-col  w-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>No Data Available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col  w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Top {filter} Holdings</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({
                active,
                payload,
              }: TooltipProps<ValueType, NameType>) => {
                if (!active || !payload) return null;

                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    {(payload as PieChartData[]).map((entry, index) => {
                      const value = entry.value;
                      const percentage = ((value / totalValue) * 100).toFixed(
                        2
                      );
                      return (
                        <div key={`item-${index}`} className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-sm border border-foreground/10"
                              style={{ backgroundColor: entry.fill }}
                            />
                            <span className="font-medium">{entry.name}</span>
                          </div>
                          <div className="text-sm">{moneyFormatter(value)}</div>
                          <div className="text-xs text-muted-foreground">
                            {percentage}% of portfolio
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Pie
              data={topHoldings}
              dataKey="value"
              nameKey="symbol"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {moneyFormatter(totalValue)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Holdings
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Showing top holdings
        </div>
        <div className="leading-none text-muted-foreground">
          Data as of {today}
        </div>
      </CardFooter>
    </Card>
  );
}

// processData.ts

export function processData(
  countryData: Record<string, number>,
  countryCode: string,
  filter: number
) {
  // Convert the data into an array of objects
  const data = Object.entries(countryData).map(([symbol, value]) => ({
    country: countryCode,
    symbol,
    value,
    fill: "",
  }));

  const topHoldings = data.sort((a, b) => b.value - a.value).slice(0, filter);

  // Assign the fill colors after sorting
  topHoldings.forEach((item, index) => {
    item.fill = `hsl(var(--chart-${(index % 5) + 1}))`; // Cycle through color variables
  });

  const totalValue = topHoldings.reduce((acc, curr) => acc + curr.value, 0);

  const chartConfig: ChartConfig = data.reduce<ChartConfig>((config, item) => {
    config[item.symbol] = {
      label: item.symbol,
      color: item.fill, // Use the 'fill' color for the chart config
    };
    return config;
  }, {} as ChartConfig);

  return { topHoldings, totalValue, chartConfig };
}
