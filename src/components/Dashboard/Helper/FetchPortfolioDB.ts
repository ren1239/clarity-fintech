import prisma from "@/app/lib/db";
import { PortfolioDBDataType } from "@/types";
import { format } from "date-fns";

function formatDate(date: string | Date): string {
  return format(new Date(date), "yyyy-MM-dd");
}

export async function fetchPortfolioDB(
  userId: string
): Promise<PortfolioDBDataType[]> {
  try {
    const portfolio = await prisma.stock.findMany({
      where: { userId },
      orderBy: { ticker: "asc" },
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
