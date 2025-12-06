// Required for synchronous params in Next.js 15+
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { APIStockDataWrapper } from "@/APItypes";
import StockPageWrapper from "../index";
import DCFCalculatorPage from "./DCFCalculatorPage";
import { getUserSession } from "@/components/Dashboard/Helper/GetUserSession";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { params } = props;
  const { id } = await params;

  const user = await getUserSession();
  if (!user) return redirect("/");

  return (
    <StockPageWrapper params={{ id }}>
      {(data: APIStockDataWrapper) => {
        if (!data) return <div>Loading...</div>;
        return <DCFCalculatorPage data={data} userId={user.id} />;
      }}
    </StockPageWrapper>
  );
}
