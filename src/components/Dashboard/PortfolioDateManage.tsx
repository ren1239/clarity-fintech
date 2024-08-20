import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import { format } from "date-fns";
import { fetchMarketPriceFromDate } from "@/lib/apiFetch";
import { unstable_cache } from "next/cache";
import { APIMarketPriceType } from "@/APItypes";
import { redirect } from "next/navigation";
import { convertCurrency } from "../Calculations/Formatter";
import { PortfolioValueChart } from "./PortfolioValueChart";
import { PortfolioPieChart } from "./PortfolioPieChart";

export interface PortfolioDBDataType {
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  ticker: string;
  purchasePrice: number;
  quantity: number;
  currency: string;
  country: string;
  sector: string | null;
  industry: string | null;
  exchange: string | null;
  userId: string | null;
}

export interface GroupedPortfolioType {
  symbol: string;
  earliestPurchaseDate: string;
}

export default async function PortfolioDateManage() {
  // Get the user or bounce the unknown viewer
  const user = await getUserSession();
  if (!user) {
    console.error("User is not authenticated");
    redirect("/");
  }

  try {
    const portfolioDbData: PortfolioDBDataType[] = await fetchUserPortfolio(
      user.id
    );
    const portfolioRequests = groupPortfolioByEarliestPurchase(portfolioDbData);

    const marketPrices = await fetchMarketPricesForPortfolio(portfolioRequests);
    const validMarketPrices = filterValidMarketPrices(marketPrices);

    if (validMarketPrices.length > 0) {
      const portfolioValueData = await calculateTotalPortfolioValue(
        portfolioDbData,
        validMarketPrices
      );
      //   console.log(portfolioValueData[portfolioValueData.length - 1]);
      console.log(portfolioValueData.slice(-5));

      return (
        <div className=" flex flex-col w-full gap-4  ">
          <PortfolioValueChart portfolioValueData={portfolioValueData} />
          <PortfolioPieChart portfolioValueData={portfolioValueData} />
        </div>
      );
    } else {
      console.error("No valid market price data was returned");
      return <div>No Data avaliable</div>;
    }
  } catch (error) {
    console.error("Error managing portfolio data", error);
    return <div> There was an error processing your portfolio</div>;
  }
}

//  ----------------- Helper functions -------------------- //
//
//
//
async function getUserSession() {
  const { getUser } = getKindeServerSession();
  return getUser();
}

async function fetchUserPortfolio(
  userId: string
): Promise<PortfolioDBDataType[]> {
  try {
    const portfolio = await prisma.stock.findMany({
      where: { userId },
      orderBy: { purchaseDate: "asc" },
    });

    // Map throught data to format the date into a string
    return portfolio.map((stock) => ({
      ...stock,
      purchaseDate: formatDate(stock.purchaseDate),
      createdAt: formatDate(stock.createdAt),
      updatedAt: formatDate(stock.updatedAt),
    }));
  } catch (error) {
    console.error("Error fetching portfolio data from DB", error);
    return [];
  }
}

function groupPortfolioByEarliestPurchase(
  portfolioDbData: PortfolioDBDataType[]
): GroupedPortfolioType[] {
  const portfolioMap: { [key: string]: GroupedPortfolioType } = {};

  portfolioDbData.forEach((dataEntry) => {
    if (!portfolioMap[dataEntry.ticker]) {
      portfolioMap[dataEntry.ticker] = {
        symbol: dataEntry.ticker,
        earliestPurchaseDate: dataEntry.purchaseDate,
      };
    } else {
      if (
        new Date(dataEntry.purchaseDate) <
        new Date(portfolioMap[dataEntry.ticker].earliestPurchaseDate)
      ) {
        portfolioMap[dataEntry.ticker].earliestPurchaseDate =
          dataEntry.purchaseDate;
      }
    }
  });

  return Object.values(portfolioMap);
}

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

function formatDate(date: string | Date): string {
  return format(new Date(date), "yyyy-MM-dd");
}

interface PortfolioValueBreakdown {
  totalValue: number;
  breakdown: { [ticker: string]: number };
  countryBreakdown: { [country: string]: { [ticker: string]: number } };
}

async function calculateTotalPortfolioValue(
  portfolioDbData: PortfolioDBDataType[],
  validMarketPriceData: APIMarketPriceType[]
) {
  const portfolioValueMap: { [date: string]: PortfolioValueBreakdown } = {};
  const lastKnownPrices: { [entryId: string]: number } = {}; // Track by entry ID

  // Step 1: Collect all unique dates (Duplicates get ignored in sets)
  const allDatesSet = new Set<string>();
  validMarketPriceData.forEach((stockData) => {
    stockData.historical.forEach((priceData) => {
      allDatesSet.add(priceData.date);
    });
  });

  // Now you have a Set of all dates which are sorted into an array
  const allDatesArray = Array.from(allDatesSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Step 2: Calculate portfolio value and breakdown for each date
  allDatesArray.forEach((date) => {
    // Initialize the date entry if it doesn't exist
    if (!portfolioValueMap[date]) {
      portfolioValueMap[date] = {
        totalValue: 0,
        breakdown: {},
        countryBreakdown: {},
      };
    }

    const dailyTotal: { [ticker: string]: number } = {};

    portfolioDbData.forEach((dataEntry) => {
      // Only consider stocks purchased on or before this date
      if (new Date(dataEntry.purchaseDate) <= new Date(date)) {
        const stockData = validMarketPriceData.find(
          (data) => data.symbol === dataEntry.ticker
        );

        if (stockData) {
          const priceData = stockData.historical.find((pd) => pd.date === date);

          if (priceData) {
            // Track by entry ID to avoid mixing different purchases
            lastKnownPrices[dataEntry.id] =
              dataEntry.currency !== "USD"
                ? convertCurrency(
                    dataEntry.quantity * priceData.close,
                    dataEntry.currency,
                    "USD"
                  )
                : dataEntry.quantity * priceData.close;
          }

          const stockValue = lastKnownPrices[dataEntry.id] || 0;

          // Ensure each stock is counted correctly
          if (!dailyTotal[dataEntry.ticker]) {
            dailyTotal[dataEntry.ticker] = 0;
          }
          dailyTotal[dataEntry.ticker] += stockValue;

          // Ensure stock is country specific
          if (dataEntry.country) {
            if (!portfolioValueMap[date].countryBreakdown[dataEntry.country]) {
              portfolioValueMap[date].countryBreakdown[dataEntry.country] = {};
            }
            portfolioValueMap[date].countryBreakdown[dataEntry.country][
              dataEntry.ticker
            ] =
              (portfolioValueMap[date].countryBreakdown[dataEntry.country][
                dataEntry.ticker
              ] || 0) + stockValue;
          }
        }
      }
    });

    // Add up the daily totals to the portfolio map
    for (const [ticker, value] of Object.entries(dailyTotal)) {
      portfolioValueMap[date].totalValue += value;
      portfolioValueMap[date].breakdown[ticker] = value;
    }
  });

  return Object.keys(portfolioValueMap)
    .map((date) => ({
      date,
      ...portfolioValueMap[date],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
