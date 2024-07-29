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

// DCF form setup

const FormSchema = z.object({
  stockPrice: z.number().min(1).max(100000),
  sharesOutstanding: z.number().min(1).max(10000000000),
  stGrowthRate: z.number().min(0.01).max(1),
  ltGrowthRate: z.number().min(0.01).max(1),
  discountRate: z.number().min(0.01).max(1),
  terminalValue: z.number().min(10).max(20),
  stockBasedComp: z.number().min(0).max(100000000),
  netCashDebt: z.number().min(0).max(100000000),
  fcf: z.number().min(0).max(1000000000),
  simpleCalculation: z.boolean(),
});

type DcfFormProps = {
  setDcfResults: React.Dispatch<React.SetStateAction<dcfResultsType | null>>;
  setDcfInput: React.Dispatch<React.SetStateAction<dcfCalculationType | null>>;
};

export function DcfForm({ setDcfResults, setDcfInput }: DcfFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      stockPrice: 100,
      sharesOutstanding: 100,
      stGrowthRate: 0.1,
      ltGrowthRate: 0.05,
      discountRate: 0.1,
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
          className="w-1/2 space-y-6"
        >
          {/* Simple Calculation */}

          <FormField
            control={form.control}
            name="simpleCalculation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel> Simple Calculation</FormLabel>
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

          {/* Shares Outstanding */}
          <FormField
            control={form.control}
            name="sharesOutstanding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shares Outstanding</FormLabel>
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

          {/* Short Term Growth Rate */}
          <FormField
            control={form.control}
            name="stGrowthRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short term Growth Rate</FormLabel>
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

          {/* Long Term Growth Rate */}
          <FormField
            control={form.control}
            name="ltGrowthRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long term Growth Rate</FormLabel>
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

          {/* Free Cash Flow */}
          <FormField
            control={form.control}
            name="fcf"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Free Cash Flow</FormLabel>
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

          {/* Stock Price */}

          {!simpleCalculation && (
            <FormField
              control={form.control}
              name="stockPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Price</FormLabel>
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
          )}

          {/* Discount Rate */}
          {!simpleCalculation && (
            <FormField
              control={form.control}
              name="discountRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Rate</FormLabel>
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
          )}

          {/* Terminal Value */}
          {!simpleCalculation && (
            <FormField
              control={form.control}
              name="terminalValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terminal Value</FormLabel>
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
          )}

          {/* Stock Based Compensation */}
          {!simpleCalculation && (
            <FormField
              control={form.control}
              name="stockBasedComp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Based Compensation</FormLabel>
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
          )}

          {/* Net Cash / Debt */}
          {!simpleCalculation && (
            <FormField
              control={form.control}
              name="netCashDebt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Cash / Debt</FormLabel>
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
