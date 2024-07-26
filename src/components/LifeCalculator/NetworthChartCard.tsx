import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import numeral from "numeral";

import { CombinedResult } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
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

const chartConfig = {
  Networth: {
    label: "NetWorth",
  },
  compound: {
    label: "Compound",
    color: "hsl(var(--chart-2))",
  },
  standard: {
    label: "Standard",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const moneyFormatter = (value: number) => {
  return numeral(value).format("$0,0");
};

export const NetWorthChartCard = ({
  compound,
  savings,
  length,
  combinedArray,
}: {
  compound: number;
  savings: number;
  length: number;
  combinedArray: CombinedResult[];
}) => (
  <Card className="h-full">
    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
      <div className="grid flex-1 gap-1 text-center sm:text-left">
        <CardTitle>Net Worth</CardTitle>
        <CardDescription className="text-xs">
          Simply by investing your money, you will have
          <span className="text-primary font-semibold">
            {` ${moneyFormatter(compound - savings)} `}
          </span>
          more by year {length}.
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[380px] w-full"
      >
        <AreaChart data={combinedArray}>
          <defs>
            <linearGradient id="fillCompound" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-compound)"
                stopOpacity={0.9}
              />
              <stop
                offset="95%"
                stopColor="var(--color-compound)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillStandard" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-standard)"
                stopOpacity={0.9}
              />
              <stop
                offset="95%"
                stopColor="var(--color-standard)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => `Year ${value}`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Year ${value}`}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="compound"
            type="natural"
            fill="url(#fillCompound)"
            stroke="var(--color-compound)"
          />
          <Area
            dataKey="standard"
            type="natural"
            fill="url(#fillStandard)"
            stroke="var(--color-standard)"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
