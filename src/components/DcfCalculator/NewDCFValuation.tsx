"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, addMonths } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";

interface DCFResult {
  intrinsicValue: number;
  projectionData: {
    year: string;
    fcf: number;
    discountedFCF: number;
    growthRate: number | null;
    isActual?: boolean;
  }[];
  terminalValue: {
    year: string;
    fcf: number;
    discountedFCF: number;
    growthRate: number;
    isActual?: boolean;
  };
}

interface ChartDataPoint {
  date: number;
  year: number;
  month: number;
  historicalValue: number | null;
  projectedValue: number | null;
  future: boolean;
  [key: string]: number | string | boolean | null; // Index signature to allow dynamic access
}

const chartConfig = {
  dcfValue: {
    label: "DCF Value",
    color: "hsl(var(--chart-5))",
  },
} as const;

const mockFinancialData = {
  epsProjections: [8.04, 9.27, 10.69, 12.32, 14.2, 14.9],
  companyName: "Alphabet Inc. (GOOG)",
  stockPrice: 154.33,
  sharesOutstanding: 11_491_000_000,
  freeCashFlow: 72_760_000_000,
  totalDebt: 28_140_000_000,
  cashAndEquivalents: 95_660_000_000,
};

function calculateDCF({
  initialFCF,
  epsProjections,
  longTermGrowth,
  discountRate,
  terminalMultiple,
  sharesOutstanding,
  netDebt,
}: {
  initialFCF: number;
  epsProjections: number[];
  longTermGrowth: number;
  discountRate: number;
  terminalMultiple: number;
  sharesOutstanding: number;
  netDebt: number;
}): DCFResult {
  const fcfs: number[] = [];
  const discountedFCFs: number[] = [];
  const growthRates: number[] = [];

  for (let i = 1; i <= 10; i++) {
    let growthRate;
    if (i <= 5 && i < epsProjections.length) {
      const prevEPS = epsProjections[i - 1];
      const currEPS = epsProjections[i];
      growthRate = (currEPS - prevEPS) / prevEPS;
    } else {
      growthRate = longTermGrowth;
    }

    const prevFcf = i === 1 ? initialFCF : fcfs[i - 2];
    const fcf = prevFcf * (1 + growthRate);
    const discounted = fcf / Math.pow(1 + discountRate, i);

    fcfs.push(fcf);
    discountedFCFs.push(discounted);
    growthRates.push(growthRate);
  }

  const terminalFcf = fcfs[9] * (1 + longTermGrowth);
  const terminalValue = terminalFcf * terminalMultiple;
  const discountedTerminal = terminalValue / Math.pow(1 + discountRate, 10);

  const enterpriseValue =
    discountedFCFs.reduce((sum, val) => sum + val, 0) + discountedTerminal;
  const equityValue = enterpriseValue - netDebt;
  const intrinsicValue = equityValue / sharesOutstanding;

  // Add current year (2024) actual FCF first
  const projectionData = [
    {
      year: `${new Date().getFullYear()}`,
      fcf: Math.round(initialFCF),
      discountedFCF: Math.round(initialFCF), // No discount for current year
      growthRate: null as number | null,
      isActual: true,
    },
  ];

  // Add projected years
  fcfs.forEach((fcf, i) => {
    projectionData.push({
      year: `${new Date().getFullYear() + i + 1}`,
      fcf: Math.round(fcf),
      discountedFCF: Math.round(discountedFCFs[i]),
      growthRate: growthRates[i],
      isActual: false,
    });
  });

  return {
    intrinsicValue,
    projectionData,
    terminalValue: {
      year: `${new Date().getFullYear() + 11} (Terminal)`,
      fcf: Math.round(terminalValue),
      discountedFCF: Math.round(discountedTerminal),
      growthRate: 0,
      isActual: false,
    },
  };
}

