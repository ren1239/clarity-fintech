import { APICompanyProfileType } from "@/APItypes";
import { Card, CardDescription, CardTitle } from "./ui/card";
import Image from "next/image";
import { moneyFormatter } from "./Calculations/Formatter";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import Link from "next/link";

export const CompanyBanner = ({
  companyProfile,
}: {
  companyProfile: APICompanyProfileType;
}) => {
  if (!companyProfile) {
    return null;
  }
  return (
    <>
      <Card className="flex flex-row items-center justify-between gap-1 py-2 bg-neutral-100 ">
        <div className="flex items-center gap-x-6 pl-4">
          <Link href={`/stock/${companyProfile.symbol}`}>
            <div className=" flex w-20  md:p-4 md:border-2 rounded-full items-center justify-center  bg-neutral-200 overflow-hidden relative">
              <Image
                className=" scale-75 md:scale-100"
                src={companyProfile.image}
                alt={companyProfile.companyName}
                width={100}
                height={100}
                style={{
                  backgroundSize: "cover",
                  overflow: "hidden",
                }}
              />
            </div>
          </Link>
          <div>
            <div className="">
              <CardTitle className="text-md md:text-2xl flex gap-0 md:gap-2 flex-col md:flex-row md:items-end leading-none line-clamp-1">
                {companyProfile.companyName}
                <span className=" italic font-light text-xs md:text-sm">
                  ({companyProfile.symbol})
                </span>
              </CardTitle>
            </div>
            <CardDescription className="hidden md:flex ">
              {companyProfile.exchange} || {companyProfile.industry}
            </CardDescription>
          </div>
        </div>

        {/* Market Price */}
        <div className="flex gap-x-2 items-center pr-4">
          <p className="md:text-2xl font-semibold">
            {moneyFormatter(companyProfile.price)}{" "}
          </p>
          <div className="flex flex-col justify-end items-end">
            {companyProfile.changes >= 0 ? (
              <div className="flex flex-col justify-center items-center">
                <p className="text-green-600 flex text-xs  md:text-base">
                  <ArrowBigUp className="w-4 h-4 md:w-6 md:h-6" />
                  {moneyFormatter(companyProfile.changes)}
                </p>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <p className="text-red-600 flex text-xs md:text-base">
                  <ArrowBigDown className="w-4 h-4 md:w-6 md:h-6" />
                  {moneyFormatter(companyProfile.changes)}
                </p>
              </div>
            )}
            <p className="text-xs md:text-base font-semibold">
              {companyProfile.currency}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};
