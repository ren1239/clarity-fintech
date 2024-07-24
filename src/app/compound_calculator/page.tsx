import prisma from "@/app/lib/db";
import CompoundGrowthSection from "@/components/CompoundGrowthSection";

export default async function CompoundCalculatorPage() {
  const savingsData = null;
  const params = { id: "guest" };

  return (
    <>
      <CompoundGrowthSection savingsData={savingsData!} userId={params.id} />
    </>
  );
}
