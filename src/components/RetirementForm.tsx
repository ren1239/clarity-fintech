"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { RetirementDataType } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

//Create the form Schema

const FormSchema = z.object({
  retirementAmount: z.number().min(0),
  rateOfReturn: z.number().min(0.01).max(1),
  numberOfCompoundingYears: z.number().min(1).max(100),
  annualExpenses: z.number().min(1),
  userId: z.string(),
  id: z.string(),
});

export default function RetirementForm({
  userId,
  setStateRetirementData,
}: {
  userId: string;
  setStateRetirementData: React.Dispatch<
    React.SetStateAction<RetirementDataType>
  >;
}) {
  //Call the use form hook and set the default values, the resolver allows type safety to persist

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      retirementAmount: 1000000,
      rateOfReturn: 0.07,
      numberOfCompoundingYears: 30,
      annualExpenses: 35000,
      userId: userId,
      id: "1234",
    },
  });

  //Create the submit form button. Update the state with a callback function.
  function onSubmit(values: z.infer<typeof FormSchema>) {
    if (values.userId !== "guest") {
    }
    const { userId, ...newValues } = values;
    setStateRetirementData(newValues as RetirementDataType);
  }

  //Create the handler to return a callback function to pasefloat the input, or return null
  function handleInputChange(field: any) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value ? parseFloat(event.target.value) : null;
      field.onChange(value);
    };
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
        {/* Retirement Amount */}

        <FormField
          control={form.control}
          name="retirementAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retirement Net Worth</FormLabel>
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

        {/* Rate of Return */}
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

        {/* Number of Compounding Years */}
        <FormField
          control={form.control}
          name="numberOfCompoundingYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total years retired</FormLabel>
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

        {/* Number of Compounding Years */}
        <FormField
          control={form.control}
          name="annualExpenses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Expense</FormLabel>
              <FormDescription className=" text-xs">
                How much do you plan to spend each year?
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
        <div className="lg:pt-[124px]">
          <Button className="w-full pt-2" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
