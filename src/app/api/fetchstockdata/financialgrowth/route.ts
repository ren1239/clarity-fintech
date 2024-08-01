"use server";

import { APIFinancialGrowthType } from "@/APItypes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  console.log("here in financial-growth");

  if (!symbol) {
    return NextResponse.json(
      { message: "Stock Symbol Required" },
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

  const APIEndpoint = `https://financialmodelingprep.com/api/v3/financial-growth/${symbol}?limit=10&apikey=${apiKey}`;
  try {
    const response = await fetch(APIEndpoint);
    if (!response.ok) {
      throw new Error("Network response was not okay");
    }
    const financialGrowth: APIFinancialGrowthType[] = await response.json();

    console.log("success financial-growth");
    return NextResponse.json(financialGrowth, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Error fetching financial growth",
        details: err,
      },
      { status: 500 }
    );
  }
}