function generateMockData(
  intrinsicValue: number,
  discountRate: number,
  years: number
): { data: ChartDataPoint[]; minValue: number } {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  let minValue = Infinity;

  const historicalPrices = [
    125.62, 130.11, 127.58, 132.2, 135.49, 138.99, 142.67, 145.23, 187.88,
    200.12, 252.44, 154.33,
  ];

  historicalPrices.forEach((price, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
    minValue = Math.min(minValue, price);
    data.push({
      date: date.getTime(),
      year: date.getFullYear(),
      month: date.getMonth(),
      historicalValue: price,
      projectedValue: null,
      future: false,
    });
  });

  for (let i = 1; i <= years * 12; i++) {
    const date = addMonths(today, i);
    const price = intrinsicValue * Math.pow(1 + discountRate, i / 12);
    minValue = Math.min(minValue, price);
    data.push({
      date: date.getTime(),
      year: date.getFullYear(),
      month: date.getMonth(),
      historicalValue: null,
      projectedValue: parseFloat(price.toFixed(2)),
      future: true,
    });
  }

  return { data, minValue };
}

export default function StockProjectionChart() {
  const [epsProjections, setEpsProjections] = useState(
    mockFinancialData.epsProjections
  );
  const [epsAdjustment, setEpsAdjustment] = useState(0);
  const adjustedEpsProjections = useMemo(() => {
    if (epsProjections.length < 2) return epsProjections;

    const adjusted = [epsProjections[0]]; // Keep first EPS unchanged
    const baseGrowthRates = [];

    // Calculate original growth rates between years
    for (let i = 1; i < epsProjections.length; i++) {
      baseGrowthRates.push(
        (epsProjections[i] - epsProjections[i - 1]) / epsProjections[i - 1]
      );
    }

    // Apply adjustment to growth rates and rebuild EPS projections
    for (let i = 0; i < baseGrowthRates.length; i++) {
      const adjustedGrowth = baseGrowthRates[i] * (1 + epsAdjustment / 100);
      adjusted.push(adjusted[i] * (1 + adjustedGrowth));
    }

    return adjusted;
  }, [epsProjections, epsAdjustment]);

  const [longTermGrowth, setLongTermGrowth] = useState(0.03);
  const [discountRate, setDiscountRate] = useState(0.1);
  const [terminalMultiple, setTerminalMultiple] = useState(15);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [projectionData, setProjectionData] = useState<
    DCFResult["projectionData"]
  >([]);
  const [terminalValue, setTerminalValue] = useState<
    DCFResult["terminalValue"]
  >({
    year: "",
    fcf: 0,
    discountedFCF: 0,
    growthRate: 0,
    isActual: false,
  });
  const [minY, setMinY] = useState<number>(0);
  const [intrinsicValue, setIntrinsicValue] = useState<number | null>(null);

  const sharesOutstanding = mockFinancialData.sharesOutstanding;
  const netDebt =
    mockFinancialData.totalDebt - mockFinancialData.cashAndEquivalents;
  const initialFCF = mockFinancialData.freeCashFlow;

  useEffect(() => {
    const { intrinsicValue, projectionData, terminalValue } = calculateDCF({
      initialFCF,
      epsProjections: adjustedEpsProjections,
      longTermGrowth,
      discountRate,
      terminalMultiple,
      sharesOutstanding,
      netDebt,
    });
    setProjectionData(projectionData);
    setTerminalValue(terminalValue);
    setIntrinsicValue(intrinsicValue);

    const { data, minValue } = generateMockData(
      intrinsicValue,
      discountRate,
      5
    );
    setChartData(data);
    setMinY(minValue * 0.9);
  }, [
    adjustedEpsProjections,
    longTermGrowth,
    discountRate,
    terminalMultiple,
    sharesOutstanding,
    netDebt,
    initialFCF,
  ]);

  return (
    <Card className="p-4 space-y-6">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Stock Price Projection (DCF): ${" "}
            {intrinsicValue !== null ? intrinsicValue.toFixed(2) : "Loading..."}
          </h2>
          <Button
            variant="outline"
            onClick={() => {
              setEpsProjections(mockFinancialData.epsProjections);
              setEpsAdjustment(0);
              setLongTermGrowth(0.03);
              setDiscountRate(0.1);
              setTerminalMultiple(15);
            }}
          >
            Reset All
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 pt-2">
          <div className="md:w-3/5 p-0">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full min-h-[450px] overflow-hidden"
            >
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id="historicalFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#999" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#999" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="projectionFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  hide={true}
                  tick={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  padding={{ left: 0, right: 0 }}
                  tickFormatter={(value, index) => {
                    const item = chartData[index];
                    return item?.month === 0
                      ? format(new Date(value), "yyyy")
                      : "";
                  }}
                  interval={0}
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  scale="time"
                />
                <YAxis
                  hide={true}
                  tick={false}
                  domain={[minY, "auto"]}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <CartesianGrid vertical={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    const value = payload[0].value as number;
                    return (
                      <div className="bg-white p-2 border rounded shadow text-sm">
                        <div className="font-medium">
                          {format(new Date(data.date), "yyyy")}
                        </div>
                        <div>Value: ${value?.toFixed(2)}</div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={mockFinancialData.stockPrice}
                  label={{
                    value: `Current Price ($${mockFinancialData.stockPrice})`,
                    position: "top",
                    fontSize: 12,
                    fill: "black",
                  }}
                  stroke="black"
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="historicalValue"
                  stroke="#999"
                  fill="url(#historicalFill)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="projectedValue"
                  stroke="#8884d8"
                  fill="url(#projectionFill)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="md:w-2/5 grid gap-4 text-sm">
            {/* Master EPS Adjustment Slider */}
            <div>
              <label className="block mb-1 font-medium text-xs">
                Master EPS Adjustment ({epsAdjustment}%)
              </label>
              <Slider
                value={[epsAdjustment]}
                onValueChange={([val]) => setEpsAdjustment(val)}
                min={-50}
                max={50}
                step={1}
              />
            </div>

            {/* EPS Display and Sliders */}
            <div>
              <label className="block mb-1 font-medium text-xs">
                EPS 2024: {epsProjections[0].toFixed(2)}
              </label>
            </div>
            {epsProjections.slice(1, 6).map((baseEps, i) => (
              <div key={i + 1}>
                <label className="block mb-1 font-medium text-xs">
                  EPS {2025 + i} (Adjusted:{" "}
                  {adjustedEpsProjections[i + 1].toFixed(2)})
                </label>
                <Slider
                  value={[baseEps]}
                  onValueChange={([v]) => {
                    const updated = [...epsProjections];
                    updated[i + 1] = v;
                    setEpsProjections(updated);
                  }}
                  min={0}
                  max={20}
                  step={0.1}
                />
              </div>
            ))}

            <div>
              <label className="block mb-1 font-medium text-xs">
                Long Term Growth Rate ({(longTermGrowth * 100).toFixed(1)}%)
              </label>
              <Slider
                value={[longTermGrowth * 100]}
                onValueChange={([val]) => setLongTermGrowth(val / 100)}
                min={0}
                max={10}
                step={0.1}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-xs">
                Discount Rate ({(discountRate * 100).toFixed(1)}%)
              </label>
              <Slider
                value={[discountRate * 100]}
                onValueChange={([val]) => setDiscountRate(val / 100)}
                min={0}
                max={15}
                step={0.1}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-xs">
                Terminal Multiple ({terminalMultiple}x)
              </label>
              <Slider
                value={[terminalMultiple]}
                onValueChange={([val]) => setTerminalMultiple(val)}
                min={5}
                max={25}
                step={1}
              />
            </div>
          </div>
        </div>

        <div className="pt-10">
          <h3 className="text-lg font-semibold mb-2">Free Cash Flow Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2 font-semibold">Year</th>
                  <th className="p-2 font-semibold">Projected FCF</th>
                  <th className="p-2 font-semibold">Discounted FCF</th>
                  <th className="p-2 font-semibold">Growth Rate</th>
                </tr>
              </thead>
              <tbody>
                {[...projectionData, terminalValue]
                  .filter((row) => row)
                  .map((row) => (
                    <tr key={row.year} className="border-b">
                      <td className="p-2">{row.year}</td>
                      <td className="p-2">${row.fcf.toLocaleString()}</td>
                      <td className="p-2">
                        ${row.discountedFCF.toLocaleString()}
                      </td>
                      <td className="p-2">
                        {row.growthRate !== null
                          ? `${(row.growthRate * 100).toFixed(1)}%`
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-10">
          <h3 className="text-lg font-semibold mb-2">
            FCF vs Discounted FCF (Projection)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectionData}>
              <XAxis dataKey="year" />
              <YAxis
                hide={true}
                tickFormatter={(val) => `$${(val / 1_000_000).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(val) => `$${Number(val).toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="fcf" fill="#82ca9d" name="FCF" />
              <Bar
                dataKey="discountedFCF"
                fill="#8884d8"
                name="Discounted FCF"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
