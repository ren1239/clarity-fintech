import { dcfCalculationType } from "@/types";

//DCF calculation

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
  simpleCalculation ? (fcfStart = fcf) : (fcfStart = fcf - stockBasedComp); // this is usually for tech companies

  // Calculate first 5year FCF
  for (let year = 1; year < 6; year++) {
    // current FCF is clmped to 0 decimal praces
    const fcfCurrent = (fcfStart *= 1 + stGrowthRate);
    const pvCurrent = fcfCurrent / Math.pow(1 + discountRate, year);
    fcfArray.push({
      year: year,
      fcf: fcfCurrent,
      pvFcf: pvCurrent,
    });
  }

  //Calculate second 5 years of FCF
  for (let year = 6; year < 11; year++) {
    const fcfCurrent = (fcfStart *= 1 + ltGrowthRate);
    const pvCurrent = fcfCurrent / Math.pow(1 + discountRate, year);
    fcfArray.push({
      year: year,
      fcf: fcfCurrent,
      pvFcf: pvCurrent,
    });
  }

  //Terminal Year value (Terminal value multiplied by 10th year value )

  const terminalYearFcf = fcfArray[fcfArray.length - 1].fcf * terminalValue;
  const terminalYearPvFcf = fcfArray[fcfArray.length - 1].pvFcf * terminalValue;

  fcfArray.push({ year: 99, fcf: terminalYearFcf, pvFcf: terminalYearPvFcf });

  //Sum all values

  const sumFcf = fcfArray.reduce((acc, curr) => acc + curr.fcf, 0);
  const sumPvFcf = fcfArray.reduce((acc, curr) => acc + curr.pvFcf, 0);

  const terminalValueObject = {
    year: "terminal",
    fcf: sumFcf,
    pvFcf: sumPvFcf,
  };

  const totalPvFcf =
    fcfArray.reduce((acc, curr) => acc + curr.pvFcf, 0) + netCashDebt;
  const dcfValue = totalPvFcf / sharesOutstanding;

  return {
    dcfValue,
    totalPvFcf,
    fcfArray,
    terminalYearFcf,
    terminalYearPvFcf,
  };
}
