import React from "react";
import { PortfolioChart } from "./PortfolioChart";
import { PortfolioDBType, PriceByDateType } from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { APIMarketPriceType } from "@/APItypes";
import { fetchMarketPrice } from "@/lib/apiFetch";
import { convertCurrency } from "../Calculations/Formatter";

export const revalidate = 86400; // Revalidate data every 24 hours

export default async function HistoricOverview({
  portfolioDbData,
  portfolioSymbols,
  totalPortfolioValue,
}: {
  portfolioDbData: PortfolioDBType[];
  portfolioSymbols: string[];
  totalPortfolioValue: number | null;
}) {
  // Get the user or bounce the unknown viewer
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  //
  //
  //
  //Make a looping API call for all histroic data- this is for the chart
  const marketPrice: APIMarketPriceType[] | null = await Promise.all(
    portfolioSymbols.map((symbol) => fetchMarketPrice(symbol))
  )
    .then((results) => {
      //Filter out the null values from the results
      const validResults = results.filter((result) => result !== null);
      return validResults.length > 0 ? validResults : null;
    })
    .catch((error) => {
      console.error("Failed to fetch historic data prices", error);
      return null;
    });

  if (!marketPrice) {
    console.error("Failed to fetch historic data prices");
    return (
      <div>
        <p>Welcome {user?.given_name}!</p>
        <p>Sorry we are unable to find your portfolio data at this time.</p>
      </div>
    );
  }

  //
  //
  //
  // Create a new component to handle the historic price of entire portfolio

  const priceByDate: PriceByDateType[] = [];

  //Iterate through portfolio historic prices with for each, because you want side effects, not a returned array
  marketPrice.forEach((entry) => {
    const symbol = entry.symbol;
    const shares =
      portfolioDbData.find((dataEntry) => dataEntry.ticker === symbol)?._sum
        .quantity ?? 0;

    let lastPrice = 0;

    entry.historical.reverse().forEach((historicalEntry) => {
      const date = historicalEntry.date;
      const price = historicalEntry.open || 0;
      const calculatedPrice = shares * price;

      let dateEntry = priceByDate.find((d) => d.date === date);
      if (!dateEntry) {
        dateEntry = { date: date, prices: {} };
        priceByDate.push(dateEntry);
      }

      // Perform currency conversion if necessary
      const stockCurrency =
        portfolioDbData.find((dataEntry) => dataEntry.ticker === symbol)
          ?.currency || "USD";

      const convertedPrice =
        stockCurrency !== "USD"
          ? convertCurrency(calculatedPrice, stockCurrency, "USD")
          : calculatedPrice;

      dateEntry.prices[symbol] = convertedPrice || lastPrice;
      lastPrice = dateEntry.prices[symbol];
    });
  });

  priceByDate.forEach((dateEntry, index, array) => {
    portfolioSymbols.forEach((symbol) => {
      if (!(symbol in dateEntry.prices)) {
        if (index > 0) {
          const previousEntry = array[index - 1];
          dateEntry.prices[symbol] = previousEntry.prices[symbol];
        } else {
          dateEntry.prices[symbol] = 0; // Default to 0 if there's no previous data
        }
      }
    });
  });

  const portfolioMarketData = priceByDate.map((entry) => ({
    date: entry.date,
    ...entry.prices,
  }));

  return (
    <div className="w-full">
      <PortfolioChart
        portfolioMarketData={portfolioMarketData}
        portfolioSymbols={portfolioSymbols}
        totalPortfolioValue={totalPortfolioValue}
      />
    </div>
  );
}
