"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { TopPicksTable } from "@/components/TopPicks/TopPicksTable";
import { Card } from "@/components/ui/card";

export default function TopPicksPage() {
  return (
    <MaxWidthWrapper className="py-8">
      <Card
        className="p-6  py-4
      "
      >
        <h1 className="text-2xl font-bold mb-6">Our Picks - December 2025</h1>
        <div className="">
          <p className="text-muted-foreground mb-4">
            Companies we are personally looking into
          </p>
          <div className="border rounded-lg p-4">
            <TopPicksTable />
          </div>
        </div>
        <div className="text-xs text-muted-foreground bg-muted rounded-lg p-4 my-4">
          Disclaimer: This is not financial advice. All investments involve
          risk, including the possible loss of principal. Past performance is no
          guarantee of future results. Please consult with a licensed financial
          advisor before making any investment decisions.
        </div>
      </Card>
    </MaxWidthWrapper>
  );
}
