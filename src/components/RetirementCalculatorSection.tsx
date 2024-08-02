"use client";

import React, { useState } from "react";
import DecorativeBackground from "./decorative/DecorativeBackground";
import { Card } from "./ui/card";
import RetirementChart from "./RetirementChart";
import RetirementForm from "./RetirementForm";
import { RetirementDataType } from "@/types";

export default function RetirementCalculatorSection() {
  const [stateRetirementData, setStateRetirementData] =
    useState<RetirementDataType>({
      retirementAmount: 1000000,
      rateOfReturn: 0.07,
      numberOfCompoundingYears: 30,
      annualExpenses: 35000,
      id: "test",
    });

  const userId = "guest";

  return (
    <div className=" flex-1 pt-4 justify-between flex flex-col h-[calc(100vh-4.5rem)]">
      <DecorativeBackground />
      <div className=" mx-auto w-full grow lg:flex px-6 xl:px-8 gap-4 space-y-10 lg:space-y-0">
        {/* Left Side Chart */}
        <div className="flex-1 ">
          <RetirementChart stateRetirementData={stateRetirementData!} />
        </div>
        {/* Right Form  */}

        <div className="shrink-0 flex-[0.3] lg:w-[200px] ">
          <Card className="p-4 h-full">
            <RetirementForm
              userId={userId}
              setStateRetirementData={setStateRetirementData}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
