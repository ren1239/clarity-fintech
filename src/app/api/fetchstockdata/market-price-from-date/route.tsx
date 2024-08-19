"use server";

import { MarketPriceType } from "@/APItypes";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const purchaseDate = searchParams.get("purchaseDate");

  if (!symbol || !purchaseDate) {
    return NextResponse.json(
      { message: "Stock Symbol & Date Required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.FMP_API;

  if (!apiKey) {
    return NextResponse.json(
      { message: "API key is missing" },
      { status: 500 }
    );
  }
  const todaysDate = new Date();
  const formattedTodaysDate = format(todaysDate, "yyyy-MM-dd");

  const APIEndpoint = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${purchaseDate}&to=${formattedTodaysDate}&apikey=${apiKey}`;

  //handle the response
  try {
    const response = await fetch(APIEndpoint);
    if (!response.ok) {
      throw new Error("Network response is not okay");
    }

    const marketPrice: MarketPriceType = await response.json();
    return NextResponse.json(marketPrice, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching market price", details: error },
      { status: 500 }
    );
  }
}
