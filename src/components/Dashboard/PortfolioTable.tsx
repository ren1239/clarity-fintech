import { APIPortfolioBatchPriceType } from "@/APItypes";
import { PortfolioDBType } from "@/types";
import { convertCurrency, moneyFormatter } from "../Calculations/Formatter";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function PortfolioTable({
  portfolioDbData,
  portfolioMarketPrice,
  username,
}: {
  portfolioDbData: PortfolioDBType[];
  portfolioMarketPrice: APIPortfolioBatchPriceType[];
  username: string;
}) {
  // Constants
  const BASE_CURRENCY = "USD";

  return (
    <Card className="w-full h-[400px] overflow-y-auto mb-10">
      <CardHeader className="mb-4 border-b">
        <CardTitle>Welcome Back {username}!</CardTitle>
        <CardDescription>
          This table represents your current portfolio holdings
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Avg Cost</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Market Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=" ">
            {portfolioDbData.map((stock) => {
              const marketPrice =
                portfolioMarketPrice.find(
                  (item) => item.symbol === stock.ticker
                )?.price || 0;

              const marketValue = marketPrice * (stock._sum.quantity ?? 0);
              const marketValueInUSD =
                stock.currency !== BASE_CURRENCY
                  ? convertCurrency(marketValue, stock.currency, BASE_CURRENCY)
                  : marketValue;

              return (
                <TableRow key={stock.ticker}>
                  <TableCell>{stock.ticker}</TableCell>
                  <TableCell>{stock._sum.quantity ?? "N/A"}</TableCell>
                  <TableCell>
                    {moneyFormatter(stock._avg.purchasePrice ?? 0)}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter(marketPrice)} {stock.currency}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter(marketValueInUSD)} {BASE_CURRENCY}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
