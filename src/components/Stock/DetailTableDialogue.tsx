"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  APIBalanceSheetType,
  APICashflowStatementType,
  APICompanyProfileType,
  APIFinancialGrowthType,
  APIIncomeStatementType,
} from "@/APItypes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { moneyFormatter, percentFormatter } from "../Calculations/Formatter";

export function DetailTableDialogue({
  balanceSheet,
  cashflowStatement,
  incomeStatement,
  financialGrowth,
  companyProfile,
}: {
  balanceSheet: APIBalanceSheetType[] | null;
  cashflowStatement: APICashflowStatementType[] | null;
  incomeStatement: APIIncomeStatementType[] | null;
  financialGrowth: APIFinancialGrowthType[] | null;
  companyProfile: APICompanyProfileType | null;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          Detail...
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100vh-4.5rem)] min-w-[calc(100vw-4.5rem)] ">
        <DialogHeader>
          <DialogTitle>Detail Metrics</DialogTitle>
          <DialogDescription>
            This table represents our key metrics for analysis
          </DialogDescription>
        </DialogHeader>
        <Tabs>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="keyMetrics">Key Metrics</TabsTrigger>
            <TabsTrigger value="income">Income Statement</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            <TabsTrigger value="cash">Cashflow Statement</TabsTrigger>
            <TabsTrigger value="growth">Growth Metrics</TabsTrigger>
          </TabsList>

          {/* Key Metrics */}
          <TabsContent value="keyMetrics">
            <KeyTable
              balanceSheet={balanceSheet}
              incomeStatement={incomeStatement}
              cashflowStatement={cashflowStatement}
              financialGrowth={financialGrowth}
              companyProfile={companyProfile}
            />
          </TabsContent>

          {/* Income Statement */}

          <TabsContent value="income">
            <IncomeTable incomeStatement={incomeStatement} />
          </TabsContent>

          {/* Balance Sheet */}

          <TabsContent value="balance">
            <BalanceTable balanceSheet={balanceSheet} />
          </TabsContent>

          {/* Cashflow Statement */}

          <TabsContent value="cash">
            <CashflowTable cashflowStatement={cashflowStatement} />
          </TabsContent>

          {/* Growth Metrics */}

          <TabsContent value="growth">
            <GrowthTable financialGrowth={financialGrowth} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <span className="text-xs text-neutral-400">
            Only for educational purposes
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function KeyTable({
  balanceSheet,
  cashflowStatement,
  incomeStatement,
  financialGrowth,
  companyProfile,
}: {
  balanceSheet: APIBalanceSheetType[] | null;
  cashflowStatement: APICashflowStatementType[] | null;
  incomeStatement: APIIncomeStatementType[] | null;
  financialGrowth: APIFinancialGrowthType[] | null;
  companyProfile: APICompanyProfileType | null;
}) {
  const [selectedCell, setSelectedCell] = useState<{
    row: string;
    year: string;
  } | null>(null);

  if (
    !balanceSheet ||
    !incomeStatement ||
    !cashflowStatement ||
    !financialGrowth
  )
    return null;

  const years = balanceSheet.map((year) => year.calendarYear);

  const data = {
    Revenue: incomeStatement.map((year) => moneyFormatter(year.revenue)),
    "Revenue Growth": financialGrowth.map((year) =>
      percentFormatter(year.revenueGrowth)
    ),
    "Free Cash Flow": cashflowStatement.map((year) =>
      moneyFormatter(year.freeCashFlow)
    ),
    "Free Cash Flow Growth": financialGrowth.map((year) =>
      percentFormatter(year.freeCashFlowGrowth)
    ),
    "Total Debt": balanceSheet.map((year) => moneyFormatter(year.totalDebt)),
    "Gross Profit Margin": incomeStatement.map((year) =>
      percentFormatter(year.grossProfitRatio)
    ),
    EPS: incomeStatement.map((year) => moneyFormatter(year.eps)),
    "Book Value": balanceSheet.map((year) =>
      moneyFormatter(year.totalAssets - year.totalLiabilities)
    ),
    "R&D Expense Growth": financialGrowth.map((year) =>
      moneyFormatter(year.rdexpenseGrowth)
    ),
    "Total Stockholders Equity": balanceSheet.map((year) =>
      moneyFormatter(year.totalStockholdersEquity)
    ),
  };

  const handleCellClick = (metric: string, year: string) => {
    setSelectedCell({ row: metric, year });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Metric</TableHead>
          {years.map((year) => (
            <TableHead key={year}>{year}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([metric, values]) => (
          <TableRow key={metric}>
            <TableCell className="font-medium">{metric}</TableCell>
            {values.map((value, index) => (
              <TableCell
                key={years[index]}
                onClick={() => handleCellClick(metric, years[index])}
                className={
                  selectedCell?.row === metric &&
                  selectedCell?.year === years[index]
                    ? " ring-8 ring-primary rounded-lg z-[20]"
                    : ""
                }
              >
                {value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}

export function IncomeTable({
  incomeStatement,
}: {
  incomeStatement: APIIncomeStatementType[] | null;
}) {
  const [selectedCell, setSelectedCell] = useState<{
    row: string;
    year: string;
  } | null>(null);

  if (!incomeStatement) return null;

  const years = incomeStatement.map((year) => year.calendarYear);

  const data = {
    Revenue: incomeStatement.map((year) => moneyFormatter(year.revenue)),
    "Cost of Revenue": incomeStatement.map((year) =>
      moneyFormatter(year.costOfRevenue)
    ),
    "Gross Profit": incomeStatement.map((year) =>
      moneyFormatter(year.grossProfit)
    ),
    "Gross Profit Ratio": incomeStatement.map((year) =>
      percentFormatter(year.grossProfitRatio)
    ),
    "R&D Expenses": incomeStatement.map((year) =>
      moneyFormatter(year.researchAndDevelopmentExpenses)
    ),
    "SG&A Expenses": incomeStatement.map((year) =>
      moneyFormatter(year.sellingGeneralAndAdministrativeExpenses)
    ),
    "Operating Expenses": incomeStatement.map((year) =>
      moneyFormatter(year.operatingExpenses)
    ),
    EBITDA: incomeStatement.map((year) => moneyFormatter(year.ebitda)),
    "Operating Income": incomeStatement.map((year) =>
      moneyFormatter(year.operatingIncome)
    ),
    "Net Income": incomeStatement.map((year) => moneyFormatter(year.netIncome)),
  };

  const handleCellClick = (metric: string, year: string) => {
    setSelectedCell({ row: metric, year });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Metric</TableHead>
          {years.map((year) => (
            <TableHead key={year}>{year}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([metric, values]) => (
          <TableRow key={metric}>
            <TableCell className="font-medium">{metric}</TableCell>
            {values.map((value, index) => (
              <TableCell
                key={years[index]}
                onClick={() => handleCellClick(metric, years[index])}
                className={
                  selectedCell?.row === metric &&
                  selectedCell?.year === years[index]
                    ? "ring-8 ring-primary rounded-lg z-[20]"
                    : ""
                }
              >
                {value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}

export function BalanceTable({
  balanceSheet,
}: {
  balanceSheet: APIBalanceSheetType[] | null;
}) {
  const [selectedCell, setSelectedCell] = useState<{
    row: string;
    year: string;
  } | null>(null);

  if (!balanceSheet) return null;

  const years = balanceSheet.map((year) => year.calendarYear);

  const data = {
    "Cash and Cash Equivalents": balanceSheet.map((year) =>
      moneyFormatter(year.cashAndCashEquivalents)
    ),
    "Short Term Investments": balanceSheet.map((year) =>
      moneyFormatter(year.shortTermInvestments)
    ),
    "Total Current Assets": balanceSheet.map((year) =>
      moneyFormatter(year.totalCurrentAssets)
    ),
    "Property, Plant & Equipment": balanceSheet.map((year) =>
      moneyFormatter(year.propertyPlantEquipmentNet)
    ),
    "Goodwill and Intangible Assets": balanceSheet.map((year) =>
      moneyFormatter(year.goodwillAndIntangibleAssets)
    ),
    "Total Assets": balanceSheet.map((year) =>
      moneyFormatter(year.totalAssets)
    ),
    "Total Current Liabilities": balanceSheet.map((year) =>
      moneyFormatter(year.totalCurrentLiabilities)
    ),
    "Long Term Debt": balanceSheet.map((year) =>
      moneyFormatter(year.longTermDebt)
    ),
    "Total Liabilities": balanceSheet.map((year) =>
      moneyFormatter(year.totalLiabilities)
    ),
    "Total Stockholders Equity": balanceSheet.map((year) =>
      moneyFormatter(year.totalStockholdersEquity)
    ),
  };

  const handleCellClick = (metric: string, year: string) => {
    setSelectedCell({ row: metric, year });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Metric</TableHead>
          {years.map((year) => (
            <TableHead key={year}>{year}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([metric, values]) => (
          <TableRow key={metric}>
            <TableCell className="font-medium">{metric}</TableCell>
            {values.map((value, index) => (
              <TableCell
                key={years[index]}
                onClick={() => handleCellClick(metric, years[index])}
                className={
                  selectedCell?.row === metric &&
                  selectedCell?.year === years[index]
                    ? "ring-8 ring-primary rounded-lg z-[20]"
                    : ""
                }
              >
                {value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}

export function CashflowTable({
  cashflowStatement,
}: {
  cashflowStatement: APICashflowStatementType[] | null;
}) {
  const [selectedCell, setSelectedCell] = useState<{
    row: string;
    year: string;
  } | null>(null);

  if (!cashflowStatement) return null;

  const years = cashflowStatement.map((year) => year.calendarYear);

  const data = {
    "Net Income": cashflowStatement.map((year) =>
      moneyFormatter(year.netIncome)
    ),
    "Depreciation and Amortization": cashflowStatement.map((year) =>
      moneyFormatter(year.depreciationAndAmortization)
    ),
    "Stock Based Compensation": cashflowStatement.map((year) =>
      moneyFormatter(year.stockBasedCompensation)
    ),
    "Change in Working Capital": cashflowStatement.map((year) =>
      moneyFormatter(year.changeInWorkingCapital)
    ),
    "Net Cash Provided by Op. Act.": cashflowStatement.map((year) =>
      moneyFormatter(year.netCashProvidedByOperatingActivities)
    ),
    "Investments in P.P.E": cashflowStatement.map((year) =>
      moneyFormatter(year.investmentsInPropertyPlantAndEquipment)
    ),
    "Net Cash Used Invest. Act.": cashflowStatement.map((year) =>
      moneyFormatter(year.netCashUsedForInvestingActivites)
    ),
    "Debt Repayment": cashflowStatement.map((year) =>
      moneyFormatter(year.debtRepayment)
    ),
    "Net Cash Used Finc.Act.": cashflowStatement.map((year) =>
      moneyFormatter(year.netCashUsedProvidedByFinancingActivities)
    ),
    "Free Cash Flow": cashflowStatement.map((year) =>
      moneyFormatter(year.freeCashFlow)
    ),
  };

  const handleCellClick = (metric: string, year: string) => {
    setSelectedCell({ row: metric, year });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Metric</TableHead>
          {years.map((year) => (
            <TableHead key={year}>{year}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([metric, values]) => (
          <TableRow key={metric}>
            <TableCell className="font-medium line-clamp-1">{metric}</TableCell>
            {values.map((value, index) => (
              <TableCell
                key={years[index]}
                onClick={() => handleCellClick(metric, years[index])}
                className={
                  selectedCell?.row === metric &&
                  selectedCell?.year === years[index]
                    ? "ring-8 ring-primary rounded-lg z-[20]"
                    : ""
                }
              >
                {value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}

export function GrowthTable({
  financialGrowth,
}: {
  financialGrowth: APIFinancialGrowthType[] | null;
}) {
  const [selectedCell, setSelectedCell] = useState<{
    row: string;
    year: string;
  } | null>(null);

  if (!financialGrowth) return null;

  const years = financialGrowth.map((year) => year.calendarYear);

  const data = {
    "Revenue Growth": financialGrowth.map((year) =>
      percentFormatter(year.revenueGrowth)
    ),
    "Gross Profit Growth": financialGrowth.map((year) =>
      percentFormatter(year.grossProfitGrowth)
    ),
    "EBIT Growth": financialGrowth.map((year) =>
      percentFormatter(year.ebitgrowth)
    ),
    "Operating Income Growth": financialGrowth.map((year) =>
      percentFormatter(year.operatingIncomeGrowth)
    ),
    "Net Income Growth": financialGrowth.map((year) =>
      percentFormatter(year.netIncomeGrowth)
    ),
    "EPS Growth": financialGrowth.map((year) =>
      percentFormatter(year.epsgrowth)
    ),
    "Free Cash Flow Growth": financialGrowth.map((year) =>
      percentFormatter(year.freeCashFlowGrowth)
    ),
    "Operating Cash Flow Growth": financialGrowth.map((year) =>
      percentFormatter(year.operatingCashFlowGrowth)
    ),
    "Receivables Growth": financialGrowth.map((year) =>
      percentFormatter(year.receivablesGrowth)
    ),
    "Inventory Growth": financialGrowth.map((year) =>
      percentFormatter(year.inventoryGrowth)
    ),
  };

  const handleCellClick = (metric: string, year: string) => {
    setSelectedCell({ row: metric, year });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Metric</TableHead>
          {years.map((year) => (
            <TableHead key={year}>{year}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([metric, values]) => (
          <TableRow key={metric}>
            <TableCell className="font-medium">{metric}</TableCell>
            {values.map((value, index) => (
              <TableCell
                key={years[index]}
                onClick={() => handleCellClick(metric, years[index])}
                className={
                  selectedCell?.row === metric &&
                  selectedCell?.year === years[index]
                    ? "ring-8 ring-primary rounded-lg z-[20]"
                    : ""
                }
              >
                {value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}
