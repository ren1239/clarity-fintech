"use client";

import DecorativeBackground from "@/components/decorative/DecorativeBackground";
import { SavingsForm } from "@/components/SavingsForm";
import { SavingsData } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import LifeCalculatorCard from "@/components/LifeCalculator/LifeCalculatorCard";
import { useState } from "react";

export default function CompoundCalculatorPage() {
  noStore();

  // Define default values

  const [defaultSavingsData, setDefaultSavingsData] = useState<SavingsData>({
    id: "guestData",
    principal: 10000,
    rateOfReturn: 0.07,
    numberOfCompoundingYears: 50,
    numberOfSavingYears: 30,
    contribution: 24000,
    annualExpense: 35000,
  });

  const userId = "guestUser";

  //If savingsData exists, it will overide the default values

  const dbData: SavingsData = {
    ...defaultSavingsData,
    // ...savingsData,
  };

  return (
    <>
      <div className=" flex-1 pt-4 justify-between flex flex-col h-[calc(100vh-4.5rem)]">
        <DecorativeBackground />
        <div className=" mx-auto w-full grow lg:flex px-6 xl:px-8 gap-4 space-y-10 lg:space-y-0">
          {/* Left Side Chart */}
          <div className="flex-1 ">
            <LifeCalculatorCard dbData={dbData!} />
          </div>
          {/* Right Form  */}

          <div className="shrink-0 flex-[0.3] lg:w-[200px] ">
            <SavingsForm
              dbData={dbData!}
              userId={userId}
              setDefaultSavingsData={setDefaultSavingsData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
