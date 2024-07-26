import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const RetirementCard = ({
  targetRetirementYear,
}: {
  targetRetirementYear: any;
}) => (
  <Card className="w-full">
    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
      <CardTitle className="text-center mx-auto">Retirement</CardTitle>
    </CardHeader>
    <div className="p-4 space-y-1 items-center justify-center flex-col flex h-3/4">
      <CardTitle>{targetRetirementYear ?? 0}</CardTitle>
      <CardDescription className="text-center text-xs max-w-56">
        {targetRetirementYear
          ? "Years away from retirement!"
          : "At your current savings rate, you will not reach retirement!"}
      </CardDescription>
    </div>
  </Card>
);