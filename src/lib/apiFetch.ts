import {
  APIAnalystEstimatesType,
  APIBalanceSheetType,
  APICashflowStatementType,
  APICompanyProfileType,
  APIFinancialGrowthType,
  APIIncomeStatementType,
  APIMarketPriceType,
  APIPortfolioMarketPriceType,
} from "@/APItypes";

export async function fetchData<T>(
  id: string,
  endpoint: string
): Promise<T | null> {
  "use server";

  // First check if there is an id

  if (!id) {
    console.error("fetchData: 'id' is required but was not provided.");
    return null;
  }

  //Establish endpoint URL and fetch the data

  try {
    // Server Components require the absolute URL - unlike client components
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpointURL = `${baseURL}/api/fetchstockdata/${endpoint}?symbol=${id}`;

    const res = await fetch(endpointURL);
    if (!res.ok) {
      console.error(
        `Network response was not okay for symbol: ${id}, Status: ${res.status}`
      );
      return null;
    }

    //If there is a successful response from the Endpoint continue to parse the json

    try {
      const data: T = await res.json();
      return data;
    } catch (jsonError) {
      console.error(`Error parsing JSON response for symbol: ${id}`, jsonError);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching data for symbol: ${id}`, error);
    return null;
  }
}

// Usage examples
export async function fetchCompanyProfile(
  id: string
): Promise<APICompanyProfileType | null> {
  return fetchData<APICompanyProfileType>(id, "companyprofile");
}

export async function fetchFinancialGrowth(
  id: string
): Promise<APIFinancialGrowthType[] | null> {
  return fetchData<APIFinancialGrowthType[]>(id, "financialgrowth");
}

export async function fetchMarketPrice(
  id: string
): Promise<APIMarketPriceType | null> {
  return fetchData<APIMarketPriceType>(id, "marketprice");
}

export async function fetchCashflowStatement(
  id: string
): Promise<APICashflowStatementType[] | null> {
  return fetchData<APICashflowStatementType[]>(id, "cashflowstatement");
}

export async function fetchIncomeStatement(
  id: string
): Promise<APIIncomeStatementType[] | null> {
  return fetchData<APIIncomeStatementType[]>(id, "incomestatement");
}

export async function fetchBalanceSheet(
  id: string
): Promise<APIBalanceSheetType[] | null> {
  return fetchData<APIBalanceSheetType[]>(id, "balancesheet");
}

export async function fetchAnalystEstimates(
  id: string
): Promise<APIAnalystEstimatesType[] | null> {
  return fetchData<APIAnalystEstimatesType[]>(id, "analystestimates");
}

export async function fetchPortfolioMarketPrice(
  portfolioSymbols: string[]
): Promise<APIPortfolioMarketPriceType[] | null> {
  if (!portfolioSymbols || portfolioSymbols.length === 0) {
    console.error("fetchData: 'id' is required but was not provided.");
    return null;
  }
  try {
    // Server Components require the absolute URL - unlike client components
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpointURL = `${baseURL}/api/fetchstockdata/portfoliomarketprice?bulkSymbols=${portfolioSymbols.join(
      ","
    )}`;

    const res = await fetch(endpointURL);
    if (!res.ok) {
      console.error(
        `Network response was not okay for symbol: ${portfolioSymbols.join(
          ","
        )}, Status: ${res.status}`
      );
      return null;
    }

    //If there is a successful response from the Endpoint continue to parse the json

    try {
      const data = await res.json();
      return data;
    } catch (jsonError) {
      console.error(
        `Error parsing JSON response for symbol: ${portfolioSymbols.join(",")}`,
        jsonError
      );
      return null;
    }
  } catch (error) {
    console.error(
      `Error fetching data for symbol: ${portfolioSymbols.join(",")}`,
      error
    );
    return null;
  }
}
