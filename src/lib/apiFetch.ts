import {
  APIAnalystEstimatesType,
  APIBalanceSheetType,
  APICashflowStatementType,
  APICompanyProfileType,
  APIFinancialGrowthType,
  APIIncomeStatementType,
  APIMarketPriceType,
  APIPortfolioBatchPriceType,
} from "@/APItypes";

export async function fetchData<T>(
  params: { id: string; purchaseDate?: string; symbols?: string },
  endpoint: string
): Promise<T | null> {
  "use server";

  const { id, purchaseDate, symbols } = params;

  // First check if there is an id

  if (!id && !symbols) {
    console.error(
      "fetchData: 'id' or 'symbols' is required but was not provided."
    );
    return null;
  }

  //Establish endpoint URL and fetch the data

  try {
    // Server Components require the absolute URL - unlike client components
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    let endpointURL = `${baseURL}/api/fetchstockdata/${endpoint}`;

    if (id) {
      endpointURL += `?symbol=${id}`;
    } else if (symbols) {
      endpointURL += `?symbols=${symbols}`;
    }

    if (purchaseDate) {
      endpointURL += `&purchaseDate=${purchaseDate}`;
    }

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
      console.error(
        `Error parsing JSON response for symbol: ${id || symbols}`,
        jsonError
      );
      return null;
    }
  } catch (error) {
    console.error(`Error fetching data for symbol: ${id || symbols}`, error);
    return null;
  }
}

// Usage examples
export async function fetchCompanyProfile(
  id: string
): Promise<APICompanyProfileType | null> {
  return fetchData<APICompanyProfileType>({ id }, "companyprofile");
}

export async function fetchFinancialGrowth(
  id: string
): Promise<APIFinancialGrowthType[] | null> {
  return fetchData<APIFinancialGrowthType[]>({ id }, "financialgrowth");
}

export async function fetchMarketPrice(
  id: string
): Promise<APIMarketPriceType | null> {
  return fetchData<APIMarketPriceType>({ id }, "marketprice");
}

export async function fetchCashflowStatement(
  id: string
): Promise<APICashflowStatementType[] | null> {
  return fetchData<APICashflowStatementType[]>({ id }, "cashflowstatement");
}

export async function fetchIncomeStatement(
  id: string
): Promise<APIIncomeStatementType[] | null> {
  return fetchData<APIIncomeStatementType[]>({ id }, "incomestatement");
}

export async function fetchBalanceSheet(
  id: string
): Promise<APIBalanceSheetType[] | null> {
  return fetchData<APIBalanceSheetType[]>({ id }, "balancesheet");
}

export async function fetchAnalystEstimates(
  id: string
): Promise<APIAnalystEstimatesType[] | null> {
  return fetchData<APIAnalystEstimatesType[]>({ id }, "analystestimates");
}

export async function fetchMarketPriceFromDate(
  id: string,
  purchaseDate: string
): Promise<APIMarketPriceType | null> {
  return fetchData<APIMarketPriceType>(
    { id, purchaseDate },
    "market-price-from-date"
  );
}

export async function fetchMarketPriceFromBulk(
  id: string[]
): Promise<APIPortfolioBatchPriceType[] | null> {
  const symbols = id.join(",");
  return fetchData<APIPortfolioBatchPriceType[]>(
    { id: "", symbols },
    "market-price-from-bulk"
  );
}
