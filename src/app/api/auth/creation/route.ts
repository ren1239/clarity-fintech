import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  //We dont want nextJs to store the previous user
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong, no user");
  }

  let dbUser = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        id: user.id,
        profileImage: `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
  }
  return NextResponse.redirect("https://clarity-fintech.vercel.app");
}
