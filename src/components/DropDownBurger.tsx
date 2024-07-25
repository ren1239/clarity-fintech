import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { DropdownMenuSubTrigger } from "@radix-ui/react-dropdown-menu";
import { Grip } from "lucide-react";
import Link from "next/link";

export default function DropDownBurger() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Grip className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            href="/pricing"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Pricing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {" "}
          <Link
            href="/compound_calculator"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Life Calculator
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="/retirement_calculator"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Retirement
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
