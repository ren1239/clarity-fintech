"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoreGrowthChart } from "./CoreGrowthChart";
import {
  APIBalanceSheetType,
  APICashflowStatementType,
  APIIncomeStatementType,
} from "@/APItypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function DetailTabs({
  balanceSheet,
  cashflowStatement,
  incomeStatement,
}: {
  balanceSheet: APIBalanceSheetType[] | null;
  cashflowStatement: APICashflowStatementType[] | null;
  incomeStatement: APIIncomeStatementType[] | null;
}) {
  if (!balanceSheet || !cashflowStatement || !incomeStatement) {
    return (
      <div>
        <h1>404 - Not Found</h1>
        <p>No data available </p>
      </div>
    );
  }
  return (
    <Tabs defaultValue="keyMetrics" className="min-w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="keyMetrics">Key Metrics</TabsTrigger>
        <TabsTrigger value="income">Income Statement</TabsTrigger>
        <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
      </TabsList>
      <TabsContent value="keyMetrics" className="grid grid-cols-2 gap-2 ">
        <div className=" col-span-2">
          <CoreGrowthChart
            title={"Free Cash Flow"}
            data={cashflowStatement}
            chartKey={"freeCashFlow"}
          />
        </div>
        <CoreGrowthChart
          title={"Revenue"}
          data={incomeStatement}
          chartKey={"revenue"}
        />
        <CoreGrowthChart
          title={"EPS"}
          data={incomeStatement}
          chartKey={"eps"}
        />
        <CoreGrowthChart
          title={"R&D"}
          data={incomeStatement}
          chartKey={"researchAndDevelopmentExpenses"}
        />
        <CoreGrowthChart
          title={"Net Debt"}
          data={balanceSheet}
          chartKey={"netDebt"}
        />
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      {/* Income Statement */}
      <TabsContent value="income" className=" h-[650px]">
        <Card className="h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Income Statement</CardTitle>
            <CardDescription>
              A quick snapshot of the income statement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Checklist Items */}
            <CheckListItem
              title={"Gross Margin"}
              description={`Gross Profit / Revenue > 40%`}
              data={31}
              criteria={">40"}
            />
            <CheckListItem
              title={"R&D Margin"}
              description={`Research and Development / Gross Profit < 30%`}
              data={21}
              criteria={"<30"}
            />
            <CheckListItem
              title={"Depreciation Margin"}
              description={`Depreciation / Gross Profit < 10%`}
              data={11}
              criteria={"<10"}
            />
            <CheckListItem
              title={"Interest Margin"}
              description={`Interest Expense / Operating Income < 15%`}
              data={21}
              criteria={"<15"}
            />

            <CheckListItem
              title={"Net Income Margin"}
              description={`Net Income / Revenue > 20%`}
              data={12}
              criteria={">20"}
            />

            <CheckListItem
              title={"EPS Growth"}
              description={`Earnings Per Share Growth  =  Positive`}
              data={22}
              criteria={">0"}
            />
          </CardContent>
          <CardFooter className="border-t">
            <CardDescription className="text-xs pt-2">
              The views stated here are intended as a quick snapshot at the
              balance sheet from the teachings of Warren Buffet.
            </CardDescription>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Balance Sheet */}
      <TabsContent value="balance" className=" h-[650px]">
        <Card className="h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Balance Sheet</CardTitle>
            <CardDescription>
              A quick snapshot of the balance statement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Checklist Items */}
            <CheckListItem
              title={"Cash to Debt"}
              description={`Cash to be greater than debt`}
              data={10}
              criteria={">0"}
            />
            <CheckListItem
              title={"Debt to Equity"}
              description={`Total Liabilities / Shareholder Equity + Tresury Stock < 0.80`}
              data={0.6}
              criteria={"<0.80"}
            />
            <CheckListItem
              title={"Depreciation Margin"}
              description={`Depreciation / Gross Profit < 10%`}
              data={11}
              criteria={"<10"}
            />
            <CheckListItem
              title={"Preferred Stock"}
              description={`Preferred Stock should be zero`}
              data={0}
              criteria={"<1"}
            />
          </CardContent>
          <CardHeader>
            <CardTitle>Cash Flow Statement</CardTitle>
            <CardDescription>
              A quick snapshot of the cashflow statement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <CheckListItem
              title={"Free Cashflow Growth"}
              description={`Free Cashflow growth should be positive`}
              data={12}
              criteria={">0"}
            />

            <CheckListItem
              title={"Capex Margin"}
              description={`Capex / Net Income <25%`}
              data={12}
              criteria={"<25"}
            />
          </CardContent>

          <CardFooter className="border-t">
            <CardDescription className="text-xs pt-2">
              The views stated here are intended as a quick snapshot at the
              balance sheet from the teachings of Warren Buffet.
            </CardDescription>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export const CheckListItem = ({
  title,
  description,
  data,
  criteria,
}: {
  title: string;
  description: string;
  data: number;
  criteria: string;
}) => {
  const evaluateCriteria = (data: number, criteria: string) => {
    const operator = criteria.slice(0, 1);
    const value = criteria.slice(1);

    switch (operator) {
      case ">":
        return data > parseFloat(value);
      case "<":
        return data < parseFloat(value);
      case "=":
        return (data = parseFloat(value));
      default:
        return false;
    }
  };

  const isValid = evaluateCriteria(data, criteria);

  return (
    <div className="space-y-1 flex justify-between">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-xl font-semibold leading-none tracking-tight ">
            {title}
          </TooltipTrigger>
          <TooltipContent className="text-xs">{description}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Card
        style={{
          backgroundColor: `hsla(${
            isValid ? "12, 76%, 61%" : "173, 58%, 39%"
          }, 0.1)`,
        }}
        className="flex min-w-14 h-10 items-center justify-center leading-none tracking-tight"
      >
        {data}%
      </Card>
    </div>
  );
};
