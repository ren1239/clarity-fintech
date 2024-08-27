import { APIMarketPriceType } from "@/APItypes";
import { convertCurrency } from "@/components/Calculations/Formatter";
import { PortfolioDBDataType } from "@/types";

interface PortfolioValueBreakdown {
  totalValue: number;
  breakdown: { [ticker: string]: number };
  countryBreakdown: { [country: string]: { [ticker: string]: number } };
}

export async function calculatePortfolioValueBreakdown(
  portfolioDbData: PortfolioDBDataType[],
  validMarketPriceData: APIMarketPriceType[]
) {
  const portfolioValueMap: { [date: string]: PortfolioValueBreakdown } = {};
  const lastKnownPrices: { [entryId: string]: number } = {}; // Track by entry ID

  // Step 1: Collect all unique dates (Duplicates get ignored in sets)
  const allDatesSet = new Set<string>();
  validMarketPriceData.forEach((stockData) => {
    stockData.historical.forEach((priceData) => {
      allDatesSet.add(priceData.date);
    });
  });

  // Now you have a Set of all dates which are sorted into an array
  const allDatesArray = Array.from(allDatesSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Step 2: Calculate portfolio value and breakdown for each date
  allDatesArray.forEach((date) => {
    // Initialize the date entry if it doesn't exist
    if (!portfolioValueMap[date]) {
      portfolioValueMap[date] = {
        totalValue: 0,
        breakdown: {},
        countryBreakdown: {},
      };
    }

    const dailyTotal: { [ticker: string]: number } = {};

    portfolioDbData.forEach((dataEntry) => {
      // Only consider stocks purchased on or before this date
      if (new Date(dataEntry.purchaseDate) <= new Date(date)) {
        const stockData = validMarketPriceData.find(
          (data) => data.symbol === dataEntry.ticker
        );

        if (stockData) {
          const priceData = stockData.historical.find((pd) => pd.date === date);

          if (priceData) {
            // Track by entry ID to avoid mixing different purchases
            lastKnownPrices[dataEntry.id] =
              dataEntry.currency !== "USD"
                ? convertCurrency(
                    dataEntry.quantity * priceData.close,
                    dataEntry.currency,
                    "USD"
                  )
                : dataEntry.quantity * priceData.close;
          }

          const stockValue = lastKnownPrices[dataEntry.id] || 0;

          // Ensure each stock is counted correctly
          if (!dailyTotal[dataEntry.ticker]) {
            dailyTotal[dataEntry.ticker] = 0;
          }
          dailyTotal[dataEntry.ticker] += stockValue;

          // Ensure stock is country specific
          if (dataEntry.country) {
            if (!portfolioValueMap[date].countryBreakdown[dataEntry.country]) {
              portfolioValueMap[date].countryBreakdown[dataEntry.country] = {};
            }
            portfolioValueMap[date].countryBreakdown[dataEntry.country][
              dataEntry.ticker
            ] =
              (portfolioValueMap[date].countryBreakdown[dataEntry.country][
                dataEntry.ticker
              ] || 0) + stockValue;
          }
        }
      }
    });

    // Add up the daily totals to the portfolio map
    for (const [ticker, value] of Object.entries(dailyTotal)) {
      portfolioValueMap[date].totalValue += value;
      portfolioValueMap[date].breakdown[ticker] = value;
    }
  });

  return Object.keys(portfolioValueMap)
    .map((date) => ({
      date,
      ...portfolioValueMap[date],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
