import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size={"sm"} className="font-bold" variant={"outline"} asChild>
            <Link href={"/sign-in"}>Login</Link>
          </Button>
          <Button size={"sm"} className="font-bold" asChild>
            <Link href={"/sign-up"}>Get Trellone for free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
