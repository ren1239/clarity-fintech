import {
  APIBalanceSheetType,
  APICashflowStatementType,
  APICompanyProfileType,
  APIFinancialGrowthType,
  APIIncomeStatementType,
} from "@/APItypes";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { moneyFormatter } from "../Calculations/Formatter";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FMPPriceChartCard } from "./FMPPriceChartCard";
import { DetailTabs } from "./DetailTabs";
import { BuffetChecklistTabs } from "./BuffetChecklistTabs";
import { Button } from "../ui/button";
import { DetailTableDialogue } from "./DetailTableDialogue";
import Link from "next/link";
import { CompanyBanner } from "../CompanyBanner";

// Inside your component

export default function CompanyProfile({
  companyProfile,
  balanceSheet,
  cashflowStatement,
  incomeStatement,
  financialGrowth,
}: {
  companyProfile: APICompanyProfileType | null;
  balanceSheet: APIBalanceSheetType[] | null;
  cashflowStatement: APICashflowStatementType[] | null;
  incomeStatement: APIIncomeStatementType[] | null;
  financialGrowth: APIFinancialGrowthType[] | null;
}) {
  if (
    !companyProfile ||
    !balanceSheet ||
    !cashflowStatement ||
    !incomeStatement ||
    !financialGrowth
  ) {
    return (
      <div>
        <h1>404 - Not Found</h1>
        <p>No data available </p>
      </div>
    );
  }
  return (
    <div className=" flex-1 pt-4 justify-between items-center flex flex-col min-h-[calc(100vh-4.5rem)] lg:w-3/4 lg:px-0 w-full px-4 ">
      <div className=" mx-auto w-full grow lg:flex space-y-10 lg:space-y-0 min-h-full ">
        {/* Left Side */}

        <div className="flex-3 flex-col min-h-full gap-y-4 gap-x-4 ">
          {/* Company Banner */}
          <CompanyBanner companyProfile={companyProfile} />
          {/* Detail Tab */}

          <div className="flex gap-4 pt-4 flex-col lg:flex-row">
            <div className="flex-1">
              <DetailTabs
                balanceSheet={balanceSheet}
                incomeStatement={incomeStatement}
                cashflowStatement={cashflowStatement}
              />
            </div>

            <div className="flex flex-col flex-[0.7] justify-between gap-y-4">
              {/* Clarity Value Tab */}
              <ClarityValueCard companyProfile={companyProfile} />
              <div className="w-full flex gap-x-4">
                <div className="flex-1 w-full">
                  <DetailTableDialogue
                    balanceSheet={balanceSheet}
                    incomeStatement={incomeStatement}
                    cashflowStatement={cashflowStatement}
                    financialGrowth={financialGrowth}
                    companyProfile={companyProfile}
                  />
                </div>
                <Link href={`/stock/${companyProfile.symbol}/dcf_calculator`}>
                  <Button className="flex flex-1">Calculate Value</Button>
                </Link>
              </div>
              {/* <Button>Details</Button> */}
            </div>
          </div>
        </div>

        {/* Right Side */}

        {/* <BuffetChecklistTabs /> */}
      </div>
    </div>
  );
}

export const DetailCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <Card className="flex-1 flex-col items-center justify-center h-[130px]  ">
    <CardHeader className="items-center pb-0 text-sm">
      <CardDescription className="text-center text-xs">{title}</CardDescription>
    </CardHeader>
    <CardContent className="flex items-center justify-center pt-8">
      <CardTitle>{content}</CardTitle>
    </CardContent>
  </Card>
);

export const ClarityValueCard = ({
  companyProfile,
}: {
  companyProfile: APICompanyProfileType | null;
}) => {
  if (!companyProfile) {
    return (
      <div>
        <h1>404 - Not Found</h1>
        <p>No data available </p>
      </div>
    );
  }

  {
    return (
      <div className="flex flex-col  gap-y-4 ">
        {/* DCF Price */}

        <FMPPriceChartCard companyProfile={companyProfile} />
        {/* Detailed Cards */}

        <div className=" flex items-center space-x-4 ">
          <DetailCard title={"Country"} content={companyProfile.country} />
          <DetailCard title={"Currency"} content={companyProfile.currency} />
          <DetailCard
            title={"Mkt. Cap"}
            content={moneyFormatter(companyProfile.mktCap)}
          />
        </div>

        {/* Description Card */}

        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <div className="flex flex-col gap-2">
            <p> Description:</p>
            <p className="line-clamp-5 text-xs text-muted-foreground">
              {companyProfile.description}
            </p>
          </div>
        </div>
      </div>
    );
  }
};
