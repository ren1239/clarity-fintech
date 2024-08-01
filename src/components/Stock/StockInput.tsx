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

//Define the type for stock name data
interface StockNameType {
  symbol: string;
  name: string;
  stockExchange: string;
  exchangeShortName: string;
}

export default function StockInput() {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<StockNameType[]>([]);
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
        const response = await fetch(`api/search?q=${searchTerm}`, {
          signal: abortControllerRef.current.signal, //Signal used to abort prev request
        });

        //Return error if there is no network response
        if (!response.ok) {
          // Try to extract the JSON error message from the response
          const errorData = await response.json();
          console.error("Error:", errorData.message || errorData.error);
        }

        //Filter logic for data
        const data: StockNameType[] = await response.json();
        const filteredSuggestions = data.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filteredSuggestions);

        //Catch possible errors
      } catch (error: any) {
        console.error("Error fetching data", error.message);
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Search Stocks</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[325px]">
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
          {suggestions.length > 0 && (
            <ul className=" text-left mt-2 ">
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <Link
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
