import { APIAnalystEstimatesType } from "@/APItypes";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { moneyFormatter, percentFormatter } from "../Calculations/Formatter";

export const AnalystEstimatesCard = ({
  analystEstimates,
}: {
  analystEstimates: APIAnalystEstimatesType[];
}) => {
  if (!analystEstimates) return <>Loading...</>;

  const calculateAverageGrowth = (
    analystEstimates: APIAnalystEstimatesType[]
  ) => {
    return analystEstimates.map((year, i) => {
      if (i === analystEstimates.length - 1)
        return { ...year, growthRate: null }; // No previous year to compare with
      const growthRate =
        (year.estimatedEpsAvg - analystEstimates[i + 1].estimatedEpsAvg) /
        analystEstimates[i + 1].estimatedEpsAvg;
      return { ...year, growthRate };
    });
  };

  const analystEstimatesWithGrowth = calculateAverageGrowth(analystEstimates);

  return (
    <Card className=" overflow-y-auto  h-[50vh] ">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row mb-8 relative">
        <div className="flex flex-col items-center w-full">
          <CardTitle className="text-center mx-auto text-xl md:text-2xl">
            Analyst Estimates
          </CardTitle>
          <CardDescription>
            These are the estimates of growth by financial institutions - Take
            this with a grain of salt.
          </CardDescription>
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Year</TableHead>
            <TableHead>Estimated EPS (Low)</TableHead>
            <TableHead>Estimated EPS (Avg)</TableHead>
            <TableHead>Estimated EPS (High)</TableHead>

            <TableHead>Estimated Growth </TableHead>
            <TableHead>Number of Analysts EPS </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analystEstimatesWithGrowth.map((year) => (
            <TableRow key={year.date}>
              <TableCell className="font-medium">
                {year.date.slice(0, 4)}
              </TableCell>
              <TableCell className="font-medium">
                {moneyFormatter(year.estimatedEpsLow)}
              </TableCell>
              <TableCell>{moneyFormatter(year.estimatedEpsAvg)}</TableCell>
              <TableCell>{moneyFormatter(year.estimatedEpsHigh)}</TableCell>
              <TableCell>
                {year.growthRate !== null
                  ? percentFormatter(year.growthRate)
                  : "N/A"}
              </TableCell>
              <TableCell>{year.numberAnalystsEstimatedEps}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
