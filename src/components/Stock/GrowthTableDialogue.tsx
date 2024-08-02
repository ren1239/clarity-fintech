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

import { moneyFormatter, percentFormatter } from "../Calculations/Formatter";

export function GrowthTableDialogue({
  filteredData,
}: {
  filteredData: APIFinancialGrowthType[] | null;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Detail...</Button>
      </DialogTrigger>
      <DialogContent className="h-1/2 sm:max-w-[600px] ">
        <DialogHeader>
          <DialogTitle>Growth Table</DialogTitle>
          <DialogDescription>
            This table represents the growth rate across the different time
            ranges
          </DialogDescription>
        </DialogHeader>
        <FcfTable filteredData={filteredData} />
        <DialogFooter>
          <span className="text-xs text-neutral-400">
            Only for educational purposes
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APIFinancialGrowthType } from "@/APItypes";

export function FcfTable({
  filteredData,
}: {
  filteredData: APIFinancialGrowthType[] | null;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Year</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>FCF</TableHead>
          <TableHead>Net Income</TableHead>
          <TableHead>Earnings</TableHead>
          <TableHead>Book Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData !== null
          ? filteredData.map((year) => (
              <TableRow key={year.calendarYear}>
                <TableCell className="font-medium">
                  {year.calendarYear}
                </TableCell>

                <TableCell className="font-medium">
                  {percentFormatter(year.revenueGrowth)}
                </TableCell>
                <TableCell>
                  {percentFormatter(year.freeCashFlowGrowth)}
                </TableCell>
                <TableCell>{percentFormatter(year.netIncomeGrowth)}</TableCell>
                <TableCell>{percentFormatter(year.epsgrowth)}</TableCell>
                <TableCell>
                  {percentFormatter(year.bookValueperShareGrowth)}
                </TableCell>
              </TableRow>
            ))
          : ""}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}
