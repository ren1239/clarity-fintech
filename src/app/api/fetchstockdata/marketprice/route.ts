"use server";

import { MarketPriceType } from "@/APItypes";
import { format, subYears } from "date-fns";

import { NextRequest, NextResponse } from "next/server";

//Create a generic get function
export async function GET(req: NextRequest) {
  // get the search params, symbol

  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  console.log("here in market-price");

  //If no symbol, return error
  if (!symbol) {
    return NextResponse.json(
      { message: "Stock Symbol Required" },
      { status: 400 }
    );
  }

  // Set the API
  const apiKey = process.env.FMP_API;

  if (!apiKey) {
    return NextResponse.json(
      { message: "API key is missing" },
      { status: 500 }
    );
  }

  const todaysDate = new Date();
  const retrievalDate = subYears(todaysDate, 20);

  const formattedTodaysDate = format(todaysDate, "yyy-MM-dd");
  const formattedRetrivalDate = format(retrievalDate, "yyy-MM-dd");

  //Create the API endpoint
  const APIEndpoint = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${formattedRetrivalDate}&to=${formattedTodaysDate}&apikey=${apiKey}`;

  // Create Try catch fetch statement
  try {
    const response = await fetch(APIEndpoint);
    if (!response.ok) {
      throw new Error("Network response is not okay");
    }

    // handle the response
    const marketPrice: MarketPriceType = await response.json();
    console.log("success market-price");
    return NextResponse.json(marketPrice, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: " Error fetching market price", details: err },
      { status: 500 }
    );
  }
}
