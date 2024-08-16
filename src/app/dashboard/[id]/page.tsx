"use server";
import { APIPortfolioMarketPriceType } from "@/APItypes";
import prisma from "@/app/lib/db";
import { moneyFormatter } from "@/components/Calculations/Formatter";
import HistoricOverview from "@/components/Dashboard/HistoricOverview";
import { fetchPortfolioMarketPrice } from "@/lib/apiFetch";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function DashBoardPage() {
  // Get the user or bounce the unknown viewer
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  //Pull portfolio data as grouped by symbol

  const portfolioDbData = await prisma.stock.groupBy({
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
  const portfolioSymbols: string[] = portfolioDbData.map(
    (dataEntry) => dataEntry.ticker
  );

  //Make an API call for portfolio market data - make 1 call for all data

  const portfolioMarketPrice: APIPortfolioMarketPriceType[] | null =
    await fetchPortfolioMarketPrice(portfolioSymbols);

  // Calculate the total value of the portfolio

  // Declare totalPortfolioValue outside of the try block
  let totalPortfolioValue: number | null = null;
  try {
    if (!Array.isArray(portfolioDbData) || portfolioDbData.length === 0) {
      throw new Error(
        "Invalid portfolio data. Expected an array with atleast one entry"
      );
    }
    const marketValueArray: number[] = portfolioDbData.map((symbol) => {
      if (!symbol || typeof symbol.ticker !== "string") {
        throw new Error(`Invalid symbol data: ${JSON.stringify(symbol)}`);
      }
      const matchingSymbol = portfolioMarketPrice?.find(
        (item) => item.symbol === symbol.ticker
      );

      const marketPrice = matchingSymbol?.price;
      const shares = symbol._sum.quantity ?? 0;
      return shares * (marketPrice ?? 0);
    });

    console.log("market value array", marketValueArray);

    if (!Array.isArray(marketValueArray) || marketValueArray.length === 0) {
      throw new Error("Invalid portfolio Data, Market value is empty");
    }
    totalPortfolioValue = marketValueArray.reduce(
      (acc, curr) => (acc += curr),
      0
    );

    console.log("total portfolio value", totalPortfolioValue);
  } catch (error) {
    console.error(
      "An error occurred while calculating portfolio value:",
      error
    );
  }

  return (
    <div>
      <p>Welcome {user?.given_name}!</p>
      {totalPortfolioValue ? (
        <p>Your Portfolio is worth {moneyFormatter(totalPortfolioValue)}</p>
      ) : (
        <p>Unable to calculate your portfolio value at this time.</p>
      )}{" "}
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
          {portfolioDbData.map((stock) => {
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
      <HistoricOverview
        portfolioDbData={portfolioDbData}
        portfolioSymbols={portfolioSymbols}
        totalPortfolioValue={totalPortfolioValue}
      />
    </div>
  );
}
