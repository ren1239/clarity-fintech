import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import DecorativeBackground from "./decorative/DecorativeBackground";

export default function HeroPage() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center relative">
        <h1 className=" relative max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl ">
          Financial
          <span className="text-green-700"> freedom </span>begins with clarity.
          <div className="absolute  -top-32 -right-16 hidden lg:w-64 lg:block pointer-events-none"></div>
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          With <span className="text-green-700 font-bold"> Clarity, </span>
          understand where you are today to know where you can be tomorrow.
        </p>
        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-5 ",
          })}
          href="/dashboard"
          target="_blank"
        >
          Get started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
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
                    height={1280}
                    quality={100}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
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
              <span className="text-sm font-medium text-green-800">Step 1</span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Either starting out with a free plan or choose our{" "}
                <Link
                  href="/pricing"
                  className="text-blue-700 underline underline-offset-2"
                >
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-green-800">Step 2</span>
              <span className="text-xl font-semibold">Upload a PDF</span>
              <span className="mt-2 text-zinc-700">
                We will process your pdf for easy viewing and sharing
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-green-800">Step 3</span>
              <span className="text-xl font-semibold">Scribble and Share</span>
              <span className="mt-2 text-zinc-700">
                We make sure you team see your contribution in real time.
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
                width={1419}
                height={732}
                quality={100}
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
