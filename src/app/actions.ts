"use server";

import prisma from "./lib/db";
import { Savings } from "@prisma/client";

type FormData = {
  userId: string;
  principal: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  numberOfSavingYears: number;
  contribution: number;
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
  } = formData;

  // Check if the user already has a savings listing
  const data = await prisma.savings.findFirst({
    where: {
      userId: userId,
    },
  });

  // If no listing, create a new one
  if (!data) {
    const data = await prisma.savings.create({
      data: {
        userId: userId,
        principal: principal,
        rateOfReturn: rateOfReturn,
        numberOfCompoundingYears: numberOfCompoundingYears,
        numberOfSavingYears: numberOfSavingYears,
        contribution: contribution,
      },
    });
  } else {
    // If listing exists, update it
    const data = await prisma.savings.update({
      where: {
        id: id,
      },
      data: {
        principal: principal,
        rateOfReturn: rateOfReturn,
        numberOfCompoundingYears: numberOfCompoundingYears,
        numberOfSavingYears: numberOfSavingYears,
        contribution: contribution,
      },
    });
    return data;
  }
}
