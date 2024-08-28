"use client";

import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import Link from "next/link";
import { StockNameType } from "@/types";

//Define the type for stock name data


export default function StockInput() {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<StockNameType[]>([]);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  //Create a useCallback Hook to memoize the function, ensuring that a re-render does not happen
  //If Debounce or AbortController resets, its useless

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

      //Create a new AbortController
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(`/api/search?q=${searchTerm}`, {
          signal: abortControllerRef.current.signal, //Signal used to abort prev request
        });

        //Return error if there is no network response
        if (!response.ok) {
          setError(true);
          // Try to extract the JSON error message from the response
          const errorData = await response.json();
          console.error("Error:", errorData.message || errorData.error);
          return; // Exit early if there's an error
        }

        // Reset the error state if the response is successful
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

        //Catch possible errors
      } catch (error: any) {
        console.error("Error fetching data", error.message);
        setError(true);
      }
    }, 300), //set the delay of the function
    []
  );

  //Call a useEffect to fetch each time the query changes
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

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className={` text-xs px-2
                    md:h-9  md:px-3 md:text-sm`}
          variant="outline"
        >
          Search Stocks
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2.5rem)] sm:max-w-[425px] rounded-lg -translate-y-full trans sm:-translate-y-1/2 ">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Enter the company name or stock ticker{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            <ul className=" text-left mt-2 ">
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <Link
                  onClick={closeDialog}
                  href={`/stock/${suggestion.symbol}`}
                  key={index}
                  className="hover:bg-slate-400 bg-black"
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
                </Link>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
