"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Table, List } from "lucide-react";
import { StockCard } from "./StockCard";
import { useStockDataFetcher } from "./StockDataFetcher";

//
// ─── INTERFACES ────────────────────────────────────────────────────────────────
//

interface StockData {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
  dcfValue: number;
  morningstarValue: number;
  marginOfSafety: number;
  rating: number;
  sector: string;
}

interface SortConfig {
  key: keyof StockData;
  direction: "asc" | "desc";
}

//
// ─── PLACEHOLDER DATA ──────────────────────────────────────────────────────────
//

const placeholderData: StockData[] = [
  {
    id: 1,
    symbol: "META",
    name: "Meta",
    currentPrice: 189.25,
    dcfValue: 670,
    morningstarValue: 0,
    marginOfSafety: 0,
    rating: 4.9,
    sector: "Technology",
  },
  {
    id: 2,
    symbol: "9988.HK",
    name: "Alibaba",
    currentPrice: 130,
    dcfValue: 161.3,
    morningstarValue: 0,
    marginOfSafety: 0,
    rating: 4.5,
    sector: "Technology",
  },
  {
    id: 5,
    symbol: "1211.HK",
    name: "BYD",
    currentPrice: 130,
    dcfValue: 114.4,
    morningstarValue: 0,
    marginOfSafety: 0,
    rating: 4.2,
    sector: "Technology",
  },
  {
    id: 3,
    symbol: "GOOG",
    name: "Google",
    currentPrice: 173,
    dcfValue: 230,
    morningstarValue: 0,
    marginOfSafety: 0,
    rating: 4.9,
    sector: "Technology",
  },
  {
    id: 4,
    symbol: "AMZN",
    name: "Amazon",
    currentPrice: 173,
    dcfValue: 190,
    morningstarValue: 0,
    marginOfSafety: 0,
    rating: 4.8,
    sector: "Technology",
  },

  // New entries
  {
    id: 6,
    symbol: "1810.HK",
    name: "Xiaomi",
    currentPrice: 0,
    dcfValue: 44.21,
    morningstarValue: 0,
    marginOfSafety: 0,
    rating: 4.2,
    sector: "Technology",
  },
  {
    id: 7,
    symbol: "0700.HK",
    name: "Tencent",
    currentPrice: 0,
    dcfValue: 605,
    morningstarValue: 0,
    marginOfSafety: 0,
    rating: 4.8,
    sector: "Technology",
  },
  {
    id: 8,
    symbol: "NVDA",
    name: "Nvidia",
    currentPrice: 0,
    dcfValue: 170,
    morningstarValue: 0,
    marginOfSafety: 0,
    rating: 4.9,
    sector: "Technology",
  },
];

//
// ─── COMPONENT ─────────────────────────────────────────────────────────────────
//

export function TopPicksTable() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "marginOfSafety",
    direction: "desc",
  });

  // Fetch API prices
  const symbols = placeholderData.map((stock) => stock.symbol);
  const { data: stockData, loading, error } = useStockDataFetcher(symbols);

  // Merge API data with placeholders
  const mergedData: StockData[] = placeholderData.map((stock) => {
    const fetchedStock = stockData.find((s) => s.symbol === stock.symbol);
    const updatedPrice = fetchedStock?.price || stock.currentPrice;

    const marginOfSafety =
      ((stock.dcfValue - updatedPrice) / stock.dcfValue) * 100;

    return {
      ...stock,
      currentPrice: updatedPrice,
      name: fetchedStock?.name || stock.name,
      marginOfSafety: Number(marginOfSafety.toFixed(2)),
    };
  });

  // Sorting logic
  const sortedData = [...mergedData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof StockData) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <div>Loading stock data...</div>;
  if (error) return <div>Please be patient while we review our top picks</div>;

  //
  // ─── RENDER ───────────────────────────────────────────────────────────────────
  //

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button
          variant="outline"
          onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
          className="gap-2"
        >
          {viewMode === "cards" ? (
            <Table className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
          {viewMode === "cards" ? "Table View" : "Card View"}
        </Button>

        <Button
          variant="outline"
          onClick={() => requestSort("marginOfSafety")}
          className="gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by Safety
        </Button>

        <Button
          variant="outline"
          onClick={() => requestSort("rating")}
          className="gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by Rating
        </Button>

        <Button
          variant="outline"
          onClick={() => requestSort("dcfValue")}
          className="gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by Value
        </Button>
      </div>

      {/* CARD VIEW */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedData.map((stock) => (
            <StockCard key={stock.id} stock={stock} />
          ))}
        </div>
      ) : (
        // TABLE VIEW
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Our Value</th>
                <th className="p-3">Morningstar FV</th>
                <th className="p-3">Margin of Safety</th>
                <th className="p-3">Rating</th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((stock) => (
                <tr key={stock.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{stock.symbol}</td>
                  <td className="p-3">{stock.name}</td>
                  <td className="p-3">${stock.currentPrice.toFixed(2)}</td>
                  <td className="p-3">${stock.dcfValue.toFixed(2)}</td>
                  <td className="p-3">
                    {stock.morningstarValue
                      ? `$${stock.morningstarValue}`
                      : "-"}
                  </td>
                  <td className="p-3">{stock.marginOfSafety}%</td>
                  <td className="p-3">{stock.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
