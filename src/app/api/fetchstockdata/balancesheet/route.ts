"use server";

import { APIBalanceSheetType } from "@/APItypes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

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

  const APIEndpoint = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?limit=10&apikey=${apiKey}`;

  try {
    const response = await fetch(APIEndpoint);
    if (!response.ok) {
      throw new Error("Network response was not okay");
    }
    const balanceSheet: APIBalanceSheetType[] = await response.json();
    return NextResponse.json(balanceSheet, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Error fetching balancesheet data", details: err },
      { status: 500 }
    );
  }
}
