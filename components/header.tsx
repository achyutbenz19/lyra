import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <div className="sticky z-20 bg-neutral-50 dark:bg-neutral-950 p-2 px-4 flex flex-row justify-between top-0">
      <div className="flex items-center justify-center h-ful">
        <span
          onClick={() => window.location.reload()}
          className="text-2xl cursor-pointer font-semibold"
        >
          lyra.
        </span>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <div className="border rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer">
            <Menu className="cursor-pointer1 hover:scale-105 text-neutral-900 dark:text-neutral-300" />
          </div>
        </SheetTrigger>
        <SheetContent className="justify-between flex flex-col">
          <SheetHeader>
            <SheetTitle>Chat History</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-center items-center h-full py-4">
            <div className="text-neutral-500">Coming soon!</div>
          </div>
          <SheetFooter className="flex justify-between flex-row-reverse">
            <Button>
              <SignOutButton />
            </Button>
            <ModeToggle />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
