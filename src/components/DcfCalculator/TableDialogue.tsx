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

import { moneyFormatter } from "../Calculations/Formatter";

export function TableDialogue({
  dcfResults,
}: {
  dcfResults: dcfResultsType | null;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Detail...</Button>
      </DialogTrigger>
      <DialogContent className="h-1/2 sm:max-w-[600px] ">
        <DialogHeader>
          <DialogTitle>Free Cashflow Projection</DialogTitle>
          <DialogDescription>
            This table represents the free cashflow changes each year
          </DialogDescription>
        </DialogHeader>
        <FcfTable dcfResults={dcfResults} />
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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dcfResultsType } from "@/types";

// const invoices = [
//   {
//     invoice: "INV001",
//     paymentStatus: "Paid",
//     totalAmount: "$250.00",
//     paymentMethod: "Credit Card",
//   },
//   {
//     invoice: "INV002",
//     paymentStatus: "Pending",
//     totalAmount: "$150.00",
//     paymentMethod: "PayPal",
//   },
//   {
//     invoice: "INV003",
//     paymentStatus: "Unpaid",
//     totalAmount: "$350.00",
//     paymentMethod: "Bank Transfer",
//   },
//   {
//     invoice: "INV004",
//     paymentStatus: "Paid",
//     totalAmount: "$450.00",
//     paymentMethod: "Credit Card",
//   },
//   {
//     invoice: "INV005",
//     paymentStatus: "Paid",
//     totalAmount: "$550.00",
//     paymentMethod: "PayPal",
//   },
//   {
//     invoice: "INV006",
//     paymentStatus: "Pending",
//     totalAmount: "$200.00",
//     paymentMethod: "Bank Transfer",
//   },
//   {
//     invoice: "INV007",
//     paymentStatus: "Unpaid",
//     totalAmount: "$300.00",
//     paymentMethod: "Credit Card",
//   },
// ];

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
          <TableHead className="w-[250px]">Year</TableHead>
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
