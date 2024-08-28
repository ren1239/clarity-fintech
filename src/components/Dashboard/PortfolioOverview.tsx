import React from "react";

import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

import { fetchMarketPriceFromDate } from "@/lib/apiFetch";
import { APIMarketPriceType } from "@/APItypes";
import { GroupedPortfolioType, PortfolioDBDataType } from "@/types";

import { PortfolioValueChart } from "./PortfolioValueChart";
import { PortfolioPieChart } from "./PortfolioPieChart";
import { fetchPortfolioDB } from "./Helper/FetchPortfolioDB";
import { getUserSession } from "./Helper/GetUserSession";
import { groupEarliestPurchase } from "./Helper/GroupEarliestPurchase";
import { calculatePortfolioValueBreakdown } from "./Helper/CalculatePortfolioValueBreakdown";

import { Card } from "../ui/card";
import { Ghost } from "lucide-react";

export default async function PortfolioOverview() {
  try {
    // Get the user or bounce the unknown viewer
    const user = await getUserSession();
    if (!user) {
      console.error("User is not authenticated");
      redirect("/");
    }
    const portfolioDbData: PortfolioDBDataType[] = await fetchPortfolioDB(
      user.id
    );
    const portfolioRequests = groupEarliestPurchase(portfolioDbData);
    const marketPrices = await fetchMarketPricesForPortfolio(portfolioRequests);
    const validMarketPrices = filterValidMarketPrices(marketPrices);

    if (validMarketPrices.length > 0) {
      const portfolioValueData = await calculatePortfolioValueBreakdown(
        portfolioDbData,
        validMarketPrices
      );

      return (
        <div className=" flex flex-col w-full gap-4  ">
          <PortfolioValueChart portfolioValueData={portfolioValueData} />
          <PortfolioPieChart portfolioValueData={portfolioValueData} />
        </div>
      );
    } else {
      console.error("No valid market price data was returned");
      <div className="w-3/4 h-[calc(100vh-6rem)] pt-[2rem] mx-auto">
        <Card className=" h-full flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <p>Sorry...</p>
            <p>No Market Data Avaliable ... Try again later</p>
            <Ghost />
          </div>
        </Card>
      </div>;
    }
  } catch (error) {
    console.error("Error managing portfolio data", error);
    <div className="w-3/4 h-[calc(100vh-6rem)] pt-[2rem] mx-auto">
      <Card className=" h-full flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <p>Sorry...</p>
          <p>There was an error loading your dashboard.</p>
          <Ghost />
        </div>
      </Card>
    </div>;
  }
}

//  ----------------- Helper functions -------------------- //
//
//
//

const createFetchCache = (symbol: string, purchaseDate: string) =>
  unstable_cache(
    async () => {
      return fetchMarketPriceFromDate(symbol, purchaseDate);
    },
    [`marketPrice:${symbol}`],
    { tags: [`market-date`], revalidate: 5 }
  );

async function fetchMarketPricesForPortfolio(
  portfolioRequests: GroupedPortfolioType[]
) {
  const marketPricePromises = portfolioRequests.map((stock) => {
    const fetchFunction = createFetchCache(
      stock.symbol,
      stock.earliestPurchaseDate
    );
    return fetchFunction();
  });
  return await Promise.all(marketPricePromises);
}

function filterValidMarketPrices(
  data: (APIMarketPriceType | null)[]
): APIMarketPriceType[] {
  return data.filter((item): item is APIMarketPriceType => item !== null);
}
