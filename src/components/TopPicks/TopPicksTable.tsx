"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Table, List } from "lucide-react";
import { StockCard } from "./StockCard";

interface StockData {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
  dcfValue: number;
  marginOfSafety: number;
  rating: number;
  sector: string;
}

interface SortConfig {
  key: keyof StockData;
  direction: "asc" | "desc";
}

const placeholderData = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 189.25,
    dcfValue: 210.5,
    marginOfSafety: 11.2,
    rating: 4.5,
    sector: "Technology",
  },
  {
    id: 2,
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 415.5,
    dcfValue: 150.0,
    marginOfSafety: -28.3,
    rating: 4.7,
    sector: "Technology",
  },
  {
    id: 3,
    symbol: "TSLA",
    name: "Tesla, Inc.",
    currentPrice: 250.75,
    dcfValue: 480.0,
    marginOfSafety: 31.7,
    rating: 4.2,
    sector: "Automotive",
  },
  {
    id: 4,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    currentPrice: 145.75,
    dcfValue: 160.0,
    marginOfSafety: 9.8,
    rating: 4.6,
    sector: "Technology",
  },
  {
    id: 5,
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    currentPrice: 185.5,
    dcfValue: 210.0,
    marginOfSafety: 13.2,
    rating: 4.4,
    sector: "Retail",
  },
  {
    id: 6,
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    currentPrice: 950.0,
    dcfValue: 1100.0,
    marginOfSafety: 15.8,
    rating: 4.8,
    sector: "Semiconductors",
  },
  {
    id: 7,
    symbol: "JNJ",
    name: "Johnson & Johnson",
    currentPrice: 160.25,
    dcfValue: 175.0,
    marginOfSafety: 9.2,
    rating: 4.3,
    sector: "Healthcare",
  },
  {
    id: 8,
    symbol: "XOM",
    name: "Exxon Mobil Corporation",
    currentPrice: 120.5,
    dcfValue: 130.0,
    marginOfSafety: 7.9,
    rating: 4.1,
    sector: "Energy",
  },
  {
    id: 9,
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    currentPrice: 200.75,
    dcfValue: 220.0,
    marginOfSafety: 9.6,
    rating: 4.5,
    sector: "Financials",
  },
];

export function TopPicksTable() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "marginOfSafety",
    direction: "desc",
  });

  const sortedData = [...placeholderData].sort((a, b) => {
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

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedData.map((stock) => (
            <StockCard key={stock.id} stock={stock} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">DCF Value</th>
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
                  <td className="p-3">{stock.marginOfSafety.toFixed(1)}%</td>
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
