import { moneyFormatter } from "../Calculations/Formatter";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const SavingsInvestingCard = ({
  title,
  amount,
  description,
}: {
  title: string;
  amount: number;
  description: string;
}) => (
  <Card className="w-full">
    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
      <CardTitle className="text-center mx-auto">{title}</CardTitle>
    </CardHeader>
    <div className="p-4 space-y-1 items-center justify-center flex-col flex h-3/4">
      <CardTitle>{moneyFormatter(amount)}</CardTitle>
      <CardDescription className="text-center text-xs max-w-56">
        {description}
      </CardDescription>
    </div>
  </Card>
);
