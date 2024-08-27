import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getUserSession() {
  const { getUser } = getKindeServerSession();
  return getUser();
}
