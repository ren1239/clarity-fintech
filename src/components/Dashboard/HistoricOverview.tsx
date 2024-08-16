import React from "react";
import { PortfolioChart } from "./PortfolioChart";
import { PortfolioDBType, PriceByDateType } from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { APIMarketPriceType } from "@/APItypes";
import { fetchMarketPrice } from "@/lib/apiFetch";

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

  const priceByDate: PriceByDateType = {};

  //Iterate through portfolio historic prices with for each, because you want side effects, not a returned array
  marketPrice.forEach((entry) => {
    const symbol = entry.symbol;
    const shares =
      portfolioDbData.find((dataEntry) => dataEntry.ticker === symbol)?._sum
        .quantity ?? 0;

    entry.historical.forEach((historicalEntry) => {
      const date = historicalEntry.date;
      const price = historicalEntry.open || 0;

      //If the date does not exist, create it an empty object
      if (!priceByDate[date]) {
        priceByDate[date] = {};
      }

      priceByDate[date][symbol] = shares * price;
    });
  });

  const portfolioMarketData = Object.keys(priceByDate).map((date) => {
    return {
      date: date,
      ...priceByDate[date],
    };
  });
  return (
    <div>
      PortfolioValueCard
      <PortfolioChart
        portfolioMarketData={portfolioMarketData}
        portfolioSymbols={portfolioSymbols}
        totalPortfolioValue={totalPortfolioValue}
      />
    </div>
  );
}
