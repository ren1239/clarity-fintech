import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowBigDownDash,
  ArrowBigUp,
  ArrowBigUpDash,
  Ghost,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dcfCalculationType, dcfResultsType } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

import numeral from "numeral";
import { percentFormatter } from "../Calculations/Formatter";

export function MarginOfSafetyCard({
  dcfResults,
  dcfInput,
}: {
  dcfResults: dcfResultsType | null;
  dcfInput: dcfCalculationType | null;
}) {
  const dcfValue = dcfResults?.dcfValue ?? 0;
  const stockPrice = dcfInput?.stockPrice ?? 0;

  const marginOfSafety = (dcfValue - stockPrice) / stockPrice;

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
          <div className="flex-col">
            {marginOfSafety >= 0 ? (
              <h3 className="fill-foreground text-3xl font-bold text-green-500 flex items-center">
                {percentFormatter(marginOfSafety)} <ArrowBigUpDash />
              </h3>
            ) : (
              <h3 className="fill-foreground text-3xl font-bold text-red-500 flex items-center">
                {percentFormatter(marginOfSafety)} <ArrowBigDownDash />
              </h3>
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
