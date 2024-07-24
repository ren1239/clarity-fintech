"use client";

import CompoundGrowthChart from "./CompoundGrowthChart";

import { SavingsForm } from "./SavingsForm";
import { Card } from "./ui/card";
import DecorativeBackground from "./decorative/DecorativeBackground";
import { useEffect, useState } from "react";

type SavingsData = {
  principal: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  numberOfSavingYears: number;
  contribution: number;
  id: string;
};

export default function CompoundGrowthSection({
  savingsData,
  userId,
}: {
  userId: string;
  savingsData: SavingsData;
}) {
  const [stateSavingsData, setStateSavingsData] = useState<SavingsData>({
    principal: savingsData?.principal || 1000,
    rateOfReturn: savingsData?.rateOfReturn || 0.07,
    numberOfCompoundingYears: savingsData?.numberOfCompoundingYears || 30,
    numberOfSavingYears: savingsData?.numberOfSavingYears || 30,
    contribution: savingsData?.contribution || 1000,
    id: savingsData?.id || "1234",
  });

  useEffect(() => {
    setStateSavingsData(stateSavingsData);
  }, [stateSavingsData]);

  return (
    <div className=" flex-1 pt-4 justify-between flex flex-col h-[calc(100vh-4.5rem)]">
      <DecorativeBackground />
      <div className=" mx-auto w-full grow lg:flex px-6 xl:px-8 gap-4 space-y-10 lg:space-y-0">
        {/* Left Side Chart */}
        <div className="flex-1 ">
          <CompoundGrowthChart stateSavingsData={stateSavingsData!} />
        </div>
        {/* Right Form  */}

        <div className="shrink-0 flex-[0.3] lg:w-[200px] ">
          <Card className="p-4 h-full">
            <SavingsForm
              savingsData={stateSavingsData!}
              userId={userId}
              setStateSavingsData={setStateSavingsData}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
