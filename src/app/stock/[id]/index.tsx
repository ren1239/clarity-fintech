// stock/[id]/index.tsx
"use server";
import { unstable_noStore as noStore } from "next/cache";

import { APIStockDataWrapper } from "@/APItypes";
import { Card } from "@/components/ui/card";
import {
  fetchAnalystEstimates,
  fetchBalanceSheet,
  fetchCashflowStatement,
  fetchCompanyProfile,
  fetchFinancialGrowth,
  fetchIncomeStatement,
  fetchMarketPrice,
} from "@/lib/apiFetch";
import React, { ReactNode } from "react";

interface StockPageWrapperProps {
  params: { id: string };
  children: (data: APIStockDataWrapper) => ReactNode;
}

const StockPageWrapper: React.FC<StockPageWrapperProps> = async ({
  params,
  children,
}) => {
  const symbol = params.id;

  noStore();

  let data: APIStockDataWrapper | null = null;

  try {
    const [
      companyProfile,
      financialGrowth,
      marketPrice,
      cashflowStatement,
      incomeStatement,
      balanceSheet,
      analystEstimates,
    ] = await Promise.all([
      fetchCompanyProfile(symbol),
      fetchFinancialGrowth(symbol),
      fetchMarketPrice(symbol),
      fetchCashflowStatement(symbol),
      fetchIncomeStatement(symbol),
      fetchBalanceSheet(symbol),
      fetchAnalystEstimates(symbol),
    ]);

    // Check for null in individual data properties
    if (
      !companyProfile ||
      !financialGrowth ||
      !marketPrice ||
      !cashflowStatement ||
      !incomeStatement ||
      !balanceSheet ||
      !analystEstimates ||
      analystEstimates.length === 0 // Add this check for empty array
    ) {
      throw new Error("Data not found");
    }

    data = {
      companyProfile,
      financialGrowth,
      marketPrice,
      cashflowStatement,
      incomeStatement,
      balanceSheet,
      analystEstimates,
    };
  } catch (error) {
    console.error(error);
    return (
      <div className="h-screen flex justify-center items-center ">
        <Card className="">
          <div className="p-4 flex flex-col items-center">
            <h2 className="tracking-tight font-semibold text-3xl">404 Error</h2>
            <p className="tracking-tight italic text-light text-muted-foreground text-sm">
              Ticker Symbol not available
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return <div>{children(data)}</div>;
};

export default StockPageWrapper;
