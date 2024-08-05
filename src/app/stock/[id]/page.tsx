"use server";

import CompanyProfile from "@/components/Stock/CompanyProfile";
import { GrowthChartCard } from "@/components/Stock/GrowthChartCard";
import MarketChartCard from "@/components/Stock/MarketChartCard";
import {
  fetchBalanceSheet,
  fetchCashflowStatement,
  fetchCompanyProfile,
  fetchFinancialGrowth,
  fetchIncomeStatement,
  fetchMarketPrice,
} from "@/lib/apiFetch";

const IndividualStockPage = async ({ params }: { params: { id: string } }) => {
  const symbol = params.id;
  const companyProfile = await fetchCompanyProfile(symbol);
  const financialGrowth = await fetchFinancialGrowth(symbol);
  const marketPrice = await fetchMarketPrice(symbol);

  const cashflowStatement = await fetchCashflowStatement(symbol);
  const incomeStatement = await fetchIncomeStatement(symbol);
  const balanceSheet = await fetchBalanceSheet(symbol);

  return (
    <div className="w-full mx-auto flex flex-col items-center gap-y-4">
      <CompanyProfile
        balanceSheet={balanceSheet}
        incomeStatement={incomeStatement}
        cashflowStatement={cashflowStatement}
        companyProfile={companyProfile}
      />
      <MarketChartCard marketPrice={marketPrice} />
      <GrowthChartCard financialGrowth={financialGrowth} />
    </div>
  );
};

export default IndividualStockPage;
