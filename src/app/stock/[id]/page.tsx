"use server";
// stock/[id]/page.tsx
import React from "react";
import StockPageWrapper from "./index";
import IndividualStockPage from "./IndividualStockPage";
import { APIStockDataWrapper } from "@/APItypes";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <>
      <StockPageWrapper params={{ id }}>
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
