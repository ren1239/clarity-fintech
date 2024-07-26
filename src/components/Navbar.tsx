import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import DropDownBurger from "./DropDownBurger";

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 border-b border-gray-200 bg-white/75 backdrop-blur-md transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <div className=" flex space-x-1 items-center justify-center">
            <div className="flex md:hidden">
              <DropDownBurger />
            </div>
            <Link href={"/"} className=" flex font-semibold tracking-tighter">
              Clarity.
            </Link>
          </div>

          {/* Mobile Navbar  & additional features*/}
          <div className="hidden items-center space-x-4 md:flex">
            {/* <Link
              href="/pricing"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Pricing
            </Link> */}
            <Link
              href={
                user
                  ? `/compound_calculator/${user?.id}`
                  : `/compound_calculator`
              }
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Life Calculator
            </Link>
            <Link
              href="/retirement_calculator"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Retirement
            </Link>
          </div>

          {/* Signin / SignOut */}

          <div className="items-center space-x-4 ">
            {user ? (
              <>
                <LogoutLink
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign out
                </LogoutLink>
              </>
            ) : (
              <>
                <LoginLink
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign in
                </LoginLink>
              </>
            )}

            {/* Try for free / Dashboard */}
            {user ? (
              <>
                <Link
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <RegisterLink
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                >
                  Try for Free
                </RegisterLink>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
