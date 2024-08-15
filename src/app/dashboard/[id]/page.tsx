import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { moneyFormatter } from "@/components/Calculations/Formatter";
import { fetchMarketPrice, fetchportfolioMarketPrice } from "@/lib/apiFetch";
import { APIMarketPriceType, APIPortfolioMarketPriceType } from "@/APItypes";

import { unstable_noStore as noStore } from "next/cache";
import { symbol } from "zod";
import { PortfolioChart } from "@/components/Dashboard/PortfolioChart";

export default async function DashboardPage() {
  //Dont store data because you want fresh data each re-fresh
  noStore();

  //Get user data or bounce the unknown viewer
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  //Pull portfolio data but group multiple transactions into one
  const portfolioData = await prisma.stock.groupBy({
    by: ["ticker"],
    where: {
      userId: user?.id,
    },
    _sum: {
      quantity: true,
    },
    _avg: {
      purchasePrice: true,
    },
  });

  //Create an array of symbols
  const portfolioSymbols: string[] = portfolioData.map(
    (dataEntry) => dataEntry.ticker
  );

  //Make an API call for historic data for each ticker symbol

  const portfolioHistoricPrice: APIMarketPriceType[] | null = await Promise.all(
    portfolioSymbols.map((symbol) => fetchMarketPrice(symbol))
  )
    .then((results) => {
      // Filter out any null values from the results
      const validResults = results.filter(
        (result): result is APIMarketPriceType => result !== null
      );
      return validResults.length > 0 ? validResults : null;
    })
    .catch((error) => {
      console.error("Error fetching historic prices:", error);
      return null;
    });

  if (!portfolioHistoricPrice) {
    console.error("Failed to fetch historic prices.");
    return (
      <div>
        <p>Welcome {user?.given_name}!</p>
        <p>
          Unable to fetch your portfolio data at this time. Please try again
          later.
        </p>
      </div>
    );
  }

  //Initialiez an empty object to group data
  const portfolioByDate: { [key: string]: { [key: string]: number } } = {};

  //Iterate through portfolioHistroicalPrice
  portfolioHistoricPrice.forEach((entry) => {
    const symbol = entry.symbol;

    const shares =
      portfolioData.find((dataEntry) => dataEntry.ticker === symbol)?._sum
        .quantity ?? 0;

    entry.historical.forEach((historicalEntry) => {
      const date = historicalEntry.date;
      const price = historicalEntry.open;

      //if date does not exist in portfolioByDate, initialise it
      if (!portfolioByDate[date]) {
        portfolioByDate[date] = {};
      }
      portfolioByDate[date][symbol] = shares * price;
    });
  });

  const portfolioArray = Object.keys(portfolioByDate).map((date) => {
    return {
      date: date,
      ...portfolioByDate[date],
    };
  });

  console.log("this is the first from the array");

  //Make a API call for todays data for each ticker symbol
  const portfolioMarketPrice: APIPortfolioMarketPriceType[] | null =
    await fetchportfolioMarketPrice(portfolioSymbols);

  const marketValueArray: number[] = portfolioData.map((stock) => {
    const marketPrice = portfolioMarketPrice?.find(
      (item) => item.symbol === stock.ticker
    )?.price;

    const shares = stock._sum.quantity ?? 0;
    return shares * (marketPrice ?? 0);
  });

  // Calculate total portfolio value

  const totalPortfolioValue: number = marketValueArray.reduce(
    (acc, curr) => (acc += curr),
    0
  );

  return (
    <div>
      <p>Welcome {user?.given_name}!</p>
      <p>Your Portfolio is worth {moneyFormatter(totalPortfolioValue)}</p>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Shares</th>
            <th>Avg Cost</th>
            <th>Price</th>
            <th>Market Value</th>
          </tr>
        </thead>
        <tbody>
          {portfolioData.map((stock) => {
            const marketPrice = portfolioMarketPrice?.find(
              (item) => item.symbol === stock.ticker
            )?.price;

            return (
              <tr key={stock.ticker}>
                <td>{stock.ticker}</td>
                <td>{stock._sum.quantity ?? "N/A"}</td>
                <td>{moneyFormatter(stock._avg.purchasePrice ?? 0)}</td>
                <td>{moneyFormatter(marketPrice ?? 0)}</td>
                <td>
                  {moneyFormatter(
                    (marketPrice ?? 0) * (stock._sum.quantity ?? 0)
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <PortfolioChart
        portfolioArray={portfolioArray}
        portfolioSymbols={portfolioSymbols}
      />
    </div>
  );
}
