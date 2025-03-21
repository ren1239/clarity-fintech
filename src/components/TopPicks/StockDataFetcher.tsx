import { useState, useEffect } from "react";

interface StockData {
  symbol: string;
  price: number;
  name: string;
}

export const useStockDataFetcher = (symbols: string[]) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/fetchstockdata/market-price-from-bulk?symbols=${symbols.join(
            ","
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stock data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("An error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbols]);

  return { data, loading, error };
};
