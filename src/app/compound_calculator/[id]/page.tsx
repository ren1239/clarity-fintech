import prisma from "@/app/lib/db";
import CompoundGrowthSection from "@/components/CompoundGrowthSection";

export default async function CompoundCalculatorPage({
  params,
}: {
  params: { id: string };
}) {
  const savingsData = await prisma.savings.findFirst({
    where: {
      userId: params.id,
    },
    select: {
      id: true,
      principal: true,
      rateOfReturn: true,
      numberOfCompoundingYears: true,
      numberOfSavingYears: true,
      contribution: true,
    },
  });

  return (
    <>
      <CompoundGrowthSection savingsData={savingsData!} userId={params.id} />
    </>
  );
}
