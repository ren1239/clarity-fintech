"use server";
// stock/[id]/page.tsx
import React from "react";
import StockPageWrapper from "./index";
import IndividualStockPage from "./IndividualStockPage";
import { APIStockDataWrapper } from "@/APItypes";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <StockPageWrapper params={params}>
        {(data: APIStockDataWrapper) => {
          if (!data) {
            return <div>Loading...</div>;
          }
          return <IndividualStockPage data={data} />;
        }}
      </StockPageWrapper>
    </>
  );
};

export default Page;
