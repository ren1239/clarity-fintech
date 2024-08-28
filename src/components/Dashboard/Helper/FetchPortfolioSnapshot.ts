import prisma from "@/app/lib/db";
import { GroupedPortfolioDataType, PortfolioSnapshotType } from "@/types";

//Fetch portfolio data grouped by ticker and currency
export async function fetchPortfolioSnapshot(userId: string | undefined) {
  if (!userId) return null;

  try {
    const portfolioSnapshotData = await prisma.stock.groupBy({
      by: ["ticker", "currency"],
      where: { userId },
      _sum: { quantity: true },
      _avg: { purchasePrice: true },
      orderBy: { ticker: "asc" },
    });

    //For each group, find the latest target price

    const snapshotWithTarget: PortfolioSnapshotType[] = await Promise.all(
      portfolioSnapshotData.map(async (group: any) => {
        const latestTargetPrice = await prisma.priceTarget.findFirst({
          where: {
            ticker: group.ticker,
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            priceTarget: true,
          },
        });
        return {
          ...group,
          targetPrice: latestTargetPrice?.priceTarget ?? 0,
        };
      })
    );

    return snapshotWithTarget;
  } catch (error) {
    console.error("Error fetching portfolio data", error);
  }
}
