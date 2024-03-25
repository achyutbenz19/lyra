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

const Header = () => {
  return (
    <div className="p-2 px-4 flex flex-row justify-between top-0">
      <div className="flex items-center justify-center h-ful">
        <span className="text-2xl font-semibold">lyra.</span>
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
          <SheetFooter>
            <ModeToggle />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
