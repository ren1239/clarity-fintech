"use client";
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

  function onSubmit(values: z.infer<typeof FormSchema>) {
    if (values.userId !== "guest") {
      createSavingsListing(values);
    }
    const { userId, ...newValues } = values;
    setStateSavingsData(newValues as SavingsData);
  }

  function handleInputChange(field: any) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value ? parseFloat(event.target.value) : null;
      field.onChange(value);
    };
  }

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
                At your current rate of saving, how many years do you expect to
                continue?
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
        <Button className="w-full pt-2" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
