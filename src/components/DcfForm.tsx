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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { dcfCalculation } from "@/components/Calculations/CalculateDcf";
import { Switch } from "@/components/ui/switch";

import { dcfCalculationType, dcfResultsType } from "@/types";
import { Card, CardHeader, CardTitle } from "./ui/card";

// DCF form setup

const FormSchema = z.object({
  stockPrice: z.number().min(0).max(100000),
  sharesOutstanding: z.number().min(1).max(10000000000),
  stGrowthRate: z.number().min(0).max(100),
  ltGrowthRate: z.number().min(0).max(100),
  discountRate: z.number().min(0).max(100),
  terminalValue: z.number().min(10).max(20),
  stockBasedComp: z.number().min(0).max(100000000),
  netCashDebt: z.number().min(0).max(100000000),
  fcf: z.number().min(0).max(1000000000),
  simpleCalculation: z.boolean(),
});

type DcfFormProps = {
  setDcfResults: React.Dispatch<React.SetStateAction<dcfResultsType | null>>;
  setDcfInput: React.Dispatch<React.SetStateAction<dcfCalculationType>>;
};

export function DcfForm({ setDcfResults, setDcfInput }: DcfFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      stockPrice: 0,
      sharesOutstanding: 100,
      stGrowthRate: 9,
      ltGrowthRate: 5,
      discountRate: 9,
      terminalValue: 15,
      stockBasedComp: 0,
      netCashDebt: 0,
      fcf: 100,
      simpleCalculation: true,
    },
  });

  //Watch if the toggle is true or false for simple calculation
  const simpleCalculation = form.watch("simpleCalculation");

  // Create the submit form Button - update the state with callback funciton
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const results = dcfCalculation(data);
    setDcfResults(results);
    setDcfInput(data);
  };

  //Create the handler to reutern a callback function to parseFloat the input or return null
  function handleInputChange(field: any) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value ? parseFloat(event.target.value) : null;
      field.onChange(value);
    };
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {/* Simple Calculation */}

          <FormField
            control={form.control}
            name="simpleCalculation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                  <FormLabel> Simple Calculation</FormLabel>
                  <FormDescription className="text-xs ">
                    For a simplified Discount Cashflow calculation
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pl-4 space-y-6">
            {/* Shares Outstanding */}
            <FormField
              control={form.control}
              name="sharesOutstanding"
              render={({ field }) => (
                <FormItem className="flex justify-between gap-x-4 items-center">
                  <div>
                    <FormLabel className="flex-1 ">
                      Shares Outstanding
                    </FormLabel>
                    <FormDescription className="text-xs ">
                      The number of shares issued by the company{" "}
                    </FormDescription>
                  </div>
                  <FormControl className="shrink-0 w-[100px] text-right">
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

            {/* Free Cash Flow */}
            <FormField
              control={form.control}
              name="fcf"
              render={({ field }) => (
                <FormItem className="flex justify-between gap-x-4 items-center">
                  <div>
                    <FormLabel className="flex-1 "> Free Cash Flow</FormLabel>
                    <FormDescription className="text-xs ">
                      The money left after paying for business costs
                    </FormDescription>
                  </div>
                  <FormControl className="shrink-0 w-[100px] text-right">
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
          </div>

          <div className="w-full flex gap-4 ">
            {/* Short Term Growth Rate */}
            <Card className="p-4 w-full ">
              <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <CardTitle className="text-center mx-auto">Growth</CardTitle>
              </CardHeader>
              <FormField
                control={form.control}
                name="stGrowthRate"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:flex-row justify-between gap-y-4  pt-12">
                    <div>
                      <FormLabel className="flex-1 ">
                        Short term Growth Rate
                      </FormLabel>
                      <FormDescription className="text-xs ">
                        Annual growth rate for the next 5 years
                      </FormDescription>
                      <span className="text-xs italic font-light text-neutral-400">
                        Recommended (10-25%)
                      </span>
                    </div>
                    <FormControl className="shrink-0 flex-[.2] w-full md:w-[100px] text-right">
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
            </Card>

            {/* Long Term Growth Rate */}
            <Card className="p-4 w-full ">
              <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <CardTitle className="text-center mx-auto">Value</CardTitle>
              </CardHeader>
              <FormField
                control={form.control}
                name="ltGrowthRate"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:flex-row justify-between gap-y-4  pt-12">
                    <div>
                      <FormLabel className="flex-1 ">
                        Long term Growth Rate
                      </FormLabel>
                      <FormDescription className="text-xs ">
                        Annual growth in perpetuity
                      </FormDescription>
                      <span className="text-xs italic font-light text-neutral-400">
                        Recommended (3-5%)
                      </span>
                    </div>
                    <FormControl className="shrink-0 flex-[.2] w-full md:w-[100px] text-right">
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
            </Card>
          </div>
          {!simpleCalculation && (
            <Card className="p-4 space-y-6">
              <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <CardTitle className="text-center mx-auto">
                  Detailed Calculation
                </CardTitle>
              </CardHeader>

              {/* Stock Price */}

              {!simpleCalculation && (
                <FormField
                  control={form.control}
                  name="stockPrice"
                  render={({ field }) => (
                    <FormItem className="flex justify-between gap-x-4 items-center">
                      <div>
                        <FormLabel className="flex-1 ">Stock Price</FormLabel>
                        <FormDescription className="text-xs ">
                          Enter the market trading price
                        </FormDescription>
                        <span className="text-xs italic font-light text-neutral-400 line-clamp-1">
                          Only relevant if you want to calculate the
                          upside/downside
                        </span>
                      </div>
                      <FormControl className="shrink-0 w-[100px] text-right">
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
              )}

              {/* Discount Rate */}
              {!simpleCalculation && (
                <FormField
                  control={form.control}
                  name="discountRate"
                  render={({ field }) => (
                    <FormItem className="flex justify-between gap-x-4 items-center">
                      <div>
                        <FormLabel className="flex-1 ">Discount Rate</FormLabel>
                        <FormDescription className="text-xs ">
                          Discount Rate for a dollar in the future
                        </FormDescription>
                        <span className="text-xs italic font-light text-neutral-400 line-clamp-1">
                          Consider the rate of return and inflation. 10 Year
                          Treasury bond will yield a guaranteed 4.2%
                        </span>
                      </div>
                      <FormControl className="shrink-0 w-[100px] text-right">
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
              )}

              {/* Terminal Value */}
              {!simpleCalculation && (
                <FormField
                  control={form.control}
                  name="terminalValue"
                  render={({ field }) => (
                    <FormItem className="flex justify-between gap-x-4 items-center">
                      <div>
                        <FormLabel className="flex-1 ">
                          Terminal Value
                        </FormLabel>
                        <FormDescription className="text-xs ">
                          Termination multiple for the sale of the business
                        </FormDescription>
                        <span className="text-xs italic font-light text-neutral-400 line-clamp-1">
                          Mohnish Pabrai recommends a multiple of 10-15
                          depending on the quality of the business
                        </span>
                      </div>
                      <FormControl className="shrink-0 w-[100px] text-right">
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
              )}

              {/* Stock Based Compensation */}
              {!simpleCalculation && (
                <FormField
                  control={form.control}
                  name="stockBasedComp"
                  render={({ field }) => (
                    <FormItem className="flex justify-between gap-x-4 items-center">
                      <div>
                        <FormLabel className="flex-1 ">
                          Stock Based Compensation
                        </FormLabel>
                        <FormDescription className="text-xs ">
                          Compensation given to staff as part of the overall
                          payment package
                        </FormDescription>
                        <span className="text-xs italic font-light text-neutral-400 line-clamp-1">
                          Details can be found in the company cashflow statement
                        </span>
                      </div>
                      <FormControl className="shrink-0 w-[100px] text-right">
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
              )}

              {/* Net Cash / Debt */}
              {!simpleCalculation && (
                <FormField
                  control={form.control}
                  name="netCashDebt"
                  render={({ field }) => (
                    <FormItem className="flex justify-between gap-x-4 items-center">
                      <div>
                        <FormLabel className="flex-1 ">
                          Net Cash / Debt
                        </FormLabel>
                        <FormDescription className="text-xs ">
                          Total cash of debt that needs to be settled during the
                          sale of the business
                        </FormDescription>
                        <span className="text-xs italic font-light text-neutral-400 line-clamp-1">
                          Details can be found on the company balance sheet
                        </span>
                      </div>
                      <FormControl className="shrink-0 w-[100px] text-right">
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
              )}
            </Card>
          )}

          <div>
            <Button className="w-full pt-2" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
