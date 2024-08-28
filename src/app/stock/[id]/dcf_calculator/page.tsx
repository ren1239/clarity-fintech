// /stock/[id]/dcf_calculator/page.tsx
import { APIStockDataWrapper } from "@/APItypes";
import StockPageWrapper from "../index";
import DCFCalculatorPage from "./DCFCalculatorPage";
import { getUserSession } from "@/components/Dashboard/Helper/GetUserSession";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await getUserSession();
  if (!user) {
    return redirect("/");
  }

  return (
    <StockPageWrapper params={params}>
      {(data: APIStockDataWrapper) => {
        if (!data) {
          return <div>Loading...</div>;
        }
        return <DCFCalculatorPage data={data} userId={user.id} />;
      }}
    </StockPageWrapper>
  );
};

export default Page;
