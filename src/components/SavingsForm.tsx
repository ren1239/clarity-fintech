"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormValueTypes } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSavingsListing } from "@/app/actions";
import prisma from "@/app/lib/db";
import { useEffect, useState } from "react";

type SavingsData = {
  principal: number;
  rateOfReturn: number;
  numberOfCompoundingYears: number;
  numberOfSavingYears: number;
  contribution: number;
  id: string;
};

const FormSchema = z.object({
  principal: z
    .number()
    .min(1, "Value must be at least 1")
    .max(1000000, "Value must be at most 1,000,000"),
  rateOfReturn: z.number().min(0.01).max(1),
  numberOfCompoundingYears: z.number().min(1).max(100),
  numberOfSavingYears: z.number().min(1).max(100),
  contribution: z.number().min(0).max(100000),
  userId: z.string(),
  id: z.string(),
});

export function SavingsForm({
  savingsData,
  userId,
  setStateSavingsData,
}: {
  savingsData: SavingsData;
  userId: any;
  setStateSavingsData: React.Dispatch<React.SetStateAction<SavingsData>>;
}) {
  // const [data, setData] = useState<SavingsData | null>(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     const fetchedData = await prisma.savings.findFirst({
  //       where: { userId: userId },
  //       select: {
  //         id: true,
  //         principal: true,
  //         rateOfReturn: true,
  //         numberOfCompoundingYears: true,
  //         numberOfSavingYears: true,
  //         contribution: true,
  //       },
  //     });
  //     setData(fetchedData);
  //   }

  //   fetchData();
  // }, [userId]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      principal: savingsData?.principal || 1000,
      rateOfReturn: savingsData?.rateOfReturn || 0.07,
      numberOfCompoundingYears: savingsData?.numberOfCompoundingYears || 30,
      numberOfSavingYears: savingsData?.numberOfSavingYears || 30,
      contribution: savingsData?.contribution || 1000,
      userId: userId,
      id: savingsData?.id || "1234",
    },
  });

  // useEffect(() => {
  //   if (data) {
  //     form.reset({
  //       principal: data.principal,
  //       rateOfReturn: data.rateOfReturn,
  //       numberOfCompoundingYears: data.numberOfCompoundingYears,
  //       numberOfSavingYears: data.numberOfSavingYears,
  //       contribution: data.contribution,
  //       userId: userId,
  //     });
  //   }
  // }, [data, form, userId]);

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    // onUpdateFormValues(values);
    createSavingsListing(values);
    const { userId, ...newValues } = values;
    setStateSavingsData(newValues as SavingsData);
  }

  function handleInputChange(field: any) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value ? parseFloat(event.target.value) : null;
      field.onChange(value);
    };
  }
  console.log("id", savingsData?.id);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        <FormField
          control={form.control}
          name="principal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Principal</FormLabel>
              <FormDescription className=" text-xs">
                What is the total amount of money you have?
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={handleInputChange(field)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rateOfReturn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate of Return</FormLabel>
              <FormDescription className=" text-xs">
                The S&P has returned 10% over the last 30 years
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={handleInputChange(field)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfCompoundingYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many years before retirement</FormLabel>
              <FormDescription className=" text-xs">
                Pick a number that you think you will likely be able to retire
                by
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={handleInputChange(field)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfSavingYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many years will you save?</FormLabel>
              <FormDescription className=" text-xs">
                At your current rate of saving, how many more years can you keep
                this up?
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={handleInputChange(field)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How much can you save annually?</FormLabel>
              <FormDescription className=" text-xs">
                How much money can you save each year after you exclude your
                expenses?
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={handleInputChange(field)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full pt-2" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
