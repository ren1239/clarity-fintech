"use server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { message: "Query parameter is required" },
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

  const queryString = `https://financialmodelingprep.com/api/v3/search?query=${q}&apikey=${apiKey}`;

  try {
    const response = await fetch(queryString);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const suggestions = await response.json();

    console.log("success");
    return NextResponse.json(suggestions, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Error fetching suggestions", details: err },
      { status: 500 }
    );
  }
}
