"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, useForm, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod";

export const NewFormSchema: ZodType<FormData> = z.object({
  principal: z.number().min(1).max(10000),
  rateOfReturn: z.number().min(1).max(10000),
});

export type FormData = {
  principal: number;
  rateOfReturn: number;
};

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type ValidFieldNames = "principal" | "rateOfReturn";

export const FormFieldInput: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, { valueAsNumber })}
    />
    {error && <span>{error.message}</span>}
  </>
);

export function NewForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(NewFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("SUCCESS", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormFieldInput
        type="number"
        placeholder="principal"
        name="principal"
        register={register}
        error={errors.principal}
        valueAsNumber
      />
      <FormFieldInput
        type="number"
        placeholder="rateOfReturn"
        name="rateOfReturn"
        register={register}
        error={errors.rateOfReturn}
        valueAsNumber
      />
      <button type="submit">Submit</button>
    </form>
  );
}
