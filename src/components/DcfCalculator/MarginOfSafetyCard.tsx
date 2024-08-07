import { Skeleton } from "@/components/ui/skeleton";
import { ArrowBigDownDash, ArrowBigUpDash, Ghost } from "lucide-react";
import { dcfCalculationType, dcfResultsType } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

import {
  convertCurrency,
  moneyFormatter,
  percentFormatter,
} from "../Calculations/Formatter";

export function MarginOfSafetyCard({
  dcfResults,
  dcfInput,
}: {
  dcfResults: dcfResultsType | null;
  dcfInput: dcfCalculationType | null;
}) {
  const { reportedCurrency = "" } = dcfInput ?? {};
  const { stockCurrency = "" } = dcfInput ?? {};

  const dcfValue = convertCurrency(
    dcfResults?.dcfValue ?? 0,
    reportedCurrency,
    stockCurrency
  );
  const stockPrice = dcfInput?.stockPrice ?? 0;

  const marginOfSafety = (dcfValue - stockPrice) / dcfValue;
  const priceDifference = dcfValue - stockPrice;

  return (
    <Card className="w-1/2 h-full">
      {dcfResults &&
      stockPrice !== 0 &&
      dcfInput?.simpleCalculation !== true ? (
        <div className="  flex flex-col items-center justify-center">
          <CardHeader className="flex flex-col items-center gap-2 space-y-0  py-5  mb-8">
            <CardTitle className="text-center mx-auto">MOS</CardTitle>
            <CardDescription className="text-center">
              Margin of safety
            </CardDescription>
          </CardHeader>
          <div className="flex-col items-center justify-center ">
            {priceDifference >= 0 ? (
              <>
                <div className="flex text-green-500 items-center justify-center">
                  <h3 className="fill-foreground text-3xl font-bold flex items-center">
                    {percentFormatter(marginOfSafety)}
                  </h3>
                  <ArrowBigUpDash />
                </div>
                <p className="text-center p-2 bg-green-500 rounded-md bg-opacity-40 w-full">
                  {moneyFormatter(priceDifference)} UnderValued
                </p>
              </>
            ) : (
              <>
                <div className="flex text-red-500 items-center justify-center">
                  <h3 className="fill-foreground text-3xl font-bold flex items-center">
                    {percentFormatter(marginOfSafety)}
                  </h3>
                  <ArrowBigDownDash />
                </div>
                <p className="text-center p-2 bg-red-500 rounded-md bg-opacity-40 w-full">
                  {moneyFormatter(-priceDifference)} Overvalued
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-full p-4">
            <Skeleton className="w-full h-full flex flex-col items-center justify-center space-y-2 text-center">
              <Ghost className="w-6 h-6" />
              <p>Awaiting Detailed input..</p>
            </Skeleton>
          </div>
        </>
      )}
    </Card>
  );
}
