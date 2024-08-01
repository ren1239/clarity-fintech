"use server";

import CompanyProfile from "@/components/Stock/CompanyProfile";
import { GrowthChartCard } from "@/components/Stock/GrowthChartCard";
import { fetchCompanyProfile, fetchFinancialGrowth } from "@/lib/apiFetch";

const IndividualStockPage = async ({ params }: { params: { id: string } }) => {
  const symbol = params.id;
  const companyProfile = await fetchCompanyProfile(symbol);
  const financialGrowth = await fetchFinancialGrowth(symbol);

  console.log(financialGrowth);

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <CompanyProfile companyProfile={companyProfile} />
      <GrowthChartCard financialGrowth={financialGrowth} />
    </div>
  );
};

export default IndividualStockPage;
