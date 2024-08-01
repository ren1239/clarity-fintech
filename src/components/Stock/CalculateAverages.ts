import { ChartDataType } from "@/APItypes";

export const calculateAverages = (
  chartData: ChartDataType[],
  chartKeyArray: string[]
): ChartDataType => {
  // Initialize the averages object with default values set to 0
  let averages: ChartDataType = {
    revenueGrowth: 0,
    freeCashFlowGrowth: 0,
    netIncomeGrowth: 0,
    epsgrowth: 0,
    bookValueperShareGrowth: 0,
  };

  if (chartData.length === 0) {
    console.log("No Data in ChartData");
    return averages; // Return the default values
  }

  // Calculate averages for each key
  chartKeyArray.forEach((key) => {
    const total = chartData.reduce((sum, entry) => {
      // Use any for key to avoid TypeScript errors
      const value = (entry as any)[key];
      return sum + (value || 0);
    }, 0);
    averages[key as keyof ChartDataType] = total / chartData.length;
  });

  console.log("averages", averages);

  return averages;
};
