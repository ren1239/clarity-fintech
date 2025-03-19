import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = handleAuth({
  session: {
    cookie: {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
