// /stock/[id]/dcf_calculator/page.tsx
import { APIStockDataWrapper } from "@/APItypes";
import StockPageWrapper from "../index";
import DCFCalculatorPage from "./DCFCalculatorPage";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <StockPageWrapper params={params}>
      {(data: APIStockDataWrapper) => {
        if (!data) {
          return <div>Loading...</div>;
        }
        return <DCFCalculatorPage data={data} />;
      }}
    </StockPageWrapper>
  );
};

export default Page;
