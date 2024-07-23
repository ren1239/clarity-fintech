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

const FormSchema = z.object({
  principal: z
    .number()
    .min(1, "Value must be at least 1")
    .max(1000000, "Value must be at most 1,000,000"),
  rateOfReturn: z.number().min(0.01).max(1),
  numberOfCompoundingYears: z.number().min(1).max(100),
  numberOfSavingYears: z.number().min(1).max(100),
  contribution: z.number().min(0).max(100000),
});

export function SavingsForm({
  onUpdateFormValues,
}: {
  onUpdateFormValues: (values: FormValueTypes) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      principal: 1000,
      rateOfReturn: 0.07,
      numberOfCompoundingYears: 30,
      numberOfSavingYears: 30,
      contribution: 1000,
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    onUpdateFormValues(values);
  }

  function handleInputChange(field: any) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value ? parseFloat(event.target.value) : null;
      field.onChange(value);
    };
  }

  return (
    <Form {...form}>
      <form
        action={"/api/create-savings"}
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-3"
      >
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
