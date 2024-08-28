import { GroupedPortfolioType, PortfolioDBDataType } from "@/types";

export function groupEarliestPurchase(
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
