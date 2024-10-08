"use server";

import { revalidatePath } from "next/cache";
import prisma from "./lib/db";

type SavingFormDataType = {
  userId: string;
  principal: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  numberOfSavingYears: number;
  contribution: number;
  annualExpense: number;
  id: string;
};

export async function createSavingsListing(formData: SavingFormDataType) {
  const {
    userId,
    principal,
    rateOfReturn,
    numberOfCompoundingYears,
    numberOfSavingYears,
    contribution,
    id,
    annualExpense,
  } = formData;

  if (
    userId === undefined ||
    principal === undefined ||
    rateOfReturn === undefined ||
    numberOfCompoundingYears === undefined ||
    numberOfSavingYears === undefined ||
    contribution === undefined ||
    annualExpense === undefined
  ) {
    throw new Error("All fields are required");
  }
  try {
    // Check if the user already has a savings listing
    const data = await prisma.savings.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!data) {
      // If no listing, create a new one
      await prisma.savings.create({
        data: {
          userId: userId,
          principal: principal,
          rateOfReturn: rateOfReturn,
          numberOfCompoundingYears: numberOfCompoundingYears,
          numberOfSavingYears: numberOfSavingYears,
          contribution: contribution,
          annualExpense: annualExpense,
        },
      });
    } else {
      // If listing exists, update it
      await prisma.savings.update({
        where: {
          id: id,
        },
        data: {
          principal: principal,
          rateOfReturn: rateOfReturn,
          numberOfCompoundingYears: numberOfCompoundingYears,
          numberOfSavingYears: numberOfSavingYears,
          contribution: contribution,
          annualExpense: annualExpense,
        },
      });
    }

    // Revalidate the path after the database operation is complete
    revalidatePath(`/compound_
      calculator/${userId}`);
    return { success: true };

    // Error catching
  } catch (error) {
    console.error("Error creating or updating savings listing:", error);
    throw new Error(
      "An error occurred while processing your request. Please try again later."
    );
  }
}

type PortfolioFormDataType = {
  ticker: string;
  purchaseDate: Date;
  purchasePrice: number;
  quantity: number;
  currency: string;
  country: string;
  sector?: string;
  industry?: string;
  exchange?: string;
  userId: string;
};

export async function createPortfolioInput(formData: PortfolioFormDataType) {
  const {
    country,
    currency,
    purchaseDate,
    purchasePrice,
    quantity,
    ticker,
    userId,
    exchange,
    sector,
    industry,
  } = formData;

  if (
    userId === undefined ||
    ticker === undefined ||
    quantity === undefined ||
    purchasePrice === undefined ||
    purchaseDate === undefined ||
    currency === undefined ||
    country === undefined
  ) {
    throw new Error("All fields are required");
  }

  try {
    if (userId) {
      await prisma.stock.create({
        data: {
          userId: userId,
          ticker: ticker,
          purchaseDate: purchaseDate,
          purchasePrice: purchasePrice,
          quantity: quantity,
          currency: currency,
          country: country,
          exchange: exchange,
          sector: sector,
          industry: industry,
        },
      });

      // // Ensure the path is correct and revalidation is supported
      revalidatePath(`/dashboard/${userId}`);

      return { success: true };
    }
  } catch (error) {
    console.error("Error creating portfolio input:", error);
    throw new Error("Failed to create portfolio input");
  }
}

type EditFormDataType = {
  ticker: string;
  purchaseDate: Date;
  purchasePrice: number;
  quantity: number;
  userId: string;
  id: string;
};

export async function editPortfolioInput(formData: EditFormDataType) {
  const { purchaseDate, purchasePrice, quantity, id, userId } = formData;

  if (
    quantity === undefined ||
    purchasePrice === undefined ||
    purchaseDate === undefined ||
    id === undefined
  ) {
    throw new Error("All fields are required");
  }

  try {
    if (userId) {
      await prisma.stock.update({
        where: { id: id },
        data: {
          purchaseDate: purchaseDate,
          purchasePrice: purchasePrice,
          quantity: quantity,
        },
      });

      // // Ensure the path is correct and revalidation is supported
      revalidatePath(`/dashboard/${userId}`);

      return { success: true };
    }
  } catch (error) {
    console.error("Error creating portfolio input:", error);
    throw new Error("Failed to create portfolio input");
  }
}

export async function postPriceTarget({
  symbol,
  currency,
  priceTarget,
  userId,
}: {
  symbol: string;
  currency: string;
  priceTarget: number;
  userId: string;
}): Promise<{ success: boolean; message: string; data?: any }> {
  if (!symbol || !currency || priceTarget === undefined || !userId) {
    throw new Error("Error posting Price Target: All fields are required");
  }

  try {
    const stockInPortfolio = await prisma.stock.findFirst({
      where: {
        ticker: symbol,
        userId: userId,
      },
    });

    const priceTargetData = {
      ticker: symbol,
      priceTarget: priceTarget,
      currency: currency,
      userId: userId,
      stockId: stockInPortfolio?.id || null,
    };

    console.log(priceTargetData, "checking price target data");

    await prisma.priceTarget.create({
      data: priceTargetData,
    });

    return {
      success: true,
      message: "Price Target successfully posted",
      data: priceTarget,
    };
  } catch (error: any) {
    throw new Error(`Error posting Price Target: ${error.message}`);
  }
}
