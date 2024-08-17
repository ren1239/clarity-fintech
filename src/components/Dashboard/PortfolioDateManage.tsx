import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import { format, subYears } from "date-fns";

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
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const portfolioDbData: PortfolioDBDataType[] = await fetchPortfolioData(
    user?.id
  );

  const portfolioReq = groupPortfolioByTicker(portfolioDbData);

  console.log(portfolioReq);

  return <div>PortfolioDateManage</div>;
}

//Helper functionf or date setting
function formateDate(date: string | Date): string {
  return format(new Date(date), "yyyy-MM-dd");
}

async function fetchPortfolioData(
  userId: string | undefined
): Promise<PortfolioDBDataType[]> {
  if (!userId) {
    return [];
  }
  try {
    const unsortedPortfolioDB = await prisma.stock.findMany({
      where: { userId },
      orderBy: { purchaseDate: "asc" },
    });
    return unsortedPortfolioDB.map((stock) => ({
      ...stock,
      purchaseDate: formateDate(stock.purchaseDate),
      createdAt: formateDate(stock.createdAt),
      updatedAt: formateDate(stock.updatedAt),
    }));
  } catch (error) {
    console.error("Error fetching portfolio data from DB", error);
    return [];
  }
}

function groupPortfolioByTicker(
  portfolioDbData: PortfolioDBDataType[]
): GroupedPortfolioType[] {
  const portfolioMap = portfolioDbData.reduce(
    (acc: { [key: string]: GroupedPortfolioType }, stock) => {
      if (!acc[stock.ticker]) {
        acc[stock.ticker] = {
          symbol: stock.ticker,
          earliestPurchaseDate: stock.purchaseDate,
        };
      } else {
        if (
          new Date(stock.purchaseDate) <
          new Date(acc[stock.ticker].earliestPurchaseDate)
        ) {
          acc[stock.ticker].earliestPurchaseDate = stock.purchaseDate;
        }
      }
      return acc;
    },
    {}
  );
  return Object.values(portfolioMap);
}
