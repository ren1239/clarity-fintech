import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId: string | null = searchParams.get("userId");
  const symbol: string | null = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json(
      { message: "Stock Symbol Required" },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json({ message: "User ID Required" }, { status: 400 });
  }

  try {
    const transactions = await prisma.stock.findMany({
      where: { userId: userId, ticker: symbol },
      select: {
        id: true,
        purchaseDate: true,
        purchasePrice: true,
        quantity: true,
        userId: true,
        ticker: true,
        currency: true,
      },
      orderBy: {
        purchaseDate: "asc",
      },
    });
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
