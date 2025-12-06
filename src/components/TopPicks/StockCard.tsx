"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface StockCardProps {
  stock: {
    id: number;
    symbol: string;
    name: string;
    currentPrice: number;
    dcfValue: number;
    morningstarValue: number; // <- Added here
    marginOfSafety: number;
    rating: number;
    sector: string;
  };
}

export function StockCard({ stock }: StockCardProps) {
  const router = useRouter();
  const compressionThreshold = 25;

  const indicatorPosition =
    stock.marginOfSafety < 0
      ? 50 * (1 + stock.marginOfSafety / 100)
      : 50 +
        (50 * Math.min(stock.marginOfSafety, compressionThreshold)) /
          compressionThreshold;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow min-h-[300px] flex flex-col">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="font-bold text-xs">{stock.symbol}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{stock.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {stock.sector}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(stock.rating)
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "fill-muted stroke-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2 flex-1">
        {/* Current Price */}
        <div className="flex justify-between text-sm">
          <span>Price</span>
          <span className="font-medium">${stock.currentPrice.toFixed(2)}</span>
        </div>

        {/* DCF Value */}
        <div className="flex justify-between text-sm">
          <span>Fair Value</span>
          <span className="font-medium">${stock.dcfValue.toFixed(2)}</span>
        </div>

        {/* Morningstar Value */}
        <div className="flex justify-between text-sm">
          <span>Morningstar Value</span>
          <span className="font-medium">
            {stock.morningstarValue > 0 ? `$${stock.morningstarValue}` : "-"}
          </span>
        </div>

        {/* Margin of Safety Visual */}
        <div className="space-y-1 mt-8 border-t-8 pt-8 text-center">
          <div className="text-sm">Margin of Safety</div>

          {/* Gradient Bar */}
          <div
            className="group relative h-6 rounded-full overflow-hidden bg-gradient-to-r from-[#A16207] via-[#D1A054] to-[#E5E7EB]


"
          >
            <div
              className="absolute w-0.5 h-8 -top-1 bg-black rounded-sm"
              style={{
                left: `${indicatorPosition}%`,
                transform: "translateX(-50%)",
              }}
            />
          </div>

          <div className="text-sm font-medium mt-1">
            {stock.marginOfSafety > 0 ? "+" : ""}
            {stock.marginOfSafety}%
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => router.push(`/stock/${stock.symbol}/dcf_calculator`)}
        >
          Run Analysis
        </Button>
      </div>
    </Card>
  );
}
