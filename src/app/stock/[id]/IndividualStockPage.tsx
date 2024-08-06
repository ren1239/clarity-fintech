// stock/[id]/IndividualStock.tsx
"use server";

import { APIStockDataWrapper } from "@/APItypes";
import CompanyProfile from "@/components/Stock/CompanyProfile";
import { GrowthChartCard } from "@/components/Stock/GrowthChartCard";
import MarketChartCard from "@/components/Stock/MarketChartCard";

interface IndividualStockPageProps {
  data: APIStockDataWrapper;
}

const IndividualStockPage: React.FC<IndividualStockPageProps> = ({ data }) => {
  const {
    companyProfile,
    financialGrowth,
    marketPrice,
    cashflowStatement,
    incomeStatement,
    balanceSheet,
  } = data;

  return (
    <div className="w-full mx-auto flex flex-col items-center gap-y-4">
      <CompanyProfile
        balanceSheet={balanceSheet}
        incomeStatement={incomeStatement}
        cashflowStatement={cashflowStatement}
        companyProfile={companyProfile}
        financialGrowth={financialGrowth}
      />
      <MarketChartCard marketPrice={marketPrice} />
      <GrowthChartCard financialGrowth={financialGrowth} />
    </div>
  );
};

export default IndividualStockPage;
