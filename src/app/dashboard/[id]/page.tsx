"use server";
import { redirect } from "next/navigation";

import PortfolioInputDialogue from "@/components/Dashboard/PortfolioInputDialogue";
import PortfolioTable from "@/components/Dashboard/PortfolioTable";

import { fetchCompanyProfile, fetchMarketPriceFromBulk } from "@/lib/apiFetch";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Ghost } from "lucide-react";
import PortfolioOverview from "@/components/Dashboard/PortfolioOverview";
import { fetchPortfolioSnapshot } from "@/components/Dashboard/Helper/FetchPortfolioSnapshot";
import { getUserSession } from "@/components/Dashboard/Helper/GetUserSession";
import { unstable_cache } from "next/cache";
import { APICompanyProfileType } from "@/APItypes";
import { PortfolioSnapshotType } from "@/types";

export default async function DashBoardPage() {
  try {
    const user = await getUserSession();
    // Redirect to home if no user
    if (!user) {
      redirect("/");
    }
    let username = user.given_name || "New User";

    // Fetch portfolio data
    const portfolioSnapshot: PortfolioSnapshotType[] =
      (await fetchPortfolioSnapshot(user.id)) || [];

    console.log(portfolioSnapshot);

    if (portfolioSnapshot?.length === 0 || !portfolioSnapshot) {
      return <FallbackUI userId={user.id} />;
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

    const companyProfileArray = (
      await fetchCompanyProfileArray(portfolioSymbols)
    ).filter((profile): profile is APICompanyProfileType => profile !== null);

    if (companyProfileArray.length === 0) {
      return <FallbackUI userId={user.id} />;
    }

    return (
      <div className="w-full mx-auto flex flex-col items-center gap-y-4">
        <div className=" flex-1 pt-4 justify-between items-center flex flex-col min-h-[calc(100vh-4.5rem)] lg:w-3/4 lg:px-0 w-full px-4 gap-y-4 ">
          <PortfolioOverview />
          <PortfolioTable
            userId={user.id}
            username={username}
            portfolioSnapshot={portfolioSnapshot}
            portfolioMarketPrice={portfolioMarketPrice}
            companyProfileArray={companyProfileArray}
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

function FallbackUI({ userId }: { userId: string }) {
  return (
    <div className="w-3/4 h-[calc(100vh-6rem)] pt-[2rem] mx-auto">
      <Card className=" h-full flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <p>Sorry...</p>
          <p>You do not have any listings in your portfolio</p>
          <Skeleton className="w-full h-4" />
          <Ghost />
          <PortfolioInputDialogue userId={userId} />
        </div>
      </Card>
    </div>
  );
}

const createFetchCache = (symbol: string) =>
  unstable_cache(
    async () => {
      return fetchCompanyProfile(symbol);
    },
    [`companyProfile:${symbol}`],
    { tags: [`profile`], revalidate: 86500 }
  );

async function fetchCompanyProfileArray(portfolioSymbols: string[]) {
  const companyProfilePromise = portfolioSymbols.map((symbol) => {
    const fetchFunction = createFetchCache(symbol);
    return fetchFunction();
  });
  return await Promise.all(companyProfilePromise);
}
