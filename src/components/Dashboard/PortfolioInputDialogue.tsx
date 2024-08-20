"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { CalendarIcon, Loader } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

import { format, subDays } from "date-fns";
import { createPortfolioInput } from "@/app/actions";
import { useState } from "react";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function PortfolioInputDialogue({ userId }: { userId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Stock Data</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a Stock to your Portfolio</DialogTitle>
            <DialogDescription>
              Record your latest stock purchase and submit when you are done
            </DialogDescription>
          </DialogHeader>

          <PortfolioInputForm userId={userId} closeDialog={closeDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}

//Create the form Schema

const FormSchema = z.object({
  ticker: z.string().min(1),
  purchaseDate: z.date({
    required_error: "A date of birth is required.",
  }),
  purchasePrice: z.number().min(0.1),
  quantity: z.number().min(1),
  currency: z.string().min(1),
  country: z.string().min(1),
  sector: z.string(),
  industry: z.string(),
  exchange: z.string(),
  userId: z.string(),
});

export function PortfolioInputForm({
  userId,
  closeDialog,
}: {
  userId: string;
  closeDialog: () => void;
}) {
  //Set state for loading

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Call the use form hook and set default values, the solver allows type safety to persist
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticker: "AAPL",
      purchaseDate: subDays(new Date(), 1), // Set default to today's date
      purchasePrice: 1000,
      quantity: 1000,
      currency: "USD",
      country: "US",
      sector: "Machine",
      industry: "Sales",
      exchange: "NYSE",
      userId: userId,
    },
  });

  //Create the submit form button. Update the state with a callback function.
  function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    console.log(loading);
    // Example of handling 'guest' users or any other condition
    if (values.userId === "guest") {
      console.warn("Guest users cannot submit the form");
      return;
    }

    // Ensure the purchaseDate is a Date object
    if (typeof values.purchaseDate === "string") {
      values.purchaseDate = new Date(values.purchaseDate);
    }

    console.log("i am value", values);

    // Make the API call with error handling
    createPortfolioInput(values)
      .then((response) => {
        console.log("Form submitted successfully", response);
        setLoading(false);
        closeDialog(); // Close the dialog

        // Redirect to the dashboard after successful submission
        router.push(`/dashboard/${userId}`);
        console.log(loading);
        // Handle success, like showing a notification or redirecting
      })
      .catch((error) => {
        console.error("Failed to submit form", error);
        // Handle error, like showing an error message
      });
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        {/* Ticker Symbol */}
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormLabel>Stock Ticker</FormLabel>
                <FormDescription className="text-xs">
                  Input ticker symbol
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    value={field.value}
                    onChange={handleInputChange(field)}
                  />
                </FormControl>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purchase Date  */}
        <FormField
          control={form.control}
          name="purchaseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Purchase Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > subDays(new Date(), 1) ||
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-xs">
                The purchase date will determine the purchase price
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Inputs which will later be removed and taken directly from API */}

        {/* Currency   */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormLabel>Currency</FormLabel>
                <FormDescription className="text-xs">
                  Exchange currency
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    value={field.value}
                    onChange={handleInputChange(field)}
                  />
                </FormControl>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country   */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormLabel>Country</FormLabel>
                <FormDescription className="text-xs">
                  Company country of operation
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    value={field.value}
                    onChange={handleInputChange(field)}
                  />
                </FormControl>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
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
