//Create a generic get function

import { APIPortfolioMarketPriceType } from "@/APItypes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.get("bulkSymbols");
  if (!symbols) {
    return new Response("No symbols provided", { status: 400 });
  }

  //Set the API
  const apiKey = process.env.FMP_API;

  if (!apiKey) {
    return NextResponse.json(
      { message: "API key is missing" },
      { status: 500 }
    );
  }

  const APIEndpoint = `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`;

  //Create try catch fetch statement

  try {
    const response = await fetch(APIEndpoint);
    if (!response.ok) {
      throw new Error("Network response is not okay");
    }

    //handle the response
    const portfolioMarketPrice: APIPortfolioMarketPriceType[] =
      await response.json();
    console.log("success portfolio market price");
    return NextResponse.json(portfolioMarketPrice, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching portfolio market price", details: error },
      { status: 500 }
    );
  }
}
