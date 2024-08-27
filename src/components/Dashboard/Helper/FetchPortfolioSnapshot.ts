import prisma from "@/app/lib/db";

//Fetch portfolio data grouped by ticker and currency
export async function fetchPortfolioSnapshot(userId: string | undefined) {
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
