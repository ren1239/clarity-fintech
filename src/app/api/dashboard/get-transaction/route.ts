import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId: string | null = searchParams.get("userId");
  const transactionId: string | null = searchParams.get("transactionId");

  if (!transactionId) {
    return NextResponse.json(
      { message: "Transaction Id Required" },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json({ message: "User ID Required" }, { status: 400 });
  }

  try {
    const transaction = await prisma.stock.findUnique({
      where: { userId: userId, id: transactionId },
      select: {
        id: true,
        purchaseDate: true,
        purchasePrice: true,
        quantity: true,
        userId: true,
        ticker: true,
        currency: true,
      },
    });
    console.log(transaction);
    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
