"use server";

import { APICashflowStatementType } from "@/APItypes";
import { NextRequest, NextResponse } from "next/server";

//create a generic get request

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

  const APIEndpoint = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=10&apikey=${apiKey}`;

  try {
    const response = await fetch(APIEndpoint);
    if (!response.ok) {
      throw new Error("Network response was not okay");
    }
    const cashflowStatement: APICashflowStatementType[] = await response.json();

    return NextResponse.json(cashflowStatement, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Error fetching cashflow data", details: err },
      { status: 500 }
    );
  }
}
