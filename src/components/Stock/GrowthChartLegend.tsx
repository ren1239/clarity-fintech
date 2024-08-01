import { ChartDataType } from "@/APItypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { percentFormatter } from "../Calculations/Formatter";

// Define the type for the entire chart configuration object
interface ChartConfigType {
  key: string;
  label: string;
  color: string;
}

export function GrowthChartLegend({
  chartConfigArray,
  visibleLines,
  toggleLineVisibility,
  averageResults,
}: {
  chartConfigArray: ChartConfigType[];
  visibleLines: { [key: string]: boolean };
  toggleLineVisibility: (key: string) => void;
  averageResults: ChartDataType;
}) {
  console.log("visible lines", visibleLines);

  const visibleAverage = visibleAverageCalculation({
    visibleLines,
    averageResults,
  });
  return (
    <Card className="flex flex-col w-[300px] h-[500px] justify-between">
      <CardHeader className="mb-4">
        <CardTitle>Growth Chart</CardTitle>
        <CardDescription>Growth Indicators</CardDescription>
      </CardHeader>

      <CardContent className="flex gap-x-4 flex-col w-full">
        {chartConfigArray.map((data, index) => (
          <button
            key={index}
            onClick={() => toggleLineVisibility(data.key)}
            className={`flex items-center justify-start gap-2 w-full p-2 ${
              visibleLines[data.key] ? "text-slate-900" : "text-slate-300"
            }`}
          >
            <div style={{ background: data.color }} className="w-2 h-2"></div>
            <h2>{data.label}</h2>
            <p>
              {percentFormatter(
                Number(averageResults[data.key as keyof ChartDataType])
              )}
            </p>
          </button>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t">
        <div className="flex gap-2 font-semibold leading-none mt-4 text-xl">
          Average Growth Rate:
        </div>
        <div className="leading-none font-bold text-primary text-right w-full text-2xl">
          {percentFormatter(visibleAverage)}
        </div>
      </CardFooter>
    </Card>
  );
}

const visibleAverageCalculation = ({
  visibleLines,
  averageResults,
}: {
  visibleLines: { [key: string]: boolean };
  averageResults: ChartDataType;
}) => {
  // first you want to know which lines are visible to know which to calculate
  const activeLines = Object.keys(visibleLines).filter(
    (key) => visibleLines[key]
  );

  const sum = activeLines.reduce(
    (total, key) => total + averageResults[key as keyof ChartDataType],
    0
  );
  const average = sum / activeLines.length;

  return average;
};
