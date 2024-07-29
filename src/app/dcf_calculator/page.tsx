"use client";

import React, { useState } from "react";
import numeral from "numeral";

import { dcfResultsType, dcfCalculationType } from "@/types";
import { DcfForm } from "@/components/DcfForm";

const moneyFormatter = (value: number) => {
  return numeral(value).format("$0,0.00");
};

export default function DcfCalculatorPage() {
  const [dcfResults, setDcfResults] = useState<dcfResultsType | null>(null);
  const [dcfInput, setDcfInput] = useState<dcfCalculationType | null>(null);

  return (
    <div className="flex gap-x-5">
      <div className="flex-col w-1/2 ">
        <h2>DCF Valuation</h2>
        <p>
          Intrinsic Value:
          {dcfResults ? moneyFormatter(dcfResults.dcfValue) : "0"}
        </p>
        <p>
          PV of FCF:
          {dcfResults ? moneyFormatter(dcfResults.totalPvFcf) : "0"}
        </p>
        <p>
          Terminal Year FCF:{" "}
          {dcfResults ? moneyFormatter(dcfResults.terminalYearFcf) : "0"}
        </p>
        <p>
          Terminal Year PV FCF:{" "}
          {dcfResults ? moneyFormatter(dcfResults.terminalYearPvFcf) : "0"}
        </p>
        <MarketValuationStatus dcfInput={dcfInput} dcfResults={dcfResults} />
      </div>
      <DcfForm setDcfResults={setDcfResults} setDcfInput={setDcfInput} />
    </div>
  );
}

export function MarketValuationStatus({
  dcfInput,
  dcfResults,
}: {
  dcfInput: dcfCalculationType | null;
  dcfResults: dcfResultsType | null;
}) {
  if (!dcfInput || !dcfResults) {
    return <p>Submit Form to view results...</p>;
  }

  let stockPrice = dcfInput.stockPrice;
  let dcfValue = dcfResults.dcfValue;
  const overValue = stockPrice - dcfValue;

  return (
    <div>
      <p>Stock Price Overvalued by: {moneyFormatter(overValue)}</p>
    </div>
  );
}
