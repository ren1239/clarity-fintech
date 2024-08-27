"use server";
import { redirect } from "next/navigation";

import PortfolioInputDialogue from "@/components/Dashboard/PortfolioInputDialogue";
import PortfolioTable from "@/components/Dashboard/PortfolioTable";

import { fetchMarketPriceFromBulk } from "@/lib/apiFetch";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Ghost } from "lucide-react";
import PortfolioOverview from "@/components/Dashboard/PortfolioOverview";
import { fetchPortfolioSnapshot } from "@/components/Dashboard/Helper/FetchPortfolioSnapshot";
import { getUserSession } from "@/components/Dashboard/Helper/GetUserSession";

export default async function DashBoardPage() {
  try {
    const user = await getUserSession();
    // Redirect to home if no user
    if (!user) {
      redirect("/");
    }
    let username = user.given_name || "New User";

    // Fetch portfolio data
    const portfolioSnapshot = await fetchPortfolioSnapshot(user.id);

    if (portfolioSnapshot?.length === 0 || !portfolioSnapshot) {
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

    const portfolioSymbols = portfolioSnapshot.map(
      (dataEntry) => dataEntry.ticker
    );
    const portfolioMarketPrice = await fetchMarketPriceFromBulk(
      portfolioSymbols
    );
    if (!portfolioMarketPrice) {
      return "Unable to fetch market price";
    }

    return (
      <div className="w-full mx-auto flex flex-col items-center gap-y-4">
        <div className=" flex-1 pt-4 justify-between items-center flex flex-col min-h-[calc(100vh-4.5rem)] lg:w-3/4 lg:px-0 w-full px-4 gap-y-4 ">
          {/* <PortfolioOverview /> */}
          <PortfolioTable
            userId={user.id}
            username={username}
            portfolioSnapshot={portfolioSnapshot}
            portfolioMarketPrice={portfolioMarketPrice}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("An error occurred while loading the dashboard:", error);
    return (
      <div className="w-3/4 h-[calc(100vh-6rem)] pt-[2rem] mx-auto">
        <Card className=" h-full flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <p>Sorry...</p>
            <p>There was an error loading your dashboard.</p>
            <Ghost />
          </div>
        </Card>
      </div>
    );
  }
}
