"use server";

import { revalidatePath } from "next/cache";
import prisma from "./lib/db";
import { Savings } from "@prisma/client";

type FormData = {
  userId: string;
  principal: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  numberOfSavingYears: number;
  contribution: number;
  annualExpense: number;
  id: string;
};

export async function createSavingsListing(formData: FormData) {
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
    !userId ||
    !principal ||
    !rateOfReturn ||
    !numberOfCompoundingYears ||
    !numberOfSavingYears ||
    !contribution ||
    !annualExpense
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
