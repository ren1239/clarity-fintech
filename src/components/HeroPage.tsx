import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import DecorativeBackground from "./decorative/DecorativeBackground";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function HeroPage() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center relative">
        <h1 className=" relative max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl ">
          Financial
          <span className="text-primary"> freedom </span>begins with clarity.
          <div className="absolute  -top-32 -right-16 hidden lg:w-64 lg:block pointer-events-none"></div>
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          With <span className="text-primary font-bold"> Clarity, </span>
          understand where you are today to know where you can be tomorrow.
        </p>

        <RegisterLink
          className={buttonVariants({
            variant: "default",
            size: "lg",
            className: "mt-8 text-lg",
          })}
        >
          Get started <ArrowRight className="ml-2 h-5 w-5" />
        </RegisterLink>
      </MaxWidthWrapper>

      {/* Value Proposition Section */}

      <div>
        <div className="relative ">
          <div className="absolute hidden lg:w-64 lg:block pointer-events-none"></div>
          <DecorativeBackground />

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src="/dashboard-preview.jpg"
                    alt="product preview"
                    width={1920}
                    height={1200}
                    quality={100}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-2 shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add the decorator Back */}
          <DecorativeBackground />
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto mb-36 mt-32 max-w-5xl sm:mt-56 ">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center ">
            <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl ">
              Start planning in <span className="text-primary">minutes</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Set your starting point and view your future
            </p>
          </div>
        </div>

        {/* Steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 1</span>
              <span className="text-xl font-semibold">
                Sign up for{" "}
                <span className="text-primary font-semibold">Free!</span>
              </span>
              <span className="mt-2 text-zinc-700">
                Use your favorite quick sign-up method to get an account
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 2</span>
              <span className="text-xl font-semibold">Start here!</span>
              <span className="mt-2 text-zinc-700">
                Answer 5 questions on where you're starting out
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 3</span>
              <span className="text-xl font-semibold">Let us work!</span>
              <span className="mt-2 text-zinc-700">
                We'll do the investment calculation and watch your future grow!
              </span>
            </div>
          </li>
        </ol>

        {/*  Final Image */}

        <div className="mx-auto max-w-6xl px-6 lg:px-8 relative">
          <DecorativeBackground />

          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/file-upload-preview.jpg"
                alt="uploading preview"
                width={1920}
                height={1200}
                quality={100}
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>

        {/*  Final Image */}

        <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center relative">
          <h1 className=" relative max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl ">
            Stock analysis <br />
            <span className="text-primary"> Toolkit </span>
            <div className="absolute  -top-32 -right-16 hidden lg:w-64 lg:block pointer-events-none"></div>
          </h1>
          <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
            <span className="text-primary text-xs"> Coming Soon... </span>
          </p>
          <p>
            Money is the tool |
            <span className="text-primary font-bold text-lg pt-10">
              {" "}
              freedom{" "}
            </span>
            is the goal
          </p>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
