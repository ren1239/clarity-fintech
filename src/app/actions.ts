"use server";

import { revalidatePath } from "next/cache";
import prisma from "./lib/db";
import { Savings } from "@prisma/client";

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
