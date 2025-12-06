import prisma from "@/app/lib/db";
import LifeCalculatorCard from "@/components/LifeCalculator/LifeCalculatorCard";
import DecorativeBackground from "@/components/decorative/DecorativeBackground";
import { SavingsForm } from "@/components/SavingsForm";
import { Card } from "@/components/ui/card";
import { SavingsData } from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";

// FIX: Ensures synchronous params in Next.js 15+
export const dynamic = "force-dynamic";

export default async function CompoundCalculatorPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

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

  const defaultSavingsData = {
    id: "guestData",
    principal: 10000,
    rateOfReturn: 0.07,
    numberOfCompoundingYears: 50,
    numberOfSavingYears: 30,
    contribution: 24000,
    annualExpense: 35000,
  };

  const dbData: SavingsData = {
    ...defaultSavingsData,
    ...savingsData,
  };

  const setDefaultSavingsData = null;

  return (
    <>
      <div className="flex-1 pt-4 justify-between flex flex-col h-[calc(100vh-4.5rem)]">
        <DecorativeBackground rotation={90} translation={55} />
        <div className="mx-auto w-full grow lg:flex px-6 xl:px-8 gap-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1 ">
            <LifeCalculatorCard dbData={dbData!} />
          </div>

          <div className="shrink-0 flex-[0.3] lg:w-[200px] ">
            <SavingsForm
              dbData={dbData!}
              userId={params.id}
              setDefaultSavingsData={setDefaultSavingsData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
