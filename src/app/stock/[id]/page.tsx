"use server";

import CompanyProfile from "@/components/Stock/CompanyProfile";
import { GrowthChartCard } from "@/components/Stock/GrowthChartCard";
import MarketChartCard from "@/components/Stock/MarketChartCard";
import {
  fetchCompanyProfile,
  fetchFinancialGrowth,
  fetchMarketPrice,
} from "@/lib/apiFetch";

const IndividualStockPage = async ({ params }: { params: { id: string } }) => {
  const symbol = params.id;
  const companyProfile = await fetchCompanyProfile(symbol);
  const financialGrowth = await fetchFinancialGrowth(symbol);
  const marketPrice = await fetchMarketPrice(symbol);

  return (
    <div className="w-full mx-auto flex flex-col items-center gap-y-4">
      <CompanyProfile companyProfile={companyProfile} />
      <MarketChartCard marketPrice={marketPrice} />
      <GrowthChartCard financialGrowth={financialGrowth} />
    </div>
  );
};

export default IndividualStockPage;
