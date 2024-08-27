import { APIPortfolioBatchPriceType } from "@/APItypes";
import { convertCurrency, moneyFormatter } from "../Calculations/Formatter";
import {
  Table,
  TableBody,
  TableCell,
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
import { PortfolioSnapshotType } from "@/types";
import PortfolioInputDialogue from "./PortfolioInputDialogue";
import { Button } from "../ui/button";

export default function PortfolioTable({
  portfolioSnapshot,
  portfolioMarketPrice,
  username,
  userID,
}: {
  portfolioSnapshot: PortfolioSnapshotType[];
  portfolioMarketPrice: APIPortfolioBatchPriceType[];
  username: string;
  userID: string;
}) {
  // Constants
  const BASE_CURRENCY = process.env.BASE_CURRENCY || "USD";

  return (
    <Card className="w-full h-[400px] overflow-y-auto mb-10">
      <CardHeader className="mb-4 border-b flex flex-row justify-between items-center">
        <div className="">
          <CardTitle>Welcome Back {username}!</CardTitle>
          <CardDescription>
            This table represents your current portfolio holdings
          </CardDescription>
        </div>
        <div>
          <PortfolioInputDialogue userId={userID} />
        </div>
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
              <TableHead>Total Gain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=" ">
            {portfolioSnapshot.map((stock) => {
              const marketPrice =
                portfolioMarketPrice.find(
                  (item) => item.symbol === stock.ticker
                )?.price || 0;

              const marketValue = marketPrice * (stock._sum.quantity ?? 0);
              const marketValueInUSD =
                stock.currency !== BASE_CURRENCY
                  ? convertCurrency(marketValue, stock.currency, BASE_CURRENCY)
                  : marketValue;

              const purchaseValue =
                (stock._avg.purchasePrice || 0) * (stock._sum.quantity || 0);
              const totalGain = marketValueInUSD - purchaseValue;

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
                  <TableCell
                    className={`${
                      totalGain >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {moneyFormatter(totalGain)} {BASE_CURRENCY}
                  </TableCell>
                  <TableCell>
                    <Button variant={"ghost"}>Edit</Button>
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
