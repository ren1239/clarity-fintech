"use server";
import { APIPortfolioBatchPriceType } from "@/APItypes";
import prisma from "@/app/lib/db";
import { convertCurrency } from "@/components/Calculations/Formatter";
import PortfolioDateManage from "@/components/Dashboard/PortfolioDateManage";
import PortfolioInputDialogue from "@/components/Dashboard/PortfolioInputDialogue";
import PortfolioTable from "@/components/Dashboard/PortfolioTable";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMarketPriceFromBulk } from "@/lib/apiFetch";
import { PortfolioDBType } from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Ghost } from "lucide-react";
import { redirect } from "next/navigation";

// Constants
const BASE_CURRENCY = "USD";

export default async function DashBoardPage() {
  // Get the user or bounce the unknown viewer
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Redirect to home if no user
  if (!user) {
    redirect("/");
  }

  let username = user.given_name || "";

  // Fetch portfolio data
  const portfolioDbData = await fetchPortfolioDate(user?.id);

  console.log("portfolioData", portfolioDbData);
  if (portfolioDbData?.length === 0 || !portfolioDbData) {
    return (
      <div className="w-3/4 h-[calc(100vh-6rem)] pt-[2rem] mx-auto">
        <Card className=" h-full flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <p>Sorry...</p>
            <p>You do not have any listings in your portfolio</p>
            <Skeleton className="w-full h-4" />
            <Ghost />
            <PortfolioInputDialogue userId={user.id} />
          </div>
        </Card>
      </div>
    );
  }

  // Fetch market prices
  const portfolioSymbols = portfolioDbData.map((dataEntry) => dataEntry.ticker);
  const portfolioMarketPrice = await fetchMarketPriceFromBulk(portfolioSymbols);
  if (!portfolioMarketPrice) {
    return "Unable to fetch market price";
  }

  // Calculate total portfolio value
  const totalPortfolioValue = calculateTotalPortfolioValue(
    portfolioDbData,
    portfolioMarketPrice
  );
  if (totalPortfolioValue === null) {
    return "Unable to calculate your portfolio value at this time.";
  }

  return (
    <div className="w-full mx-auto flex flex-col items-center gap-y-4">
      <div className=" flex-1 pt-4 justify-between items-center flex flex-col min-h-[calc(100vh-4.5rem)] lg:w-3/4 lg:px-0 w-full px-4 gap-y-4 ">
        <PortfolioDateManage />
        <PortfolioInputDialogue userId={user.id} />
        <PortfolioTable
          username={username}
          portfolioDbData={portfolioDbData}
          portfolioMarketPrice={portfolioMarketPrice}
        />
      </div>
    </div>
  );
}

//Fetch portfolio data grouped by ticker and currency
async function fetchPortfolioDate(userId: string | undefined) {
  if (!userId) return null;
  try {
    return await prisma.stock.groupBy({
      by: ["ticker", "currency"],
      where: { userId },
      _sum: { quantity: true },
      _avg: { purchasePrice: true },
      orderBy: { ticker: "asc" },
    });
  } catch (error) {
    console.error("Error fetching portfolio data", error);
    return null;
  }
}

//Calculate total portfolio value

function calculateTotalPortfolioValue(
  portfolioDbData: PortfolioDBType[],
  portfolioMarketPrice: APIPortfolioBatchPriceType[]
): number | null {
  try {
    if (portfolioDbData.length === 0) return null;

    const marketValueArray = portfolioDbData.map((stock) => {
      const marketPrice =
        portfolioMarketPrice.find((item) => item.symbol === stock.ticker)
          ?.price || 0;

      const convertedPrice =
        stock.currency !== BASE_CURRENCY
          ? convertCurrency(marketPrice, stock.currency, BASE_CURRENCY)
          : marketPrice;

      const shares = stock._sum.quantity ?? 0;
      return shares * convertedPrice;
    });
    return marketValueArray.reduce((acc, curr) => acc + curr, 0);
  } catch (error) {
    console.error("Error calculating total portfolio value", error);
    return null;
  }
}
