import { dcfCalculationType } from "@/types";

// DCF calculation
export function dcfCalculation({
  stockPrice,
  sharesOutstanding,
  stGrowthRate,
  ltGrowthRate,
  discountRate,
  terminalValue,
  stockBasedComp,
  netCashDebt,
  fcf,
  simpleCalculation,
}: dcfCalculationType) {
  let fcfArray = [];
  let fcfStart = 0;

  // Boolean check if we are doing a simple calculation or a Tech Company
  fcfStart = simpleCalculation ? fcf : fcf - stockBasedComp; // this is usually for tech companies

  // Calculate first 5 years FCF
  for (let year = 1; year < 6; year++) {
    // Apply the short-term growth rate
    const fcfCurrent = fcfStart * (1 + stGrowthRate / 100);
    const pvCurrent = fcfCurrent / Math.pow(1 + discountRate / 100, year);
    fcfArray.push({
      year: year,
      fcf: fcfCurrent,
      pvFcf: pvCurrent,
    });
    fcfStart = fcfCurrent; // Update fcfStart for the next year
  }

  // Calculate second 5 years of FCF
  for (let year = 6; year < 11; year++) {
    // Apply the long-term growth rate
    const fcfCurrent = fcfStart * (1 + ltGrowthRate / 100);
    const pvCurrent = fcfCurrent / Math.pow(1 + discountRate / 100, year);
    fcfArray.push({
      year: year,
      fcf: fcfCurrent,
      pvFcf: pvCurrent,
    });
    fcfStart = fcfCurrent; // Update fcfStart for the next year
  }

  // Terminal Year value (Terminal value multiplied by 10th year value)
  const terminalYearFcf = fcfArray[fcfArray.length - 1].fcf * terminalValue;
  const terminalYearPvFcf =
    terminalYearFcf / Math.pow(1 + discountRate / 100, 10);

  fcfArray.push({ year: 99, fcf: terminalYearFcf, pvFcf: terminalYearPvFcf });

  // Sum all values
  const sumFcf = fcfArray.reduce((acc, curr) => acc + curr.fcf, 0);
  const sumPvFcf = fcfArray.reduce((acc, curr) => acc + curr.pvFcf, 0);

  const totalPvFcf = sumPvFcf + netCashDebt;
  const dcfValue = totalPvFcf / sharesOutstanding;

  const totalFcf = sumFcf + netCashDebt;

  return {
    dcfValue,
    totalFcf,
    totalPvFcf,
    fcfArray,
    terminalYearFcf,
    terminalYearPvFcf,
  };
}
