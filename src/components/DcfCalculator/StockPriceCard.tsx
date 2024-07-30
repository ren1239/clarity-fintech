import { dcfCalculationType, dcfResultsType } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Ghost } from "lucide-react";
import { moneyFormatter } from "../Calculations/Formatter";

export function StockPriceCard({
  dcfResults,
  dcfInput,
}: {
  dcfResults: dcfResultsType | null;
  dcfInput: dcfCalculationType | null;
}) {
  const stockPrice = dcfInput?.stockPrice ?? 0;

  return (
    <Card className="w-1/2 h-full">
      {dcfResults &&
      stockPrice !== 0 &&
      dcfInput?.simpleCalculation !== true ? (
        <div className="  flex flex-col items-center justify-center">
          <CardHeader className="flex flex-col items-center gap-2 space-y-0  py-5  mb-8">
            <CardTitle className="text-center mx-auto">Price</CardTitle>
            <CardDescription>Market price</CardDescription>
          </CardHeader>
          <div className="flex-col">
            <h3 className="fill-foreground text-3xl font-bold">
              {moneyFormatter(stockPrice)}
            </h3>
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
