"use client";

// React hook form requires client component

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSavingsListing } from "@/app/actions";

import { SavingsData } from "@/types";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { SubmitButton } from "./SubmitButtons";
import { useState } from "react";
import { Card } from "./ui/card";

const FormSchema = z.object({
  principal: z
    .number()
    .min(1, "Value must be at least 1")
    .max(1000000, "Value must be at most 1,000,000"),
  rateOfReturn: z.number().min(0.01).max(1),
  numberOfCompoundingYears: z.number().min(1).max(100),
  numberOfSavingYears: z.number().min(1).max(100),
  contribution: z.number().min(0).max(100000),
  annualExpense: z.number().min(0).max(1000000),
  userId: z.string(),
  id: z.string(),
});

export function SavingsForm({
  dbData,
  userId,
}: {
  dbData: SavingsData;
  userId: any;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      principal: dbData?.principal || 1000,
      rateOfReturn: dbData?.rateOfReturn || 0.07,
      numberOfCompoundingYears: dbData?.numberOfCompoundingYears || 30,
      numberOfSavingYears: dbData?.numberOfSavingYears || 30,
      contribution: dbData?.contribution || 1000,
      annualExpense: dbData?.annualExpense || 350000,
      userId: userId,
      id: dbData?.id || "guestData",
    },
  });

  const [pending, setPending] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setPending(true);
    try {
      await createSavingsListing(values);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setPending(false);
    }
  };

  // const { userId, ...newValues } = values;
  // setStateSavingsData(newValues as SavingsData);

  function handleInputChange(field: any) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.value !== "" ? parseFloat(event.target.value) : null;
      field.onChange(value);
    };
  }

  return (
    <Card className="p-4 h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-between h-full"
        >
          <FormField
            control={form.control}
            name="principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principal</FormLabel>
                <FormDescription className=" text-xs">
                  What is your starting point?
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
                <FormLabel>Total years</FormLabel>
                <FormDescription className=" text-xs">
                  The average male expects to live until 87 years old
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
                <FormLabel>Years to retirement</FormLabel>
                <FormDescription className=" text-xs">
                  How many years will you save for?
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
                <FormLabel>Annually savings</FormLabel>
                <FormDescription className=" text-xs">
                  How much money can you save each year
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
            name="annualExpense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annually expense</FormLabel>
                <FormDescription className=" text-xs">
                  How much money do you expect to spend?
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
          <div className="pt-4">
            <SubmitButton pending={pending} />
          </div>
        </form>
      </Form>
    </Card>
  );
}
