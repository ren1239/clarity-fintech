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
import { useCallback, useEffect, useRef, useState } from "react";
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
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { StockNameType } from "@/types";
import debounce from "lodash.debounce";
import { fetchCompanyProfile } from "@/lib/apiFetch";
import { APICompanyProfileType } from "@/APItypes";

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
  const [symbol, setSymbol] = useState<string>("");
  const [companyProfile, setCompanyProfile] =
    useState<APICompanyProfileType | null>(null);

  //Set state for loading

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!symbol) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/fetchstockdata/companyprofile?symbol=${symbol}`
        );
        if (!response.ok) {
          throw new Error("Company profile not found");
        }
        const data: APICompanyProfileType = await response.json();
        setCompanyProfile(data);
      } catch (error) {
        console.error("Error fetching company profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [symbol]);

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

  const { setValue } = form;

  // Update the form's ticker value whenever the symbol changes
  useEffect(() => {
    setValue("ticker", symbol);
    if (companyProfile) {
      console.log("i am updating this data for company profile");
      setValue("currency", companyProfile.currency || "");
      setValue("country", companyProfile.country || "");
      setValue("sector", companyProfile.sector || "");
      setValue("industry", companyProfile.industry || "");
      setValue("exchange", companyProfile.exchange || "");
    }
  }, [symbol, companyProfile, setValue]);

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
      <StockInput symbol={symbol} setSymbol={setSymbol} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
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
        {/* <FormField
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
        /> */}

        {/* Country   */}
        {/* <FormField
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
        /> */}
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

export function StockInput({
  symbol,
  setSymbol,
}: {
  symbol: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<StockNameType[]>([]);
  const [error, setError] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  //Create a useCallback hook to memoize the function, ensuring the re-render does notn happend
  //if debounce or abortController reserts

  const fetchSuggestions = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length === 0) {
        setSuggestions([]);
        return;
      }

      //Check if the abort controller is current
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      //Create a new abortController
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(`/api/search?q=${searchTerm}`, {
          signal: abortControllerRef.current.signal, //signal used to prevent request
        });

        //Return an error if no network response
        if (!response.ok) {
          setError(true);
          //Try to extract the JSON error from response
          const errorData = await response.json();
          console.error("Error", errorData.message || errorData.error);
          return;
        }

        //Reset the error state if response is OK
        setError(false);

        //Filter logic for data

        const data: StockNameType[] = await response.json();
        const filteredSuggestions = data.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredSuggestions.length === 0) {
          setError(true);
        }
        setSuggestions(filteredSuggestions);
      } catch (error: any) {
        console.error("Error fetching data", error.message);
        setError(true);
      }
    }, 300),
    []
  );

  // Call a useEffect to fetch each time the query changes
  useEffect(() => {
    fetchSuggestions(query);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [query, fetchSuggestions]);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  console.log("symbol clicked", symbol);

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleClick = (suggestion: StockNameType) => {
    setSymbol(suggestion.symbol);
    closeDialog();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className={` text-xs px-2
                    md:h-9  md:px-3 md:text-sm`}
          variant={symbol === "" ? "outline" : "secondary"}
        >
          {symbol === "" ? "Search Stock" : symbol}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2.5rem)] sm:max-w-[425px] rounded-lg -translate-y-full trans sm:-translate-y-1/2 ">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Enter the company name or stock ticker
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 px-4">
          <Input
            id="stock"
            type="text"
            value={query}
            onChange={inputChangeHandler}
            placeholder="aapl"
          />
          {error && (
            <div className="text-red-500 text-xs">
              Error finding stock. Please try again.
            </div>
          )}

          {suggestions.length > 0 && (
            <ul className=" text-left mt-2 sm:max-w-[200px] ">
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <Button
                  variant={"ghost"}
                  onClick={() => handleClick(suggestion)}
                  key={index}
                  className=""
                >
                  <li className="px-2 pt-1 hover:bg-neutral-100 rounded-md">
                    <div className="flex flex-col text-left">
                      <div className=" line-clamp-1">
                        <strong>{suggestion.symbol}</strong> - {suggestion.name}
                      </div>
                      <span className="text-xs line-clamp-1 font-light text-muted-foreground">
                        Exchange: {suggestion.stockExchange} (
                        {suggestion.exchangeShortName})
                      </span>
                    </div>
                  </li>
                </Button>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

{
  /* Ticker Symbol
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
        /> */
}
