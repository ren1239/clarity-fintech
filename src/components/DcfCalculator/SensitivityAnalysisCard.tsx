import { APIAnalystEstimatesType } from "@/APItypes";
import { dcfCalculationType } from "@/types";

import { dcfCalculation } from "../Calculations/CalculateDcf";

interface sensitivityResultType {
  growthRate: number;
  dcfValue: number;
}

export default function SensitivityAnalysisCard({
  dcfInput,
  analystEstimates,
}: {
  dcfInput: dcfCalculationType | null;
  analystEstimates: APIAnalystEstimatesType[];
}) {
  if (!analystEstimates || !dcfInput) return <div>Loading...</div>;

  //Safely extract reported currency and stock currency
  const { reportedCurrency = "" } = dcfInput ?? {};
  const { stockCurrency = "" } = dcfInput ?? {};

  //Calculate Analyst CAGR
  const ltEstimateEPS = analystEstimates[0].estimatedEpsHigh;
  const stEstimateEPS = analystEstimates[4].estimatedEpsHigh;

  const calculateAnalystCAGR = (lt: number, st: number) =>
    (Math.pow(lt / st, 1 / 5) - 1) * 100;

  const analystCAGR = calculateAnalystCAGR(ltEstimateEPS, stEstimateEPS);

  const dcfSensivityResults: sensitivityResultType[] = [];

  //Math.max takes the value that is the higher between these 2
  const maxGrowthRate = Math.max(analystCAGR + 5, 15); // Ensure we loop at least 15 times

  //loop through the array from -5% to analyst CAGR
  for (let stGrowthRate = -5; stGrowthRate <= maxGrowthRate; stGrowthRate++) {
    const dcfInputCopy = { ...dcfInput };
    dcfInputCopy.stGrowthRate = stGrowthRate;

    // Calculate the DCF value with the current rate
    const sensitivityResult = dcfCalculation(dcfInputCopy);
    const convertedCurrency = convertCurrency(
      sensitivityResult.dcfValue,
      reportedCurrency,
      stockCurrency
    );

    dcfSensivityResults.push({
      growthRate: stGrowthRate,
      dcfValue: convertedCurrency,
    });
  }

  return (
    <>
      <SensitivityBarChart
        dcfSensivityResults={dcfSensivityResults}
        analystCAGR={analystCAGR}
        stockPrice={dcfInput.stockPrice}
      />
    </>
  );
}

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

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
import { convertCurrency, moneyFormatter } from "../Calculations/Formatter";

const chartConfig = {
  dcfValue: {
    label: "DCF Value",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function SensitivityBarChart({
  dcfSensivityResults,
  analystCAGR,
  stockPrice,
}: {
  dcfSensivityResults: sensitivityResultType[];
  analystCAGR: number;
  stockPrice: number;
}) {
  if (!dcfSensivityResults || !analystCAGR || !stockPrice)
    return <>Loading...</>;

  const formattedStockPrice = moneyFormatter(stockPrice);

  //Establish the min and max value range for description analysis
  const roundedAnalystCAGR = Number(analystCAGR.toFixed());
  const maxDCFValue = Math.max(
    ...dcfSensivityResults.map((item) => item.dcfValue)
  );
  const minDCFValue = Math.min(
    ...dcfSensivityResults.map((item) => item.dcfValue)
  );
  const yAxisMax = Math.max(maxDCFValue * 1.1, stockPrice * 1.1);

  const currentPriceComparison =
    stockPrice > maxDCFValue
      ? "exceeds"
      : stockPrice < minDCFValue
      ? "isBelow"
      : "fallsWithin";

  const descriptions = {
    exceeds: `The current stock price of ${formattedStockPrice} significantly exceeds all projected DCF values, even in the most optimistic growth scenarios. This suggests that the market may be overvaluing the stock, and the price may not be justified by the company's growth prospects.`,
    isBelow: `The current stock price of ${formattedStockPrice} is below even the most conservative DCF projections, indicating that the market might be undervaluing the stock. If the company meets or exceeds growth expectations, there could be significant upside potential.`,
    fallsWithin: `The current stock price of ${formattedStockPrice} falls within the range of projected DCF values, suggesting that the market is fairly pricing the stock based on expected growth rates. This could imply a balanced risk-reward scenario for investors.`,
  };

  const valueTitles = {
    exceeds: "Significantly Overvalued",
    isBelow: "Fairly Priced",
    fallsWithin: "Significantly Undervalued",
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sensitivity Analysis</CardTitle>
        <CardDescription>
          Stock Value Projections across varying growth rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={dcfSensivityResults}
            margin={{
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis domain={[0, yAxisMax]} hide={true} />
            <XAxis
              dataKey="growthRate"
              className="text-[0.7rem]"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => `${value}`}
              label={{
                value: "Growth Rate (%)",
                position: "bottom",
                offset: 5,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="dcfValue" fill="var(--color-dcfValue)" radius={8} />
            {/* Horizontal reference line for the current stock price */}
            <ReferenceLine
              y={stockPrice}
              label={{
                value: `Current Price ($${stockPrice})`,
                position: "top",
                fontSize: 12,
                fill: "black",
              }}
              stroke="black"
              strokeDasharray="3 3"
            />
            {/* Vertical reference line for the analyst CAGR */}
            <ReferenceLine
              x={roundedAnalystCAGR}
              label={{
                value: `Analyst CAGR (${roundedAnalystCAGR}%)`,
                position: "top",
                fill: "green",
                fontSize: 12,
              }}
              stroke="green"
              strokeDasharray="3 3"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none items-center ">
          Analysis:
          <span
            className={`p-2 rounded-md ${
              currentPriceComparison === "exceeds"
                ? "bg-red-200"
                : currentPriceComparison === "isBelow"
                ? "bg-orange-200"
                : "bg-green-200"
            }`}
          >
            {valueTitles[currentPriceComparison]}
          </span>
        </div>
        <div className="leading-none text-muted-foreground">
          {descriptions[currentPriceComparison]}
        </div>
      </CardFooter>
    </Card>
  );
}
