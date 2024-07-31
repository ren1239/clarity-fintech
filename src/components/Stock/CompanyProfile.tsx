import { APICompanyProfileType } from "@/APItypes";
import Image from "next/image";

export default function CompanyProfile({
  companyProfile,
}: {
  companyProfile: APICompanyProfileType | null;
}) {
  if (!companyProfile) {
    return (
      <div>
        <h1>404 - Not Found</h1>
        <p>No data available </p>
      </div>
    );
  }
  return (
    <>
      <div className="bg-red-500">
        <h1>Stock Symbol: {companyProfile.symbol}</h1>
        <p>Company Name: {companyProfile.companyName}</p>
        <p>Stock Price: {companyProfile.price}</p>
        <p>Currency: {companyProfile.currency}</p>
        <p>Country: {companyProfile.country}</p>
        <p>Sector: {companyProfile.sector}</p>
        <Image
          src={companyProfile.image}
          alt={companyProfile.companyName}
          width={100}
          height={100}
        />
      </div>
    </>
  );
}
