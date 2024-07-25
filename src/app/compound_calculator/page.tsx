import prisma from "@/app/lib/db";
import CompoundGrowthChart from "@/components/CompoundGrowthChart";
import DecorativeBackground from "@/components/decorative/DecorativeBackground";
import { SavingsForm } from "@/components/SavingsForm";
import { Card } from "@/components/ui/card";
import { SavingsData } from "@/types";

export default async function CompoundCalculatorPage({
  params,
}: {
  params: { id: string };
}) {
  // Define the data from the server

  const savingsData = await prisma.savings.findFirst({
    where: {
      userId: params.id,
    },
    select: {
      id: true,
      principal: true,
      rateOfReturn: true,
      numberOfCompoundingYears: true,
      numberOfSavingYears: true,
      contribution: true,
      annualExpense: true,
    },
  });

  // Define default values
  const defaultSavingsData = {
    id: "guestData",
    principal: 10000,
    rateOfReturn: 0.07,
    numberOfCompoundingYears: 30,
    numberOfSavingYears: 30,
    contribution: 24000,
    annualExpense: 35000,
  };

  //If savingsData exists, it will overide the default values

  const dbData: SavingsData = {
    ...defaultSavingsData,
    ...savingsData,
  };

  return (
    <>
      <div className=" flex-1 pt-4 justify-between flex flex-col h-[calc(100vh-4.5rem)]">
        <DecorativeBackground />
        <div className=" mx-auto w-full grow lg:flex px-6 xl:px-8 gap-4 space-y-10 lg:space-y-0">
          {/* Left Side Chart */}
          <div className="flex-1 ">
            <CompoundGrowthChart dbData={dbData!} />
          </div>
          {/* Right Form  */}

          <div className="shrink-0 flex-[0.3] lg:w-[200px] ">
            <Card className="p-4 h-full">
              <SavingsForm dbData={dbData!} userId={params.id} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
