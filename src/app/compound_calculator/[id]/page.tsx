import prisma from "@/app/lib/db";
import LifeCalculatorCard from "@/components/LifeCalculator/LifeCalculatorCard";
import DecorativeBackground from "@/components/decorative/DecorativeBackground";
import { SavingsForm } from "@/components/SavingsForm";
import { Card } from "@/components/ui/card";
import { SavingsData } from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";

export default async function CompoundCalculatorPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();

  //Find the user from kindeServer Session or bounce an unknown user

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // if (!user || user.id !== params.id) {
  //   redirect("/");
  // }

  // Define the data from the server

  const savingsData = await prisma.savings.findFirst({
    where: {
      userId: user?.id,
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
    numberOfCompoundingYears: 50,
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
        <div className=" mx-auto w-full grow lg:flex px-6 xl:px-8 gap-x-4 space-y-4 lg:space-y-0">
          {/* Left Side Chart */}
          <div className="flex-1 ">
            <LifeCalculatorCard dbData={dbData!} />
          </div>
          {/* Right Form  */}

          <div className="shrink-0 flex-[0.3] lg:w-[200px] ">
            <SavingsForm
              dbData={dbData!}
              userId={params.id}
              // setStateSavingsData={setStateSavingsData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
