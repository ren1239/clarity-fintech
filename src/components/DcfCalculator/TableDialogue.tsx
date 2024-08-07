import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  largeNumberFormatter,
  moneyFormatter,
} from "../Calculations/Formatter";

export function TableDialogue({
  dcfResults,
  dcfInput,
}: {
  dcfResults: dcfResultsType | null;
  dcfInput: dcfCalculationType | null;
}) {
  const fcfArray = dcfResults?.fcfArray.slice(0, -1) ?? [
    { year: 1, fcf: 0, pvFcf: 0 },
  ];

  const terminalPvFcf = dcfResults?.terminalYearPvFcf ?? 0;

  const cumulativePvFcf = dcfResults?.totalPvFcf ?? 0;
  const netCashDebt = dcfInput?.netCashDebt ?? 0;
  const stockBasedComp = dcfInput?.stockBasedComp ?? 0;
  const sharesOutstanding = dcfInput?.sharesOutstanding ?? 0;

  const totalCash = cumulativePvFcf + netCashDebt - stockBasedComp;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Detail...</Button>
      </DialogTrigger>
      <DialogContent className="h-1/2 max-w-[calc(100vw-4rem)] rounded-lg  ">
        <DialogHeader>
          <DialogTitle>Free Cashflow Projection</DialogTitle>
          <DialogDescription>
            This table represents the free cashflow changes each year
          </DialogDescription>
        </DialogHeader>
        <FcfTable dcfResults={dcfResults} />
        <DialogFooter className="border-t-2 flex flex-col h-auto p-4 overflow-y-auto gap-y-3">
          <span className="text-base font-semibold pt-2">
            How is the value Calculated?
          </span>
          <span className="text-xs">
            {`The intrinsic value of a business 
            can be calculated with this equation: `}
            <br />
            {`Intrinsic Value = ((Current Free Cashflow - Stock Based Compensation)
               * Growth Rate ) + Terminal Value  =  Total Cash`}
            <br />
            {`(Total Cash - NetCashDebt ) / Shares Outstanding `}
          </span>
          <div className="flex gap-x-1 text-xs">
            {fcfArray.map((dfcf) => (
              <span key={dfcf.year} className="">{`${moneyFormatter(
                dfcf.pvFcf
              )}+`}</span>
            ))}
            <span>{moneyFormatter(terminalPvFcf)} =</span>
            <span>{moneyFormatter(cumulativePvFcf + netCashDebt)}</span>
          </div>
          <div className="text-sm  italic">
            <span>{moneyFormatter(cumulativePvFcf + netCashDebt)}+</span>
            <span>{moneyFormatter(netCashDebt)} / </span>
            <span>{largeNumberFormatter(sharesOutstanding)}</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

//  <span>{moneyFormatter(netCashDebt)}-</span>
//             <span>{moneyFormatter(stockBasedComp)} = </span>
//             <span>{moneyFormatter(totalCash)} / </span>

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dcfCalculationType, dcfResultsType } from "@/types";

export function FcfTable({
  dcfResults,
}: {
  dcfResults: dcfResultsType | null;
}) {
  const fcfArray = dcfResults?.fcfArray.slice(0, -1) ?? [
    { year: 1, fcf: 0, pvFcf: 0 },
  ];

  const cumulativePvFcf = dcfResults?.totalPvFcf ?? 0;
  const cumulativeFcf = dcfResults?.totalFcf ?? 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Year</TableHead>
          <TableHead>Free Cash Flow</TableHead>
          <TableHead>Discounted Free Cash Flow</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fcfArray.map((year) => (
          <TableRow key={year.year}>
            <TableCell className="font-medium">{year.year}</TableCell>

            <TableCell className="font-medium">
              {moneyFormatter(year.fcf)}
            </TableCell>
            <TableCell>{moneyFormatter(year.pvFcf)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={1}>Terminal Year</TableCell>

          <TableCell className="text-right">
            {moneyFormatter(cumulativeFcf)}
          </TableCell>
          <TableCell className="text-right">
            {moneyFormatter(cumulativePvFcf)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
