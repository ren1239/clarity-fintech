"use client";

import { APICompanyProfileType, APIPortfolioBatchPriceType } from "@/APItypes";
import {
  convertCurrency,
  moneyFormatter,
  percentFormatter,
} from "../Calculations/Formatter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PortfolioSnapshotType } from "@/types";
import PortfolioInputDialogue from "./PortfolioInputDialogue";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function PortfolioTable({
  portfolioSnapshot,
  portfolioMarketPrice,
  username,
  userId,
  companyProfileArray,
}: {
  portfolioSnapshot: PortfolioSnapshotType[];
  portfolioMarketPrice: APIPortfolioBatchPriceType[];
  username: string;
  userId: string;
  companyProfileArray: APICompanyProfileType[];
}) {
  // Constants
  const BASE_CURRENCY = process.env.BASE_CURRENCY || "USD";

  return (
    <Card className="w-full max-h-[calc(100vh-6rem)] overflow-y-auto mb-10">
      <CardHeader className="mb-4 border-b flex flex-row justify-between items-center">
        <div className="">
          <CardTitle>Welcome Back {username}!</CardTitle>
          <CardDescription>
            This table represents your current portfolio holdings
          </CardDescription>
        </div>
        <div>
          <PortfolioInputDialogue userId={userId} />
        </div>
      </CardHeader>
      <CardContent className="relative ">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10 p-2 h-[100px] ">
            <TableRow className="">
              <TableHead>Symbol</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Avg Cost</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Your Price</TableHead>
              <TableHead>MOS</TableHead>

              <TableHead>Analyst Price</TableHead>
              <TableHead>Market Value</TableHead>
              <TableHead>Edit</TableHead>
              {/* <TableHead>Total Gain</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className=" ">
            {portfolioSnapshot.map((stock) => {
              const marketPrice =
                portfolioMarketPrice.find(
                  (item) => item.symbol === stock.ticker
                )?.price || 0;

              const marketValue = marketPrice * (stock._sum.quantity ?? 0);
              const marketValueInUSD =
                stock.currency !== BASE_CURRENCY
                  ? convertCurrency(marketValue, stock.currency, BASE_CURRENCY)
                  : marketValue;

              const purchaseValue =
                (stock._avg.purchasePrice || 0) * (stock._sum.quantity || 0);

              const profile = companyProfileArray.find(
                (profile) => profile.symbol === stock.ticker
              );

              return (
                <TableRow key={stock.ticker} className="">
                  <TableCell className="font-bold">
                    <Link
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/stock/${stock.ticker}`}
                    >
                      {stock.ticker}
                    </Link>
                  </TableCell>

                  <TableCell>{stock._sum.quantity ?? "N/A"}</TableCell>
                  <TableCell>
                    {moneyFormatter(stock._avg.purchasePrice ?? 0)}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter(marketPrice)} {stock.currency}
                  </TableCell>

                  {/* Your Price */}

                  <TableCell
                    className={` ${
                      stock.targetPrice === 0
                        ? "text-black"
                        : stock.targetPrice <= marketPrice
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    <Link
                      className="flex mx-auto  justify-center"
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/stock/${stock.ticker}/dcf_calculator`}
                    >
                      {stock.targetPrice === 0 ? (
                        "N/A"
                      ) : (
                        <>
                          {moneyFormatter(stock.targetPrice)}{" "}
                          {stock.targetPrice > marketPrice ? (
                            <ArrowUp className="h-4" />
                          ) : (
                            <ArrowDown className="h-4" />
                          )}
                        </>
                      )}
                    </Link>
                  </TableCell>

                  {/* Margin of Safety */}

                  <TableCell>
                    {stock.targetPrice !== 0
                      ? percentFormatter(
                          (stock.targetPrice - marketPrice) / stock.targetPrice
                        )
                      : "N/A"}
                  </TableCell>

                  {/* Analyst Price Price */}

                  <TableCell>
                    {moneyFormatter(Number(profile?.dcf))} {stock.currency}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter(marketValueInUSD)} {BASE_CURRENCY}
                  </TableCell>

                  {/* <TableCell
                    className={`${
                      totalGain >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {moneyFormatter(totalGain)} {BASE_CURRENCY}
                  </TableCell> */}
                  <TableCell>
                    <EditSymbolDialogue userId={userId} symbol={stock.ticker} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";

function EditSymbolDialogue({
  userId,
  symbol,
}: {
  userId: string;
  symbol: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (dialogOpen) {
      fetchTransactions();
    }
  }, [dialogOpen]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    if (!userId && !symbol) {
      setError("User ID and Symbol are required.");
      setLoading(false);
    }
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpointURL = `${baseURL}/api/dashboard/get-transactions?symbol=${symbol}&userId=${userId}`;

      const res = await fetch(endpointURL);
      if (!res.ok) {
        throw new Error("Failed to fetch Transations");
      }
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error(
        `Error fetching data for symbol: ${symbol}`,
        setError("Failed to load transactions")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transactions for {symbol}</DialogTitle>
            <DialogDescription>
              Here is a list of transations for this company.
            </DialogDescription>
          </DialogHeader>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id}>
                <TransactionDisplay transaction={transaction} />
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface TransactionType {
  id: string;
  purchaseDate: Date;
  purchasePrice: number;
  quantity: number;
  ticker: string;
  userId: string;
  currency: string;
}

function TransactionDisplay({ transaction }: { transaction: TransactionType }) {
  const { id, ticker, userId, currency, purchaseDate, purchasePrice } =
    transaction;

  console.log(currency);

  return (
    <Card>
      <CardContent
        className="  flex items-end  justify-between whitespace-nowrap rounded-md text-sm 
         ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        pt-6 hover:bg-gray-200/90
"
      >
        {/* <p>{transaction.id}</p> */}
        <div className="flex flex-col gap-2">
          <p className=" flex gap-4">
            <span className=" font-semibold">Date:</span>
            {format(purchaseDate, "yyyy-MM-dd")}
          </p>
          <p className=" flex gap-4">
            <span className=" font-semibold">Price:</span>${purchasePrice}
            {currency}
          </p>
          <p className=" flex gap-4">
            <span className=" font-semibold">Quantity:</span>$
            {transaction.quantity}
          </p>
        </div>
        <EditTransactionDialogue
          transactionId={id}
          symbol={ticker}
          userId={userId}
        />
      </CardContent>
    </Card>
  );
}

function EditTransactionDialogue({
  transactionId,
  symbol,
  userId,
}: {
  transactionId: string;
  symbol: string;
  userId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-primary/90 hover:text-white"
          >
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transactions for {symbol}</DialogTitle>
            <DialogDescription>{transactionId}</DialogDescription>
          </DialogHeader>
          <InputEditForm
            userId={userId}
            closeDialog={closeDialog}
            transactionId={transactionId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarIcon,
  Loader,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { editPortfolioInput } from "@/app/actions";
import { useRouter } from "next/navigation";

import Spinner from "../Spinner";
import Link from "next/link";

function InputEditForm({
  userId,
  closeDialog,
  transactionId,
}: {
  userId: string;
  transactionId: string;
  closeDialog: () => void;
}) {
  const FormSchema = z.object({
    ticker: z.string().min(1, "Ticker is required"), // Simple validation for a required string
    purchasePrice: z.number(),
    userId: z.string(),
    id: z.string(),
    purchaseDate: z.date({
      required_error: "A date is required.",
    }),
    quantity: z.number(),
  });

  console.log("transactionid", transactionId);

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const router = useRouter();

  // Call the use form hook and set default values, the solver allows type safety to persist
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticker: transactionId,
      purchasePrice: 0,
      userId: userId,
      id: transactionId,
      quantity: 0,
      purchaseDate: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log("Form submitted with values:", values);
    setLoading(true);

    editPortfolioInput(values);

    router.replace(`/dashboard/${userId}`);

    // Reset the loading state after a slight delay
    setTimeout(() => {
      setLoading(false);
      closeDialog();
    }, 3000); // Adjust this delay as needed

    // Here you can add your form submission logic, such as an API call
  }

  useEffect(() => {
    console.log("transactionId at useEffect start:", transactionId);

    const fetchTransaction = async () => {
      setLoading(true);
      console.log("Fetching transaction...");

      try {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const endpointURL = `${baseURL}/api/dashboard/get-transaction?transactionId=${transactionId}&userId=${userId}`;

        const res = await fetch(endpointURL);
        console.log("Fetch response:", res);
        if (!res.ok) {
          throw new Error("Failed to fetch Transactions");
        }
        const data = await res.json();
        console.log("Fetched data:", data);

        // Convert purchaseDate string to Date object if needed
        if (typeof data.transaction.purchaseDate === "string") {
          data.transaction.purchaseDate = new Date(
            data.transaction.purchaseDate
          );
        }

        setTransaction(data.transaction);

        // Reset form with the fetched transaction data
        form.reset(data.transaction);
        console.log("Form reset with data:", data.transaction);
      } catch (error) {
        console.error(
          `Error fetching data for transactionId: ${transactionId}`,
          error
        );
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchTransaction();
  }, [transactionId, userId, form]);

  function formatNumberDollar(value: number | null) {
    if (value === null) return "";
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatNumber(value: number | null) {
    if (value === null) return "";
    return `${value.toLocaleString()}`;
  }

  //Create the handler to reutern a callback function to parseFloat the input or return null
  function handleInputChange(field: any) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target;

      let value = input.value
        .replace(/,/g, "")
        .replace(/\$/g, "")
        .replace(/%/, "");

      if (
        field.name === "ticker" ||
        field.name === "currency" ||
        field.name === "country"
      ) {
        value = input.value.toUpperCase();
        field.onChange(value);
      } else {
        //If the value is valid, update the field with the new value.

        if (!isNaN(Number(value)) || value === "") {
          field.onChange(value === "" ? null : parseFloat(value));
        }
      }
      const cursorPosition = input.selectionStart;

      // Use setTimeout to restore the cursor position after updating the value.
      setTimeout(() => {
        if (input) {
          input.selectionStart = cursorPosition;
          input.selectionEnd = cursorPosition;
        }
      }, 0);
    };
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        {/* Purchase Price  */}
        <FormField
          control={form.control}
          name="purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormLabel>Purchase Price</FormLabel>
                <FormDescription className="text-xs">
                  Input price in exchange currency
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    value={formatNumberDollar(field.value)}
                    type="string"
                    onChange={handleInputChange(field)}
                  />
                </FormControl>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purchase Quantity  */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormLabel>Quantity</FormLabel>
                <FormDescription className="text-xs">
                  Input number of shares
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    type="string"
                    value={formatNumber(field.value)}
                    onChange={handleInputChange(field)}
                  />
                </FormControl>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div>
          <Button className="w-full pt-2" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
